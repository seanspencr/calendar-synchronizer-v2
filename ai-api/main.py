import json
import pickle
import re
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

import spacy
import uvicorn
from dateutil import parser as dateparser
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
            })
        else:
            i += 1
    return entities


# --- date/time parsing ---

_BASE_DATE = date.today() + timedelta(days=7)
_DAY_NAMES = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]


def _next_weekday(day_name: str) -> date:
    today = date.today()
    target = _DAY_NAMES.index(day_name.lower())
    days_ahead = target - today.weekday()
    if days_ahead <= 0:
        days_ahead += 7
    return today + timedelta(days=days_ahead)


def _parse_date(text: str) -> str:
    text_clean = text.strip().lower()
    if text_clean in ("today",):
        return date.today().isoformat()
    if text_clean in ("tomorrow", "tmr", "tmrw"):
        return (date.today() + timedelta(days=1)).isoformat()
    if text_clean in _DAY_NAMES:
        return _next_weekday(text_clean).isoformat()
    if text_clean.startswith("next "):
        rest = text_clean[5:].strip()
        if rest in _DAY_NAMES:
            d = _next_weekday(rest)
            return (d + timedelta(days=7)).isoformat()
        if rest in ("week",):
            return (date.today() + timedelta(days=7)).isoformat()
        if rest in ("month",):
            d = date.today() + timedelta(days=30)
            return d.isoformat()
    if text_clean.startswith("this "):
        rest = text_clean[5:].strip()
        if rest in _DAY_NAMES:
            return _next_weekday(rest).isoformat()
    try:
        dt = dateparser.parse(text, default=_BASE_DATE)
        return dt.date().isoformat()
    except Exception:
        pass
    return _BASE_DATE.isoformat()


_TIME_PATTERN = re.compile(
    r"(\d{1,2})(?::(\d{2}))?\s*(am|pm|a\.m\.|p\.m\.)?",
    re.IGNORECASE,
)


def _parse_time(text: str) -> str | None:
    try:
        dt = dateparser.parse(text, default=datetime.combine(_BASE_DATE, datetime.min.time()))
        return dt.isoformat()
    except Exception:
        pass
    m = _TIME_PATTERN.search(text.strip())
    if m:
        hour = int(m.group(1))
        minute = int(m.group(2)) if m.group(2) else 0
        meridian = (m.group(3) or "").lower().replace(".", "")
        if meridian in ("pm", "p.m") and hour < 12:
            hour += 12
        if meridian in ("am", "a.m") and hour == 12:
            hour = 0
        dt = datetime(_BASE_DATE.year, _BASE_DATE.month, _BASE_DATE.day, hour, minute, tzinfo=timezone.utc)
        return dt.isoformat()
    return None


def _parse_recurrence(text: str) -> dict | None:
    text_lower = text.strip().lower()
    period_map = {"day": "DAY", "week": "WEEK", "month": "MONTH", "year": "YEAR"}
    m = re.search(r"every\s+(\d+|an?)\s*(day|week|month|year)s?", text_lower)
    if m:
        interval_raw = m.group(1)
        period_str = m.group(2)
        interval = 1 if interval_raw in ("a", "an") else int(interval_raw)
        return {"recurrence_interval": interval, "recurrence_period": period_map[period_str]}
    m = re.search(r"every\s+(day|week|month|year)", text_lower)
    if m:
        return {"recurrence_interval": 1, "recurrence_period": period_map[m.group(1)]}
    m = re.search(r"(once|each)\s+(a\s+)?(day|week|month|year)", text_lower)
    if m:
        return {"recurrence_interval": 1, "recurrence_period": period_map[m.group(3)]}
    m = re.search(r"(daily|weekly|monthly|yearly|annually)", text_lower)
    if m:
        p = {"daily": "DAY", "weekly": "WEEK", "monthly": "MONTH", "yearly": "YEAR", "annually": "YEAR"}
        return {"recurrence_interval": 1, "recurrence_period": p[m.group(1)]}
    return None


