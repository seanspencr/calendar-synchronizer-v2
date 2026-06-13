# SyncIt — Calendar Synchronizer with AI Chatbot

A full-stack calendar synchronization application with an AI-powered chatbot for natural language schedule/task creation. Users can manage schedules and tasks, sync with Google Calendar and Microsoft Outlook, and use natural language to create events through an AI pipeline (Gemini classifier + spaCy NER).

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | NestJS 11, TypeScript 5.7, Express |
| **Frontend** | Expo 54 (React Native 0.81), Expo Router 6, Tamagui UI |
| **Database** | PostgreSQL (Supabase), Prisma ORM 7 |
| **Auth** | JWT (RS256), Google OAuth 2.0 (PKCE), Microsoft OAuth 2.0 |
| **AI** | Google Gemini API (intent classification), spaCy 3.8 NER (entity extraction) |
| **NLP API** | FastAPI (Python 3.11) serving spaCy + sklearn models |
| **API Client** | OpenAPI Generator (typescript-axios) |
| **HTTP** | Axios (interceptors, cookie + Bearer auth) |

---

## Project Structure

```
calendar-synchronizer-v2/
├── back-end-nest/calendar-synchronizer/   # NestJS backend
├── front-end/calendar-synchronizer/       # Expo/React Native frontend
├── model/                                  # spaCy NER training pipeline
├── ai-api/                                 # FastAPI inference server
├── run_backend_and_ai.bat                  # Dev startup script
├── AGENTS.md                               # Dev setup cheatsheet
├── features.txt                            # Feature list
└── setup.md                                # Legacy setup guide
```

---

### Database

PostgreSQL on Supabase, schema namespace `calendar_synchronizer`.

**5 tables:**

| Table | Purpose | Key Columns |
|---|---|---|
| `users` | User accounts & OAuth tokens | `username`, `password` (bcrypt), `google_refresh_token`, `microsoft_refresh_token` |
| `schedules` | Calendar events | `event`, `event_date`, `start_time`, `end_time`, `schedule_provider` (LOCAL/GOOGLE/MICROSOFT), `external_event_id`, `schedule_recurrence_id` (FK) |
| `schedule_recurrences` | Recurring event patterns | `recurrence_interval`, `recurrence_period` (DAY/WEEK/MONTH/YEAR) |
| `tasks` | Tasks with subtrees | `title`, `parent_task_id` (self-join FK), `completed`, `is_todo`, `deadline` |
| `messages` | AI chatbot conversation log | `content`, `message_type` (PROMPT/RESPONSE), `prompt_type` (CREATE_TASK/CREATE_SCHEDULE/CREATE_TODOLIST) |

---

### Backend

Located in `back-end-nest/calendar-synchronizer/src/`. NestJS with modular architecture.

**Modules:**

```
AppModule
├── DatabaseModule      — PrismaClient singleton
├── UsersModule         — User CRUD + OAuth-specific lookups
├── AuthModule          — Login, register, JWT issue
│   ├── GoogleAuth      — PKCE token exchange, refresh tokens, Google API calls
│   └── MicrosoftAuth   — Auth code exchange, refresh tokens, Microsoft Graph calls
├── SchedulesModule     — Schedule CRUD, recurrence expansion, calendar sync
│   ├── GoogleSchedule  — Google Calendar API fetcher
│   └── MicrosoftSchedule — Microsoft Graph Calendar fetcher
├── TasksModule         — Task CRUD, recursive tree building
├── AiModule            — Google Gemini + NLP model API client
└── MessagesModule      — AI pipeline orchestrator
```

**Key resources:**

- **`src/lib/jwt_config.ts`** — RS256 async config using `@nestjs/jwt`
- **`src/jwt/jwt.strategy.ts`** — Passport strategy extracts JWT from cookie (`authorization`) or Bearer header
- **`src/jwt/jwt.guard.ts`** — `AuthGuard('jwt')` wrapper
- **`src/database/database.service.ts`** — Prisma client singleton
- **`src/prisma/schema.prisma`** — Full database schema

**JWT Auth:**

- RS256-signed tokens (public/private key pair in `src/private.pem`, `src/public.pem`)
- 1-hour expiry, payload: `{ userId, google_email, microsoft_email, username }`
- Strategy: cookie first (`authorization`), fallback `Authorization: Bearer <token>`
- All protected endpoints use `@UseGuards(JwtGuard)`

**Google OAuth:**

- PKCE flow via `expo-auth-session` (frontend) → `POST /auth/google` (backend exchange)
- Stores `google_refresh_token` per user for calendar sync
- `POST /auth/google/bind` (JWT-guarded) — links Google to existing account
- `POST /auth/google/dummy` — dev shortcut (login by email only)

**Microsoft OAuth:**

- Standard auth code flow → `POST /auth/microsoft`
- Uses `@microsoft/microsoft-graph-client` for calendar API
- `POST /auth/microsoft/bind` (JWT-guarded)
- `POST /auth/microsoft/dummy` — dev shortcut

**API endpoints (port 3001):**

