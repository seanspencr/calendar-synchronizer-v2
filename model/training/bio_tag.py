from generate_data_rev1 import generate_variations
import spacy
from typing import List, Tuple
from sklearn.model_selection import train_test_split


RANDOM_SEED = 42
ENTITY_LABELS = ["EVENT", "DATE", "START_TIME", "END_TIME", "RECURRENCE"]

nlp = spacy.blank("en")


def _char_offsets_to_bio(text: str, entities: List[List[int]]) -> List[Tuple[str, str]]:
    doc = nlp(text)
    tokens = [token.text for token in doc]
    tags = ["O"] * len(doc)

    for start, end, label in entities:
        span = doc.char_span(start, end, label=label, alignment_mode="contract")
        if span is None:
            continue
        token_start = span.start
        token_end = span.end
        for i in range(token_start, token_end):
            if i == token_start:
                tags[i] = f"B-{label}"
            else:
                if tags[i] == "O":
                    tags[i] = f"I-{label}"

    return list(zip(tokens, tags))


def get_bio_tagged_data(n: int = 5000) -> List[List[Tuple[str, str]]]:
    raw = generate_variations(n)
    result = []
    for text, annot in raw:
        tagged = _char_offsets_to_bio(text, annot["entities"])
        result.append(tagged)
    return result


def get_bio_tagged_split(n: int = 5000, test_size: float = 0.2, seed: int = 42):
    data = get_bio_tagged_data(n)
    sentences = [tokens for tokens, _ in [(d, None) for d in data]]
    X = [[token for token, tag in sent] for sent in data]
    y = [[tag for token, tag in sent] for sent in data]
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=seed
    )
    return X_train, X_test, y_train, y_test


if __name__ == "__main__":
    data = get_bio_tagged_data(5)
    print("=== Sample BIO-tagged sentences ===")
    for i, sent in enumerate(data, 1):
        print(f"\nSentence {i}:")
        for token, tag in sent:
            print(f"  {token:15s} → {tag}")
