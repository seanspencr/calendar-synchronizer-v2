import os
import pickle
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns
import sklearn_crfsuite
from sklearn.feature_extraction.text import TfidfVectorizer
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


def word2features_tfidf(sentence, i, tfidf_scores, tfidf_buckets):
    features = word2features(sentence, i)
    features["tfidf_score"] = float(tfidf_scores[i])
    features["tfidf_bucket"] = tfidf_buckets[i]
    return features


def extract_tfidf_per_token(sentences, tfidf_matrix, vec):
    feature_names = vec.get_feature_names_out()
    all_scores = []
    all_buckets = []
    for sent_idx, sent in enumerate(sentences):
        row = tfidf_matrix[sent_idx].toarray().flatten()
        scores = []
        buckets = []
        for token in sent:
            matches = np.where(feature_names == token.lower())[0]
            score = row[matches[0]] if len(matches) > 0 else 0.0
            scores.append(score)
            if score < 0.3:
                buckets.append("low")
            elif score < 0.6:
                buckets.append("mid")
            else:
                buckets.append("high")
        all_scores.append(scores)
        all_buckets.append(buckets)
    return all_scores, all_buckets


def plot_confusion_matrix(y_true, y_pred, labels, filepath, title=""):
    cm = confusion_matrix(y_true, y_pred, labels=labels, normalize="true")
    plt.figure(figsize=(10, 8))
    sns.heatmap(cm, annot=True, fmt=".2%", xticklabels=labels, yticklabels=labels, cmap="Blues")
    plt.title(title or "Token-Level Confusion Matrix")
    plt.xlabel("Predicted")
    plt.ylabel("True")
    plt.tight_layout()
    plt.savefig(filepath, dpi=150)
    plt.close()
    print(f"  Saved: {filepath}")


def plot_f1_per_class(class_f1, filepath, title=""):
    labels = list(class_f1.keys())
    scores = list(class_f1.values())
    colors = ["red" if s < 0.5 else "gold" if s < 0.75 else "green" for s in scores]
    plt.figure(figsize=(8, 5))
    bars = plt.barh(labels, scores, color=colors)
    plt.xlim(0, 1)
    plt.xlabel("F1 Score")
    plt.title(title or "Per-Class F1 (Entity Tags)")
    for bar, score in zip(bars, scores):
        plt.text(bar.get_width() + 0.01, bar.get_y() + bar.get_height() / 2,
                 f"{score:.3f}", va="center")
    plt.tight_layout()
    plt.savefig(filepath, dpi=150)
    plt.close()
    print(f"  Saved: {filepath}")


def plot_comparison(crf_f1, tfidf_f1, filepath):
    labels = list(crf_f1.keys())
    x = np.arange(len(labels))
    width = 0.35
    crf_scores = [crf_f1.get(l, 0) for l in labels]
    tfidf_scores = [tfidf_f1.get(l, 0) for l in labels]
    plt.figure(figsize=(10, 6))
    plt.bar(x - width / 2, crf_scores, width, label="CRF")
    plt.bar(x + width / 2, tfidf_scores, width, label="CRF + TF-IDF")
    plt.xticks(x, labels, rotation=45)
    plt.ylabel("F1 Score")
    plt.title("CRF vs CRF + TF-IDF — Per-Class F1 Comparison")
    plt.legend()
    plt.ylim(0, 1)
    plt.tight_layout()
    plt.savefig(filepath, dpi=150)
    plt.close()
    print(f"  Saved: {filepath}")


def train_and_evaluate_crf(X_train_feats, y_train, X_test_feats, y_test):
    crf = sklearn_crfsuite.CRF(
        algorithm="lbfgs", c1=0.1, c2=0.1, max_iterations=100,
        all_possible_transitions=True,
    )
    crf.fit(X_train_feats, y_train)
    y_pred = crf.predict(X_test_feats)
    return crf, y_pred


