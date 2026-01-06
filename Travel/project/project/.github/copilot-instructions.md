# GitHub Copilot / AI Agent Instructions — Travel project

## Big picture
- Frontend-only React + Vite + TypeScript app (no backend code is present in this repo).
- Styling: Tailwind CSS (+ PostCSS). Icons: lucide-react. Toasts: react-hot-toast.
- Routing: react-router-dom v6 with higher-order guard components (`PrivateRoute`, `AdminRoute`).
- Expected backend: Express + Mongo (package.json includes express, mongoose, jwt, bcrypt). The frontend talks to an API at http://localhost:5000 under `/api/*`.

## Where to start (quick checklist) ✅
- Install deps: `npm install`
- Dev: `npm run dev` — NOTE: this script runs `vite` *and* `node server/index.js` via `concurrently`. There is no `server/` folder in this repo; start backend separately if you have it or remove the server command if running frontend only.
- Build: `npm run build`
- Preview: `npm run preview`
- Lint: `npm run lint` (ESLint configuration lives at repository root)

## Environment variables & proxy
- Vite proxy is configured in `vite.config.ts` to proxy `/api` to `http://localhost:5000`.
- Several files expect environment variables (use a `.env` file at the project root):
  - `VITE_API_URL` (used in many admin pages, e.g. `src/pages/admin/AdminTouristSpots.tsx`)
  - `VITE_BACKEND_SERVER` (used in `src/Login/*`)
  - Default fallback is `http://localhost:5000` when env vars are missing.
- Note: code is inconsistent about using proxy vs full URL — some files call `import.meta.env.VITE_API_URL` or `VITE_BACKEND_SERVER`, others hardcode `http://localhost:5000`. Prefer using `VITE_API_URL` or relative `/api` when adding new calls so the Vite proxy works during development.

## Authentication & state patterns
- Auth lives in `src/contexts/AuthContext.tsx`.
  - JWT is stored in `localStorage` under key `token`.
  - `AuthContext` sets `axios.defaults.headers.common['Authorization'] = `Bearer ${token}` after login and removes it on logout.
  - `checkAuth()` uses a token and hits `GET /api/auth/register` to validate (endpoint naming may be unusual; verify with backend contract).
- Route guards:
  - `src/components/PrivateRoute.tsx` and `src/components/AdminRoute.tsx` rely on `useAuth()` exposing both `user` and `loading` — `loading` is used to render a loading UI before redirecting.
- Login/Signup components set tokens and `isAdmin` sometimes directly on `localStorage` (see `src/Login/Login.tsx`) — prefer using `AuthContext` methods for consistent state.

## Data fetching patterns
- Most pages use `axios` directly and manage loading/errors locally (no React Query/SWR).
- Typical pattern: read token from `localStorage`, attach it to request headers, use `withCredentials: true` in many admin calls.
- Admin pages expect endpoints under `/api/admin/*` and validate `user.isAdmin` before making changes (see `AdminTouristSpots.tsx`).

## Important files to reference
- Auth: `src/contexts/AuthContext.tsx`
- Route guards: `src/components/PrivateRoute.tsx`, `src/components/AdminRoute.tsx`
- Admin examples: `src/pages/admin/*` (CRUD patterns, env var usage, token checks)
- Login/signup: `src/Login/Login.tsx`, `src/Login/Sineup.tsx`
- Types: `src/types.ts` (application domain models)
- Build/config: `package.json`, `vite.config.ts`, `tailwind.config.js`, `postcss.config.js`

## Project-specific conventions & gotchas
- Tailwind utility classes are used everywhere; component-level CSS files are uncommon.
- Use `lucide-react` icons and `react-hot-toast` for user messages (refer to examples in `AuthContext` and admin pages).
- Watch out for inconsistent env var names (`VITE_API_URL` vs `VITE_BACKEND_SERVER`) and occasional hardcoded backend URLs.
- There is no test harness or CI config in the repo.

## Examples to copy from
- Attaching auth header after login: see `src/contexts/AuthContext.tsx` (lines that set `axios.defaults.headers.common['Authorization']`).
- Admin CRUD pattern: `src/pages/admin/AdminTouristSpots.tsx` — uses token from `localStorage`, `withCredentials: true`, and handles create/update/delete with optimistic UI updates.

## How I (the AI) should assist
- Prefer small, targeted patches that mirror existing patterns (hooks + local state + axios). Use the admin pages as canonical examples for CRUD patterns.
- If changing auth behavior, update both `AuthContext` and the guard components together; ensure `loading` behavior is preserved so guards still render a loading UI before redirecting.
- When adding API calls, prefer `VITE_API_URL` or relative `/api` paths to work with local proxy and to avoid hardcoded hosts.
- Always reference concrete files when suggesting changes or examples (link code locations in PR descriptions).

---

If any of the above items are unclear or you want more detail in a specific area (auth flow, admin APIs, or environment setup), tell me which section to expand and I’ll iterate. ✨