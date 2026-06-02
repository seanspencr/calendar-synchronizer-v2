import spacy
import re
from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional

app = FastAPI(title="Calendar NER API")

nlp = spacy.load("../output/model-best")

DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"]


class PredictRequest(BaseModel):
    text: str


class RecurrenceDto(BaseModel):
    recurrence_interval: int
    recurrence_period: str


class ScheduleDto(BaseModel):
    event: Optional[str] = None
    event_date: str
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    description: Optional[str] = None
    recurrence: Optional[RecurrenceDto] = None


class PredictResponse(BaseModel):
    dto: ScheduleDto
    responseMessage: str


def parse_date(text: str) -> str:
    today = datetime.now()
    text = text.lower().strip()
    if not text:
        return today.strftime("%Y-%m-%d")

    if text == "today":
        return today.strftime("%Y-%m-%d")
    if text == "tomorrow":
        return (today + timedelta(days=1)).strftime("%Y-%m-%d")

    for i, day in enumerate(DAYS):
        if f"next {day}" in text:
            days_ahead = (i - today.weekday()) % 7
            return (today + timedelta(days=days_ahead + 7)).strftime("%Y-%m-%d")
        if f"this {day}" in text or f"on {day}" in text or text == day:
            days_ahead = (i - today.weekday()) % 7
            if days_ahead <= 0:
                days_ahead += 7
            return (today + timedelta(days=days_ahead)).strftime("%Y-%m-%d")

    m = re.search(
        r"(" + "|".join(MONTHS) + r")\s+(\d{1,2})(?:st|nd|rd|th)?",
        text, re.IGNORECASE,
    )
    if m:
        month = MONTHS.index(m.group(1).lower()) + 1
        day = int(m.group(2))
        year = today.year
        parsed = datetime(year, month, day)
        if parsed < today:
            parsed = datetime(year + 1, month, day)
        return parsed.strftime("%Y-%m-%d")

    m = re.search(
        r"(\d{1,2})(?:st|nd|rd|th)?\s+(" + "|".join(MONTHS) + r")",
        text, re.IGNORECASE,
    )
    if m:
        day = int(m.group(1))
        month = MONTHS.index(m.group(2).lower()) + 1
        year = today.year
        parsed = datetime(year, month, day)
        if parsed < today:
            parsed = datetime(year + 1, month, day)
        return parsed.strftime("%Y-%m-%d")

    m = re.search(r"in\s+(\d+)\s+(day|days|week|weeks|month|months|year|years)", text)
    if m:
        amount = int(m.group(1))
        unit = m.group(2)
        if unit.startswith("day"):
            return (today + timedelta(days=amount)).strftime("%Y-%m-%d")
        if unit.startswith("week"):
            return (today + timedelta(weeks=amount)).strftime("%Y-%m-%d")
        if unit.startswith("month"):
            month = today.month + amount
            y = today.year + (month - 1) // 12
            month = ((month - 1) % 12) + 1
            return datetime(y, month, today.day).strftime("%Y-%m-%d")

    return today.strftime("%Y-%m-%d")


def parse_time(text: str) -> Optional[str]:
    if not text:
        return None
    text = text.strip().lower()
    m = re.match(r"(\d{1,2})(?::(\d{2}))?\s*(am|pm)?", text, re.IGNORECASE)
    if m:
        hour = int(m.group(1))
        minute = int(m.group(2)) if m.group(2) else 0
        ampm = m.group(3)
        if ampm:
            ampm = ampm.lower()
            if ampm == "pm" and hour != 12:
                hour += 12
            elif ampm == "am" and hour == 12:
                hour = 0
        return f"{hour:02d}:{minute:02d}:00"
    return None


def parse_recurrence(text: str) -> Optional[dict]:
    if not text:
        return None
    text = text.strip().lower()

    if re.search(r"\bevery\s+day\b|\bdaily\b", text):
        return {"recurrence_interval": 1, "recurrence_period": "DAY"}

    for day in DAYS:
        if f"every {day}" in text:
            return {"recurrence_interval": 1, "recurrence_period": "WEEK"}

    if re.search(r"\bevery\s+week\b|\bweekly\b", text):
        return {"recurrence_interval": 1, "recurrence_period": "WEEK"}

    if re.search(r"\bevery\s+month\b|\bmonthly\b", text):
        return {"recurrence_interval": 1, "recurrence_period": "MONTH"}

    if re.search(r"\bevery\s+year\b|\bannually\b|\byearly\b", text):
        return {"recurrence_interval": 1, "recurrence_period": "YEAR"}

    m = re.search(r"every\s+(\d+)\s+(day|days|week|weeks|month|months|year|years)", text)
    if m:
        interval = int(m.group(1))
        unit = m.group(2)
        if unit.startswith("day"):
            return {"recurrence_interval": interval, "recurrence_period": "DAY"}
        if unit.startswith("week"):
            return {"recurrence_interval": interval, "recurrence_period": "WEEK"}
        if unit.startswith("month"):
            return {"recurrence_interval": interval, "recurrence_period": "MONTH"}
        if unit.startswith("year"):
            return {"recurrence_interval": interval, "recurrence_period": "YEAR"}

    return None


@app.post("/predict/spacy")
async def predict(request: PredictRequest):
    doc = nlp(request.text)

    entities = {}
    for ent in doc.ents:
        entities[ent.label_] = ent.text

    event_date = parse_date(entities.get("DATE", ""))
    start_time = parse_time(entities.get("START_TIME", ""))
    end_time = parse_time(entities.get("END_TIME", ""))
    recurrence = parse_recurrence(entities.get("RECURRENCE", ""))
    event_name = entities.get("EVENT", None)

    schedule_dto = ScheduleDto(
        event=event_name,
        event_date=event_date,
        start_time=start_time,
        end_time=end_time,
        description=None,
        recurrence=RecurrenceDto(**recurrence) if recurrence else None,
    )

    parts = []
    if event_name:
        parts.append(f"'{event_name}'")
    parts.append(f"scheduled on {event_date}")
    if start_time:
        parts.append(f"from {start_time}")
    if end_time:
        parts.append(f"to {end_time}")
    if recurrence:
        parts.append(f"(recurring {recurrence['recurrence_period'].lower()}ly)")

    response_message = " ".join(parts) if parts else "Schedule created"

    return PredictResponse(dto=schedule_dto, responseMessage=response_message)


@app.get("/health")
async def health():
    return {"status": "healthy", "model": "spacy", "entity_labels": nlp.get_pipe("ner").labels}