def main():
    np.random.seed(RANDOM_SEED)
    os.makedirs(PLOTS_DIR, exist_ok=True)

    print(f"Loading {N} BIO-tagged samples...")
    X_train, X_test, y_train, y_test = get_bio_tagged_split(n=N, test_size=0.2, seed=RANDOM_SEED)

    X_train_texts = [" ".join(sent) for sent in X_train]
    X_test_texts = [" ".join(sent) for sent in X_test]

    vec = TfidfVectorizer()
    vec.fit(X_train_texts)
    train_tfidf = vec.transform(X_train_texts)
    test_tfidf = vec.transform(X_test_texts)

    train_scores, train_buckets = extract_tfidf_per_token(X_train, train_tfidf, vec)
    test_scores, test_buckets = extract_tfidf_per_token(X_test, test_tfidf, vec)

    X_train_feats_basic = [[word2features(sent, i) for i in range(len(sent))] for sent in X_train]
    X_test_feats_basic = [[word2features(sent, i) for i in range(len(sent))] for sent in X_test]

    X_train_feats_tfidf = [
        [word2features_tfidf(sent, i, train_scores[si], train_buckets[si])
         for i in range(len(sent))]
        for si, sent in enumerate(X_train)
    ]
    X_test_feats_tfidf = [
        [word2features_tfidf(sent, i, test_scores[si], test_buckets[si])
         for i in range(len(sent))]
        for si, sent in enumerate(X_test)
    ]

    print("\nTraining plain CRF...")
    crf_basic, y_pred_basic = train_and_evaluate_crf(X_train_feats_basic, y_train, X_test_feats_basic, y_test)

    print("Training CRF + TF-IDF...")
    crf_tfidf, y_pred_tfidf = train_and_evaluate_crf(X_train_feats_tfidf, y_train, X_test_feats_tfidf, y_test)

    y_test_flat = [t for s in y_test for t in s]
    y_pred_basic_flat = [t for s in y_pred_basic for t in s]
    y_pred_tfidf_flat = [t for s in y_pred_tfidf for t in s]

    acc_basic = np.mean(np.array(y_test_flat) == np.array(y_pred_basic_flat))
    acc_tfidf = np.mean(np.array(y_test_flat) == np.array(y_pred_tfidf_flat))

    print(f"\nPlain CRF Accuracy:      {acc_basic:.4f}")
    print(f"CRF + TF-IDF Accuracy:   {acc_tfidf:.4f}")

    print("\n=== CRF Entity-Level (seqeval) ===")
    rep_basic = seq_report(y_test, y_pred_basic, output_dict=True, digits=4)
    print(seq_report(y_test, y_pred_basic, digits=4))

    print("\n=== CRF + TF-IDF Entity-Level (seqeval) ===")
    rep_tfidf = seq_report(y_test, y_pred_tfidf, output_dict=True, digits=4)
    print(seq_report(y_test, y_pred_tfidf, digits=4))

    plot_confusion_matrix(y_test_flat, y_pred_tfidf_flat, ALL_BIO_LABELS,
                          os.path.join(PLOTS_DIR, "crf_tfidf_confusion_matrix.png"),
                          title="CRF + TF-IDF — Token-Level Confusion Matrix")

    entity_f1_basic = {l: rep_basic.get(l, {}).get("f1-score", 0) for l in ENTITY_LABELS}
    entity_f1_tfidf = {l: rep_tfidf.get(l, {}).get("f1-score", 0) for l in ENTITY_LABELS}

    plot_f1_per_class(entity_f1_tfidf, os.path.join(PLOTS_DIR, "crf_tfidf_f1_per_class.png"),
                      title="CRF + TF-IDF — Per-Class F1 (Entity Tags)")

    plot_comparison(entity_f1_basic, entity_f1_tfidf,
                    os.path.join(PLOTS_DIR, "crf_vs_crf_tfidf_comparison.png"))

    def macro(scores):
        vals = [v for v in scores.values() if v is not None]
        return float(np.mean(vals)) if vals else 0.0

    mp_b = macro({l: rep_basic.get(l, {}).get("precision") for l in ENTITY_LABELS})
    mr_b = macro({l: rep_basic.get(l, {}).get("recall") for l in ENTITY_LABELS})
    mf1_b = macro(entity_f1_basic)
    mp_t = macro({l: rep_tfidf.get(l, {}).get("precision") for l in ENTITY_LABELS})
    mr_t = macro({l: rep_tfidf.get(l, {}).get("recall") for l in ENTITY_LABELS})
    mf1_t = macro(entity_f1_tfidf)

    print(f"\n{'Model':15s} | {'Macro P':8s} | {'Macro R':8s} | {'Macro F1':8s}")
    print("-" * 55)
    print(f"{'CRF':15s} | {mp_b:6.3f}  | {mr_b:6.3f}  | {mf1_b:6.3f}")
    print(f"{'CRF + TF-IDF':15s} | {mp_t:6.3f}  | {mr_t:6.3f}  | {mf1_t:6.3f}")

    os.makedirs("output", exist_ok=True)
    with open("output/crf.pkl", "wb") as f:
        pickle.dump(crf_basic, f)
    with open("output/crf_tfidf.pkl", "wb") as f:
        pickle.dump(crf_tfidf, f)
    print("Models saved to output/crf.pkl and output/crf_tfidf.pkl")


if __name__ == "__main__":
    main()