def _build_schedule_dto(entities: list[dict], text: str) -> dict:
    event = None
    date_text = None
    start_time_text = None
    end_time_text = None
    recurrence_text = None

    for ent in entities:
        if ent["label"] == "EVENT":
            event = ent["text"]
        elif ent["label"] == "DATE":
            date_text = ent["text"]
        elif ent["label"] == "START_TIME":
            start_time_text = ent["text"]
        elif ent["label"] == "END_TIME":
            end_time_text = ent["text"]
        elif ent["label"] == "RECURRENCE":
            recurrence_text = ent["text"]

    event_date = _parse_date(date_text) if date_text else _BASE_DATE.isoformat()
    start_time = _parse_time(start_time_text) if start_time_text else None
    end_time = _parse_time(end_time_text) if end_time_text else None
    recurrence = _parse_recurrence(recurrence_text) if recurrence_text else None

    dto = {
        "event": event,
        "event_date": event_date,
        "description": text,
        "recurrence": recurrence,
    }
    if start_time:
        dto["start_time"] = start_time
    if end_time:
        dto["end_time"] = end_time
    return dto


def _build_response_message(entities: list[dict]) -> str:
    pairs = ", ".join(
        json.dumps({ent["text"]: ent["label"]}, ensure_ascii=False)
        for ent in entities
    )
    return f"Detected entities in this message : [{pairs}]"


# --- model loading ---

def _load_pkl(name: str):
    with open(MODELS_DIR / name, "rb") as f:
        return pickle.load(f)


svm_model = _load_pkl("svm.pkl")
nb_model = _load_pkl("naive_bayes.pkl")
crf_model = _load_pkl("crf.pkl")
crf_tfidf_model = _load_pkl("crf_tfidf.pkl")
spacy_ner = spacy.load(MODELS_DIR / "model-best")


# --- request/response schemas ---

class PredictRequest(BaseModel):
    text: str


class LlmResponseDto(BaseModel):
    dto: dict
    responseMessage: str


# --- shared inference ---

def _run_inference(text: str, model_sklearn: dict | None = None, model_crf=None) -> tuple[list[str], list[str], list[dict]]:
    tokens = tokenize(text)
    if model_sklearn is not None:
        feats = [extract_sklearn_features(tokens, i) for i in range(len(tokens))]
        X = model_sklearn["vec"].transform(feats)
        y_enc = model_sklearn["clf"].predict(X)
        tags = model_sklearn["le"].inverse_transform(y_enc).tolist()
    else:
        feats = [word2features(tokens, i) for i in range(len(tokens))]
        tags = model_crf.predict([feats])[0]
    entities = bio_to_entities(tokens, tags)
    return tokens, tags, entities


def _predict(text: str, **model_kwargs) -> dict:
    _, _, entities = _run_inference(text, **model_kwargs)
    dto = _build_schedule_dto(entities, text)
    msg = _build_response_message(entities)
    return {"dto": dto, "responseMessage": msg}


# --- endpoints ---

@app.post("/predict/svm")
def predict_svm(req: PredictRequest):
    return _predict(req.text, model_sklearn=svm_model)


@app.post("/predict/naive-bayes")
def predict_naive_bayes(req: PredictRequest):
    return _predict(req.text, model_sklearn=nb_model)


@app.post("/predict/crf")
def predict_crf(req: PredictRequest):
    return _predict(req.text, model_crf=crf_model)


@app.post("/predict/crf-tf-idf")
def predict_crf_tfidf(req: PredictRequest):
    return _predict(req.text, model_crf=crf_tfidf_model)


@app.post("/predict/spacy")
def predict_spacy(req: PredictRequest):
    doc = spacy_ner(req.text)
    entities = [{"text": ent.text, "label": ent.label_} for ent in doc.ents]
    dto = _build_schedule_dto(entities, req.text)
    msg = _build_response_message(entities)
    return {"dto": dto, "responseMessage": msg}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
