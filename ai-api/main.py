import pickle
from pathlib import Path

import spacy
import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Calendar NER API")

MODELS_DIR = Path(__file__).parent / "models"

nlp = spacy.blank("en")

ENTITY_LABELS = ["EVENT", "DATE", "START_TIME", "END_TIME", "RECURRENCE"]
ALL_BIO_LABELS = ["O"] + [f"B-{l}" for l in ENTITY_LABELS] + [f"I-{l}" for l in ENTITY_LABELS]


# --- feature extractors (mirror the training code) ---

def extract_sklearn_features(tokens, i):
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


# --- helpers ---

def tokenize(text: str) -> list[str]:
    return [token.text for token in nlp(text)]


def bio_to_entities(tokens: list[str], tags: list[str]) -> list[dict]:
    entities = []
    i = 0
    while i < len(tokens):
        if tags[i].startswith("B-"):
            label = tags[i][2:]
            start = i
            i += 1
            while i < len(tokens) and tags[i] == f"I-{label}":
                i += 1
            entities.append({
                "text": " ".join(tokens[start:i]),
                "label": label,
                "start_token": start,
                "end_token": i,
            })
        else:
            i += 1
    return entities


# --- model loading ---

def _load_pkl(name: str):
    with open(MODELS_DIR / name, "rb") as f:
        return pickle.load(f)


svm_model = _load_pkl("svm.pkl")
nb_model = _load_pkl("naive_bayes.pkl")
crf_model = _load_pkl("crf.pkl")
crf_tfidf_model = _load_pkl("crf_tfidf.pkl")


# --- request/response schemas ---

class PredictRequest(BaseModel):
    text: str


class TokenTag(BaseModel):
    token: str
    tag: str


class PredictResponse(BaseModel):
    tokens: list[str]
    tags: list[str]
    entities: list[dict]


# --- shared inference logic ---

def _predict_sklearn(text: str, model: dict) -> PredictResponse:
    tokens = tokenize(text)
    feats = [extract_sklearn_features(tokens, i) for i in range(len(tokens))]
    X = model["vec"].transform(feats)
    y_enc = model["clf"].predict(X)
    tags = model["le"].inverse_transform(y_enc).tolist()
    entities = bio_to_entities(tokens, tags)
    return PredictResponse(tokens=tokens, tags=tags, entities=entities)


def _predict_crf(text: str, crf) -> PredictResponse:
    tokens = tokenize(text)
    feats = [word2features(tokens, i) for i in range(len(tokens))]
    tags = crf.predict([feats])[0]
    entities = bio_to_entities(tokens, tags)
    return PredictResponse(tokens=tokens, tags=tags, entities=entities)


# --- endpoints ---

@app.post("/predict/svm")
def predict_svm(req: PredictRequest):
    return _predict_sklearn(req.text, svm_model)


@app.post("/predict/naive-bayes")
def predict_naive_bayes(req: PredictRequest):
    return _predict_sklearn(req.text, nb_model)


@app.post("/predict/crf")
def predict_crf(req: PredictRequest):
    return _predict_crf(req.text, crf_model)


@app.post("/predict/crf-tfidf")
def predict_crf_tfidf(req: PredictRequest):
    return _predict_crf(req.text, crf_tfidf_model)


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
