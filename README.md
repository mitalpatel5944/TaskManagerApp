# Task Manager App

A Vue 3 task management app that connects to a REST API to create, view, update, and delete tasks.

---

## Setup Instructions

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Build for production
npm run build
```

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Vue 3 (Composition API + `<script setup>`) |
| Language | TypeScript |
| Build tool | Vite |
| HTTP | Native `fetch` with Vite dev proxy (CORS fix) |
| Date formatting | Moment.js |
| Testing | Vitest + Vue Test Utils + jsdom |

---

## Project Structure

```
src/
├── __tests__/           # Unit & integration tests
├── components/
│   ├── TaskItem.vue     # Single task row (checkbox, badge, delete)
│   ├── TaskForm.vue     # Add task form with validation
│   └── SearchFilter.vue # Search input + All/Pending/Completed filters
├── types/
│   └── task.ts          # Shared Task type & CompletedFilter type
├── utils/
│   └── errorHandler.ts  # Maps HTTP status codes to user messages
├── App.vue              # Root component — state & API calls
├── constant.js          # API endpoint constants
├── main.ts              # App entry point
└── style.css            # Global styles
```

---

## API

Base URL proxied via Vite dev server to avoid CORS:

| Method | Endpoint | Description |
|---|---|---|
| GET | `/tasks` | List all tasks |
| GET | `/tasks?search=x&completed=true` | Search & filter |
| POST | `/tasks` | Create a task `{ title }` |
| PATCH | `/tasks/:id` | Toggle completion `{ completed }` |
| DELETE | `/tasks/:id` | Delete a task |

---

## Assumptions & Tradeoffs

- **CORS**: Handled via Vite proxy in development. For production, the API server must set `Access-Control-Allow-Origin` headers.
- **State**: Local `ref` state in `App.vue` — kept simple since there is only one view. Pinia store scaffolding exists in `src/stores/taskStore.ts` for future expansion.
- **Optimistic updates**: Skipped for delete/create (re-fetches instead) to keep consistency with server state.
- **Moment.js**: Used for date formatting per the project requirement. For a smaller bundle, `date-fns` or native `Intl.DateTimeFormat` could replace it.
- **Error handling**: 400 and 404 are mapped to friendly messages. Other errors show a generic fallback.
