# NER Pipeline — Agent Prompt

## Domain Context

You are building a modular NER pipeline for a calendar/scheduling assistant.
The system extracts 5 entity types from natural language scheduling requests.

The NLP task is: extract scheduling entities from user calendar input like:

```
"remind me to go to gym next Monday from 6pm to 8pm"
"every Tuesday standup meeting at 9:00 AM"
"book a dentist appointment on March 15 at 2pm"
```

---

## Entity Schema

```python
ENTITY_LABELS = ["EVENT", "DATE", "START_TIME", "END_TIME", "RECURRENCE"]
```

| Label      | Description                     | Example                    |
|------------|---------------------------------|----------------------------|
| EVENT      | The activity or appointment     | "gym", "standup meeting"   |
| DATE       | A specific or relative date     | "next Monday", "March 15"  |
| START_TIME | When the event begins           | "6pm", "9:00 AM"           |
| END_TIME   | When the event ends             | "8pm", "10:30"             |
| RECURRENCE | A repeating pattern             | "every Tuesday", "each week" |

---

## Existing File: `model/training/generate_data_rev1.py`

This file **ALREADY EXISTS** and contains:

- `generate_variations(n)` → returns `List of [text, {"entities": [[start, end, label], ...]}]`
  - Uses character-offset based annotation (spaCy format)
  - Generates diverse scheduling sentences with intents, activities, dates, times
  - Includes typo simulation via `make_typo()`
  - Handles date blocks (numeric/text), time blocks (single/range/range_hyphen), recurrence

- `get_sentence_data()` → builds one sentence with shuffled component blocks
- `get_random_time_block()` → returns `[(text, label), ...]` for time components
- `get_random_date_block()` → returns `[(text, label), ...]` for date components
- `convert_to_spacy_binary(data, output_file)` → saves to `.spacy` DocBin format

**DO NOT REWRITE this file. Only import from it.**

The data format returned by `generate_variations(n)`:

```python
[
  ["remind me to go to gym next Monday from 6pm to 8pm",
   {"entities": [[19, 22, "EVENT"], [23, 34, "DATE"], [35, 38, "START_TIME"], [42, 45, "END_TIME"]]}],
  ...
]
```

---

## Files to Create

### 1. `bio_tag.py`

**Purpose:** Convert `generate_variations()` output (char-offset format) → BIO token-level tags.

**Requirements:**
- Import: `from model.training.generate_data_rev1 import generate_variations`
- Use `spacy.blank("en")` tokenizer to split text into tokens
- Map character offsets → token spans using `doc.char_span(..., alignment_mode="contract")`
- Apply BIO tagging logic:
  - First token of an entity → `B-<LABEL>`
  - Subsequent tokens of same entity → `I-<LABEL>`
  - Non-entity tokens → `O`
- Export two functions:

```python
def get_bio_tagged_data(n: int = 5000) -> List[List[Tuple[str, str]]]:
    """Returns list of sentences, each sentence is list of (token, BIO_tag) tuples"""

def get_bio_tagged_split(n: int = 5000, test_size: float = 0.2, seed: int = 42):
    """Returns (X_train, X_test, y_train, y_test) already split"""
```

- No side effects on import
- When run as `__main__`: print 5 sample sentences with their BIO tags

---

### 2. `spacy_formatting.py`

**Purpose:** Convert `generate_variations()` output → spaCy v3 binary `.spacy` files.

**Requirements:**
- Import: `from model.training.generate_data_rev1 import generate_variations`
- Use `generate_variations()` for both train and dev sets
- 80/20 train/dev split
- Output: `./data/train.spacy` and `./data/dev.spacy` using `DocBin`
- Handle skipped/misaligned entities gracefully (same pattern as the existing `convert_to_spacy_binary`)
- Print summary: total generated, train count, dev count, skipped entities
- When run as `__main__`: generate 10000 samples and export

---

### 3. `train_naive_bayes.py`

**Purpose:** Train a token-level NER classifier using Naive Bayes on BIO-tagged data.

**Requirements:**
- Import: `from bio_tag import get_bio_tagged_split`
- Feature extraction per token (build `extract_features(tokens, i)` function):

```
word, word.lower, word.isupper, word.istitle, word.isdigit,
prefix_2, prefix_3, suffix_2, suffix_3,
prev_word (or <START>), next_word (or <END>),
prev_word.isupper, next_word.isupper,
prev_word.istitle, next_word.istitle
```

- Use `DictVectorizer(sparse=True)` for vectorization
- Use `ComplementNB(alpha=0.1)` — handles `"O"` tag imbalance better
- Encode labels with `LabelEncoder`
- Evaluation:
  - Token-level: `sklearn classification_report`
  - Entity-level: `seqeval` precision, recall, F1 (exclude `"O"` from entity metrics)
  - Confusion matrix: `plots/nb_confusion_matrix.png`
  - Per-class F1 bar chart (entity tags only): `plots/nb_f1_per_class.png`
  - Print summary table:

```
Model        | Accuracy | Macro P | Macro R | Macro F1
Naive Bayes  |  xx.xx%  |  xx.xx  |  xx.xx  |  xx.xx
```

---

### 4. `train_crf.py`

