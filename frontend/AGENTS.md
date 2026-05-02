# AGENTS.md

## Commands
- `npm run dev` - Start dev server (http://localhost:5173)
- `npm run build` - Production build
- `npm run lint` - ESLint check
- `npm run preview` - Preview production build

## Architecture
- Routes: `src/app/routes.jsx` (react-router-dom)
- Entry: `src/main.jsx` → `src/App.jsx`
- Styles: `src/index.css` - Tailwind v4 uses `@import "tailwindcss"` (no config file)

## Tech Stack
- React 19 + Vite 8
- Tailwind CSS v4
- react-router-dom v7
- Pure JavaScript (no TypeScript)

## Routes
- `/` - Home
- `/vendors` - Vendors page