| Group | Auth | Endpoints |
|---|---|---|
| `/auth` | Mixed | `login`, `register`, `me`, `google`, `google/bind`, `microsoft`, `microsoft/bind`, dummies |
| `/users` | None | Full CRUD |
| `/schedules` | JWT | CRUD + `range` (date range w/ recurrence expansion) + `sync/google`, `sync/microsoft` |
| `/tasks` | JWT | CRUD (tree structured via `parent_task_id`) |
| `/messages` | JWT | `POST` (triggers AI pipeline), `GET` (today's messages) |

Swagger docs at `/api`.

---

### Frontend

Located in `front-end/calendar-synchronizer/app/`. Expo Router (file-based) with Tamagui UI.

**Routing structure:**

```
_layout.tsx             — Root layout (TamaguiProvider + UserProvider)
├── (auth)/             — Unauthenticated group
│   ├── index.tsx       — Login screen (email/password + Google + Microsoft)
│   └── registerScreen.tsx
└── (main)/             — Authenticated group (tabs)
    ├── dashboard.tsx   — Calendar grid + sidebar (tasks/schedules/chatbot)
    ├── profile.tsx     — Account binding + logout
    ├── schedule/[id]   — Schedule detail/edit
    └── task/[id]       — Task detail/edit (with subtasks)
```

**Custom hooks** (in `app/hooks/`):

| Group | Hooks |
|---|---|
| `auth/` | `useLogin`, `useRegister`, `useGoogleRegister`, `useMicrosoftRegister`, `useBindGoogle`, `useBindMicrosoft`, `useGetProfile` |
| `task/` | `useGetTasks`, `useGetTaskDetail`, `useCreateTask`, `useUpdateTask`, `useDeleteTask`, `useToggleTask`, `useToggleSubtask`, `useAddTodolist` |
| `schedule/` | `useGetSchedules`, `useGetScheduleDetail`, `useCreateSchedule`, `useUpdateSchedule`, `useDeleteSchedule`, `useSyncGoogleSchedules`, `useSyncMicrosoftSchedules` |
| general | `useGetChatMessages`, `useSendChatMessage` |

**Pages:**

| Route | Screen | Description |
|---|---|---|
| `/` | Login | Three auth methods: password, Google OAuth, Microsoft OAuth |
| `/registerScreen` | Register | Create a new account |
| `/dashboard` | Dashboard | Calendar grid, sidebar with task/schedule/chatbot tabs, create dialog |
| `/profile` | Profile | View/change avatar, bind OAuth accounts, logout |
| `/schedule/:id` | Schedule Detail | View/edit schedule event + recurrence |
| `/task/:id` | Task Detail | View/edit task + subtask tree + toggle completion |

**Architecture layers:**

```
Pages → Custom Hooks (state + optimistic updates)
     → Service Wrappers (app/services/*.tsx)
     → OpenAPI-generated Client (app/api-client/api.ts)
     → Axios Instance (app/services/apiService.tsx) → Backend :3001
```

OAuth config lives in `app/lib/googleConfig.tsx` and `app/lib/microsoftConfig.tsx`. Auth context (`app/context/currentUserContext.tsx`) manages user state with persistence via SecureStore / localStorage.

---

### AI / NLP

Two components:

**1. `model/` — spaCy NER Training Pipeline**

- Trained on 800k synthetic samples (5 entity labels: `EVENT`, `DATE`, `START_TIME`, `END_TIME`, `RECURRENCE`)
- Architecture: `Tok2Vec.v2` (MultiHashEmbed + MaxoutWindowEncoder) → `TransitionBasedParser.v2`
- Word vectors: `en_core_web_lg` (300-dim)
- F1 score: 0.9984 on synthetic test set
- Classical baselines: CRF, CRF+TF-IDF, SVM, Naive Bayes
- Published on HuggingFace: `seanspencr/calendar_ner`
- Training: `run_training.bat` → `spacy train config.cfg`

**2. `ai-api/` — FastAPI Inference Server**

- Loads trained models (spaCy, CRF, SVM, Naive Bayes, CRF+TF-IDF)
- Endpoints: `POST /predict/{spacy|crf|svm|naive-bayes|crf-tf-idf}`
- Parses extracted entities into structured `ScheduleDto` (date/time/recurrence resolution)
- Port 8000, referenced by backend via `AI_API_URL` env var

**Backend AI pipeline (`MessagesService` + `AiService`):**

1. User message → `POST /messages`
2. Message stored in DB as `PROMPT` type
3. Google Gemini classifies intent: `CREATE_TASK`, `CREATE_SCHEDULE`, `CREATE_TODOLIST`, or `OTHER`
4. Second Gemini call (or local NLP model) extracts structured data
5. Creates database record (schedule/task/todolist)
6. Response stored as `RESPONSE` type message, returned to frontend

---

## How to Run

### Prerequisites

- Node.js 20+
- Python 3.11 + Conda
- PostgreSQL (Supabase)
- RS256 key pair for JWT
- OAuth credentials (Google Cloud Console, Microsoft Entra)
- Google Gemini API key

### 1. Backend

```bash
cd back-end-nest/calendar-synchronizer
cp .env.example src/.env   # Fill in all env vars
npm install
cd src && npx prisma generate && cd ..
npm run start:dev          # Dev with hot reload
```

### 2. AI API

```bash
cd ai-api
conda activate ner_nlp     # Or use your Python env
pip install -r requirements.txt  # Or conda install
fastapi run main.py        # Port 8000
```

### 3. Frontend

```bash
cd front-end/calendar-synchronizer
cp .env.example .env       # Fill in env vars
npx expo install
npm run web                # Or: android / ios
```

### Quick start (dev)

`run_backend_and_ai.bat` launches all three services (backend, AI API, ngrok tunnel).

---

## Contributing

1. Branch from `dev`. All PRs target `dev`.
2. Follow existing code conventions (file structure, naming, ES module format).
3. Backend: `npm run lint` + `npm test` before commits.
4. Frontend: `npm run lint` before commits.
5. If you change the API, regenerate the frontend client: `npm run api-client` (requires backend running on `:3001`).
6. For AI/model changes, work in `model/` directory. Run `python test.py` to test NER interactively.
7. Never commit secrets (`.env`, `*.pem`).
