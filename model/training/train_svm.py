import os
import pickle
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.feature_extraction import DictVectorizer
from sklearn.svm import LinearSVC
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, confusion_matrix
from seqeval.metrics import classification_report as seq_report
from bio_tag import get_bio_tagged_split

RANDOM_SEED = 42
N = 5000
PLOTS_DIR = "./plots"
ENTITY_LABELS = ["EVENT", "DATE", "START_TIME", "END_TIME", "RECURRENCE"]
ALL_BIO_LABELS = ["O"] + [f"B-{l}" for l in ENTITY_LABELS] + [f"I-{l}" for l in ENTITY_LABELS]


def extract_features(tokens, i):
    word = tokens[i]
    features = {
        "word": word,
        "word.lower": word.lower(),
        "word.isupper": word.isupper(),
        "word.istitle": word.istitle(),
        "word.isdigit": word.isdigit(),
        "prefix_2": word[:2],
        "prefix_3": word[:3],
        "suffix_2": word[-2:],
        "suffix_3": word[-3:],
    }
    if i > 0:
        prev = tokens[i - 1]
        features["prev_word"] = prev.lower()
        features["prev_word.isupper"] = prev.isupper()
        features["prev_word.istitle"] = prev.istitle()
    else:
        features["prev_word"] = "<START>"
        features["prev_word.isupper"] = False
        features["prev_word.istitle"] = False

    if i < len(tokens) - 1:
        nxt = tokens[i + 1]
        features["next_word"] = nxt.lower()
        features["next_word.isupper"] = nxt.isupper()
        features["next_word.istitle"] = nxt.istitle()
    else:
        features["next_word"] = "<END>"
        features["next_word.isupper"] = False
        features["next_word.istitle"] = False

    return features


def plot_confusion_matrix(y_true, y_pred, labels, filepath):
    cm = confusion_matrix(y_true, y_pred, labels=labels, normalize="true")
    plt.figure(figsize=(10, 8))
    sns.heatmap(cm, annot=True, fmt=".2%", xticklabels=labels, yticklabels=labels, cmap="Blues")
    plt.title("SVM — Token-Level Confusion Matrix")
    plt.xlabel("Predicted")
    plt.ylabel("True")
    plt.tight_layout()
    plt.savefig(filepath, dpi=150)
    plt.close()
    print(f"  Saved: {filepath}")


def plot_f1_per_class(class_f1, filepath):
    labels = list(class_f1.keys())
    scores = list(class_f1.values())
    colors = []
    for s in scores:
        if s < 0.5:
            colors.append("red")
        elif s < 0.75:
            colors.append("gold")
        else:
            colors.append("green")
    plt.figure(figsize=(8, 5))
    bars = plt.barh(labels, scores, color=colors)
    plt.xlim(0, 1)
    plt.xlabel("F1 Score")
    plt.title("SVM — Per-Class F1 (Entity Tags)")
    for bar, score in zip(bars, scores):
        plt.text(bar.get_width() + 0.01, bar.get_y() + bar.get_height() / 2,
                 f"{score:.3f}", va="center")
    plt.tight_layout()
    plt.savefig(filepath, dpi=150)
    plt.close()
    print(f"  Saved: {filepath}")


def main():
    np.random.seed(RANDOM_SEED)
    os.makedirs(PLOTS_DIR, exist_ok=True)

    print(f"Loading {N} BIO-tagged samples...")
    X_train, X_test, y_train, y_test = get_bio_tagged_split(n=N, test_size=0.2, seed=RANDOM_SEED)

    X_train_flat = []
    y_train_flat = []
    for sent_tokens, sent_tags in zip(X_train, y_train):
        for i, token in enumerate(sent_tokens):
            X_train_flat.append(extract_features(sent_tokens, i))
            y_train_flat.append(sent_tags[i])

    X_test_flat = []
    y_test_flat = []
    for sent_tokens, sent_tags in zip(X_test, y_test):
        for i, token in enumerate(sent_tokens):
            X_test_flat.append(extract_features(sent_tokens, i))
            y_test_flat.append(sent_tags[i])

    vec = DictVectorizer(sparse=True)
    X_train_vec = vec.fit_transform(X_train_flat)
    X_test_vec = vec.transform(X_test_flat)

    le = LabelEncoder()
    le.fit(ALL_BIO_LABELS)
    y_train_enc = le.transform(y_train_flat)
    y_test_enc = le.transform(y_test_flat)

    clf = LinearSVC(C=1.0, class_weight="balanced", random_state=RANDOM_SEED, max_iter=2000)
    clf.fit(X_train_vec, y_train_enc)

    y_pred_enc = clf.predict(X_test_vec)
    y_pred = le.inverse_transform(y_pred_enc)

    accuracy = np.mean(y_pred == y_test_flat)
    print(f"\nAccuracy: {accuracy:.4f}")

    print("\n=== Token-Level Classification Report ===")
    print(classification_report(y_test_flat, y_pred, labels=ALL_BIO_LABELS, zero_division=0))

    print("\n=== Entity-Level (seqeval) Report ===")
    y_test_sent = []
    y_pred_sent = []
    idx = 0
    for sent in y_test:
        sent_len = len(sent)
        y_test_sent.append(y_test_flat[idx:idx + sent_len])
        y_pred_sent.append(y_pred[idx:idx + sent_len].tolist())
        idx += sent_len
    print(seq_report(y_test_sent, y_pred_sent, digits=4))

    plot_confusion_matrix(y_test_flat, y_pred, ALL_BIO_LABELS,
                          os.path.join(PLOTS_DIR, "svm_confusion_matrix.png"))

    seq_rep = seq_report(y_test_sent, y_pred_sent, output_dict=True, digits=4)
    entity_f1 = {}
    for label in ENTITY_LABELS:
        if label in seq_rep:
            entity_f1[label] = seq_rep[label]["f1-score"]
    plot_f1_per_class(entity_f1, os.path.join(PLOTS_DIR, "svm_f1_per_class.png"))

    macro_p = np.mean([v["precision"] for v in seq_rep.values() if isinstance(v, dict) and v.get("precision") is not None])
    macro_r = np.mean([v["recall"] for v in seq_rep.values() if isinstance(v, dict) and v.get("recall") is not None])
    macro_f1 = np.mean([v["f1-score"] for v in seq_rep.values() if isinstance(v, dict) and v.get("f1-score") is not None])
    print(f"\n{'Model':15s} | {'Accuracy':8s} | {'Macro P':8s} | {'Macro R':8s} | {'Macro F1':8s}")
    print("-" * 55)
    print(f"{'SVM':15s} | {accuracy*100:6.2f}%  | {macro_p:6.3f}  | {macro_r:6.3f}  | {macro_f1:6.3f}")

    model = {"clf": clf, "vec": vec, "le": le}
    os.makedirs("output", exist_ok=True)
    with open("output/svm.pkl", "wb") as f:
        pickle.dump(model, f)
    print("Model saved to output/svm.pkl")


if __name__ == "__main__":
    main()