**Purpose:** Train a sequence-labeling CRF model on BIO-tagged data.

**Requirements:**
- Import: `from bio_tag import get_bio_tagged_split`
- Use `sklearn-crfsuite`
- Feature function `word2features(sentence, i)` must return a feature dict with:

```
bias, word.lower, word[-3:], word[-2:], word[:3], word[:2],
word.isupper, word.istitle, word.isdigit,
-1:word.lower, -1:word.istitle, -1:word.isupper  (or BOS flag)
+1:word.lower, +1:word.istitle, +1:word.isupper  (or EOS flag)
```

- CRF config: `algorithm='lbfgs', c1=0.1, c2=0.1, max_iterations=100, all_possible_transitions=True`
- Data format: CRF takes `List[List[dict]]` for X, `List[List[str]]` for y (sentence-level, not flattened)
- Evaluation:
  - `seqeval` entity-level precision, recall, F1
  - Confusion matrix (token level): `plots/crf_confusion_matrix.png`
  - Per-class F1 bar chart: `plots/crf_f1_per_class.png`
  - Print summary table same format as Naive Bayes

---

### 5. `train_crf_tfidf.py`

**Purpose:** Train CRF with an additional TF-IDF score feature per token.

**Requirements:**
- Import: `from bio_tag import get_bio_tagged_split`
- TF-IDF computation strategy:
  - Treat each sentence as a "document" (join tokens into a string)
  - Fit `TfidfVectorizer` on training sentences **only** (prevent data leakage)
  - For each token in a sentence, look up its TF-IDF score from the sentence's TF-IDF vector
  - Add as a float feature: `"tfidf_score": float`
  - Bucket the score into bins for CRF compatibility: `"tfidf_bucket": "low"/"mid"/"high"`
    - `low < 0.3`, `mid 0.3–0.6`, `high > 0.6`
- All other CRF features identical to `train_crf.py` (reuse `word2features`, add tfidf on top)
- Same CRF config as `train_crf.py`
- Evaluation:
  - Same plots as `train_crf.py` but saved as:
    - `plots/crf_tfidf_confusion_matrix.png`
    - `plots/crf_tfidf_f1_per_class.png`
  - **ADDITIONAL:** side-by-side grouped bar chart comparing CRF vs CRF+TF-IDF per entity class saved to: `plots/crf_vs_crf_tfidf_comparison.png`
  - Print comparison table:

```
Model         | Macro P | Macro R | Macro F1
CRF           |  xx.xx  |  xx.xx  |  xx.xx
CRF + TF-IDF  |  xx.xx  |  xx.xx  |  xx.xx
```

---

## Evaluation Requirements (all `train_*.py` files)

All plots saved to `./plots/` (create dir if not exists).

Per model:

1. **Confusion matrix heatmap** — normalized, token-level, seaborn, 150 DPI
   - X-axis: Predicted label, Y-axis: True label
   - Annotated with percentages

2. **Per-class F1 bar chart** — entity classes only (`EVENT`, `DATE`, `START_TIME`, `END_TIME`, `RECURRENCE`)
   - Horizontal bar chart, color-coded by score range:
     - Red `< 0.5`, Yellow `0.5–0.75`, Green `> 0.75`

3. `train_crf_tfidf.py` only: grouped comparison bar chart vs plain CRF

All plots must have: title, axis labels, legend where applicable, `tight_layout()`.

---

## General Constraints

- Python 3.11.14
- Currently installed dependencies can be extracted from model/requirements.txt
- Environment can be accessed with 'conda activate ner_nlp'
- `RANDOM_SEED = 42` everywhere (`random`, `numpy`, `sklearn`)
- All files runnable as scripts **AND** importable as modules
- No side effects on import — all executable code inside `if __name__ == "__main__"`
- Required packages: `spacy`, `sklearn-crfsuite`, `scikit-learn`, `seqeval`, `matplotlib`, `seaborn`
- Default sample size for training: `N = 5000` (adjustable via constant at top of each file)
- Do **NOT** regenerate data inside `train_*.py` — always import from `bio_tag.py`
- Handle the `"O"` tag correctly:
  - Include in confusion matrix
  - **Exclude** from entity-level seqeval metrics (seqeval does this automatically)
  - Note class imbalance: ~60–70% of tokens will be `"O"`

---

## Expected Project Structure

```
ner_pipeline/
├── model/
│   └── training/
│       └── generate_data_rev1.py   ← EXISTS, do not modify
├── bio_tag.py                      ← Create
├── spacy_formatting.py             ← Create
├── train_naive_bayes.py            ← Create
├── train_crf.py                    ← Create
├── train_crf_tfidf.py              ← Create
├── data/
│   ├── train.spacy                 ← Generated by spacy_formatting.py
│   └── dev.spacy                   ← Generated by spacy_formatting.py
└── plots/
    ├── nb_confusion_matrix.png
    ├── nb_f1_per_class.png
    ├── crf_confusion_matrix.png
    ├── crf_f1_per_class.png
    ├── crf_tfidf_confusion_matrix.png
    ├── crf_tfidf_f1_per_class.png
    └── crf_vs_crf_tfidf_comparison.png
```