# SkillBridge AI - Frontend

Industry-level React setup with Vite + Redux Toolkit + React Router + Axios + Vitest.

## Tech Stack
- **React 19** + Vite
- **Redux Toolkit** + React-Redux (global state)
- **React Router v7** (createBrowserRouter)
- **Axios** (centralized client + interceptors)
- **TailwindCSS v4**
- **Vitest** + Testing Library + jsdom

## Folder Structure
```
src/
├── api/                 # All API logic
│   ├── axios.js         # axios instance + interceptors
│   ├── endpoints.js     # ENDPOINTS constant map
│   ├── auth.api.js      # domain APIs (auth, user, courses...)
│   └── index.js         # barrel exports
├── app/
│   └── store.js         # Redux store config
├── features/
│   └── auth/
│       └── authSlice.js # slices + asyncThunks + selectors
├── components/
│   ├── layout/          # Navbar, Layout, Footer
│   ├── common/          # Loader, ErrorBoundary
│   └── ui/              # Button, Input, Card (reusable)
├── pages/
│   ├── Home/Home.jsx
│   └── Auth/            # Login, Register
├── routes/
│   ├── index.jsx        # createBrowserRouter
│   └── ProtectedRoute.jsx
├── hooks/               # useAuth, useDebounce...
├── utils/               # helpers, constants, storage
├── assets/images/
├── styles/
├── __tests__/           # component tests co-located
└── main.jsx / App.jsx
tests/
├── setup.js             # vitest setup (jest-dom)
└── api.test.js          # example
```

## Quick Start
```bash
npm install
npm run dev        # http://localhost:5173
npm run build
npm run test       # watch mode
npm run test:run   # single run
```

## Conventions
- **API**: Never call `axios` directly in components → use `src/api/*.api.js`
- **Redux**: All async via `createAsyncThunk` inside `features/*/`
- **Routing**: Define in `src/routes/index.jsx`, guard with `ProtectedRoute`
- **Env**: `VITE_API_BASE_URL` in `.env` (see `.env.example`)
```
