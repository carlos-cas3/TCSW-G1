# AGENTS.md

## Commands
- `npm run dev` — Dev server on http://localhost:5173
- `npm run build` — Production build
- `npm run lint` — ESLint (flat config)
- `npm run preview` — Preview production build
- No tests configured (no test runner)

## Tech Stack
- React 19 + Vite 8, pure JS (no TypeScript)
- Tailwind CSS v4 (config-free; `@import "tailwindcss"` in `src/index.css`)
- react-router-dom v7 with `useRoutes` flat routing
- SVGs import as default React components (`vite-plugin-svgr`)
- `lucide-react` for icons

## Architecture
- Entry: `src/main.jsx` → `<BrowserRouter>` → `src/App.jsx` → `useRoutes(routes)`
- Routes: `src/app/routes.jsx` — role-based routing by `roleId`
  - SUPER_ADMIN (1) → `/admin/*`
  - VENDOR_ADMIN (2) → `/dashboard/*`
  - Catch-all redirects to `/login`
- Feature folders: `src/features/{name}/{components,hooks,services,views,...}`
- Auth: `src/app/auth.js` — token/user stored in `localStorage`/`sessionStorage` as `tcsw_token` / `tcsw_user`
- HTTP: `src/shared/api/httpClient.js` — `fetchWithAuth()` attaches `Bearer` token; skips `Content-Type` for FormData
- API endpoints: `src/config/api.js` reads `VITE_AUTH_URL` (→ `:3006`) and `VITE_VENDOR_URL` (→ `:3001`) from `import.meta.env`. No `.env` committed.
