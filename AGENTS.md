# AGENTS.md — calendar-synchronizer-v2

## Repository structure (no workspace config)

Three independent sub-projects, each with its own `package.json`, `node_modules`, scripts:

| Project | Path | Entrypoint |
|---------|------|------------|
| Backend (NestJS 11) | `back-end-nest/calendar-synchronizer/` | `src/main.ts` |
| Frontend (Expo/React Native) | `front-end/calendar-synchronizer/` | `app/_layout.tsx` |
| NLP Model (spaCy) | `model/` | `run_training.bat` |

## Setup

**Every sub-project needs its own `.env`.** Copy from `.env.example` in each.

```
# Backend
cd back-end-nest/calendar-synchronizer
npm i
cd src && npx prisma generate && cd ..
npm start              # dev: npm run start:dev

# Frontend
cd front-end/calendar-synchronizer
npx expo install
npm run web            # or: android, ios

# Model
cd model
python -m spacy train config.cfg --output ./output --paths.train ./train_rev1.spacy --paths.dev ./dev_rev1.spacy --gpu-id 0
```

## Backend quirks

- **JWT RS256 keys required:** `src/private.pem` and `src/public.pem` must exist (referenced by `jwt_config.ts`). Not in git.
- **Prisma schema:** PostgreSQL on Supabase, namespace `calendar_synchronizer`. Generated output goes to `src/generated/prisma/` (moduleFormat `cjs`). After schema changes: `cd src && npx prisma db pull && npx prisma generate`.
- **Swagger docs** at `/api` (port 3001 by default).
- **Commands:** `npm run lint` (ESLint+Prettier), `npm test` (Jest, inline config), `npm run test:e2e`.

## Frontend quirks

- **Expo Router** file-based routing: `app/(auth)/` for unauthenticated screens, `app/(main)/` for authenticated tabs.
- **OpenAPI-generated client** in `app/api-client/`. Regenerate when API changes: `npm run api-client` (requires backend running on localhost:3001).
- **Auth context** in `app/context/currentUserContext.tsx` — manages user state, persists via SecureStore (mobile) / localStorage (web).
- **Commands:** `npm run lint` (expo lint, flat config).

## Active branch

`dev` — do all work here. `main` is stable.

## Architecture notes

- **Auth:** JWT (RS256) in HTTP-only cookie + Bearer header fallback via Axios interceptor. Google/Microsoft OAuth with PKCE (`expo-auth-session`).
- **AI pipeline:** User message → stored in DB → Google Gemini classifies intent (CREATE_TASK/CREATE_SCHEDULE/CREATE_TODOLIST) → spaCy NER extracts entities → creates record. spaCy model hosted on HuggingFace: `seanspencr/calendar_ner`.
- **Calendar sync:** Backend stores OAuth refresh tokens; fetches from Google Calendar / Microsoft Graph API on demand via `/schedules/sync/*`.
- **Recurring schedules:** `schedule_recurrences` table with interval + period (DAY/WEEK/MONTH/YEAR). Expanded server-side on fetch.
- **Tasks support subtrees** via `parent_task_id` self-join.
- **ESLint:** `@typescript-eslint/no-explicit-any: off` globally. Prettier trailingComma: all.

## Testing model NER interactively

```sh
cd model
python test.py
```

## HuggingFace upload

```sh
cd model
python upload-model.py
```
