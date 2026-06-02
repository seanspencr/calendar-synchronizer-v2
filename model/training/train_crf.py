import os
import pickle
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns
import sklearn_crfsuite
from sklearn.metrics import confusion_matrix
from seqeval.metrics import classification_report as seq_report
from bio_tag import get_bio_tagged_split

RANDOM_SEED = 42
N = 5000
PLOTS_DIR = "./plots"
ENTITY_LABELS = ["EVENT", "DATE", "START_TIME", "END_TIME", "RECURRENCE"]
ALL_BIO_LABELS = ["O"] + [f"B-{l}" for l in ENTITY_LABELS] + [f"I-{l}" for l in ENTITY_LABELS]


def word2features(sentence, i):
    word = sentence[i]
    features = {
        "bias": 1.0,
        "word.lower": word.lower(),
        "word[-3:]": word[-3:],
        "word[-2:]": word[-2:],
        "word[:3]": word[:3],
        "word[:2]": word[:2],
        "word.isupper": word.isupper(),
        "word.istitle": word.istitle(),
        "word.isdigit": word.isdigit(),
    }
    if i > 0:
        prev = sentence[i - 1]
        features["-1:word.lower"] = prev.lower()
        features["-1:word.istitle"] = prev.istitle()
        features["-1:word.isupper"] = prev.isupper()
    else:
        features["BOS"] = True

    if i < len(sentence) - 1:
        nxt = sentence[i + 1]
        features["+1:word.lower"] = nxt.lower()
        features["+1:word.istitle"] = nxt.istitle()
        features["+1:word.isupper"] = nxt.isupper()
    else:
        features["EOS"] = True

    return features


def plot_confusion_matrix(y_true, y_pred, labels, filepath):
    cm = confusion_matrix(y_true, y_pred, labels=labels, normalize="true")
    plt.figure(figsize=(10, 8))
    sns.heatmap(cm, annot=True, fmt=".2%", xticklabels=labels, yticklabels=labels, cmap="Blues")
    plt.title("CRF — Token-Level Confusion Matrix")
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
    plt.title("CRF — Per-Class F1 (Entity Tags)")
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

    X_train_feats = [[word2features(sent, i) for i in range(len(sent))] for sent in X_train]
    X_test_feats = [[word2features(sent, i) for i in range(len(sent))] for sent in X_test]

    crf = sklearn_crfsuite.CRF(
        algorithm="lbfgs",
        c1=0.1,
        c2=0.1,
        max_iterations=100,
        all_possible_transitions=True,
    )
    crf.fit(X_train_feats, y_train)
    y_pred = crf.predict(X_test_feats)

    y_test_flat = [tag for sent in y_test for tag in sent]
    y_pred_flat = [tag for sent in y_pred for tag in sent]

    accuracy = np.mean(np.array(y_test_flat) == np.array(y_pred_flat))
    print(f"\nAccuracy: {accuracy:.4f}")

    print("\n=== Entity-Level (seqeval) Report ===")
    print(seq_report(y_test, y_pred, digits=4))

    plot_confusion_matrix(y_test_flat, y_pred_flat, ALL_BIO_LABELS,
                          os.path.join(PLOTS_DIR, "crf_confusion_matrix.png"))

    seq_rep = seq_report(y_test, y_pred, output_dict=True, digits=4)
    entity_f1 = {}
    for label in ENTITY_LABELS:
        if label in seq_rep:
            entity_f1[label] = seq_rep[label]["f1-score"]
    plot_f1_per_class(entity_f1, os.path.join(PLOTS_DIR, "crf_f1_per_class.png"))

    macro_p = np.mean([v["precision"] for v in seq_rep.values() if isinstance(v, dict) and "precision" in v])
    macro_r = np.mean([v["recall"] for v in seq_rep.values() if isinstance(v, dict) and "recall" in v])
    macro_f1 = np.mean([v["f1-score"] for v in seq_rep.values() if isinstance(v, dict) and "f1-score" in v])
    print(f"\n{'Model':15s} | {'Accuracy':8s} | {'Macro P':8s} | {'Macro R':8s} | {'Macro F1':8s}")
    print("-" * 55)
    print(f"{'CRF':15s} | {accuracy*100:6.2f}%  | {macro_p:6.3f}  | {macro_r:6.3f}  | {macro_f1:6.3f}")

    os.makedirs("output", exist_ok=True)
    with open("output/crf.pkl", "wb") as f:
        pickle.dump(crf, f)
    print("Model saved to output/crf.pkl")


if __name__ == "__main__":
    main()
