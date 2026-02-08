# Copilot instructions — SmartAgri / Power Distribution

Quick, focused guidance to make an AI coding agent productive in this repo.

## Project overview 🔧

- Monorepo with **backend** (Express + MongoDB) and **frontend** (React + Vite + Tailwind).
- Purpose: Farmers submit power supply requests; Admin reviews/approves/rejects them.
- Data flows: Frontend -> `src/api.js` (axios) -> backend API (prefix `/api`) -> MongoDB (`models/*`).

## How to run (development) ▶️

- Backend: `cd backend && npm install && npm run dev`
  - Requires `.env` with **MONGO_URI** and **JWT_SECRET** (optional `PORT`).
- Frontend: `cd frontend && npm install && npm run dev`
  - Optional env: `VITE_API_URL` (defaults to `http://localhost:5000`).
- Production: build frontend (`npm run build`) and serve statics or host separately.

## Key files & components 🗂️

- Backend
  - `server.js` — mounts routes and starts server.
  - `config/db.js` — connects to MongoDB (mongoose v7+).
  - `models/User.js`, `models/PowerRequest.js` — canonical schema fields and enums (timestamps enabled).
  - `controllers/*.js` — business logic (e.g. `requestController.js`, `authController.js`).
  - `routes/*.js` — route definitions use `authMiddleware` and `roleMiddleware` when needed.
  - `middleware/authMiddleware.js` — expects header `Authorization: Bearer <token>`; sets `req.user = {userId, role}`.
- Frontend
  - `src/api.js` — axios instance; sets `Authorization` header from `localStorage.token`.
  - `src/context/AuthContext.jsx` — central auth state (stores `token`, `role`, `name` in localStorage).
  - `src/utils/AdminRoute.jsx`, `FarmerRoute.jsx` — route guards check `auth.token` and `auth.role`.
  - Example pages/components: `src/pages/RequestForm.jsx`, `src/pages/AdminDashboard.jsx`, `src/components/Navbar.jsx`.

## API contract & conventions (use exact names) 📡

- Auth
  - `POST /api/auth/register` — body `{ name, email, password, role? }` → returns `{ token, role, name, email }`.
  - `POST /api/auth/login` — body `{ email, password }` → returns `{ token, role, name, email }`.
- Requests
  - `POST /api/requests` (farmer) — body `{ area, powerRequired, purpose? }` (frontend sends `powerRequired` as Number).
  - `GET /api/requests/me` (farmer) — returns farmer's requests.
  - `GET /api/requests` (admin) — returns all requests.
  - `PUT /api/requests/:id/approve`, `PUT /api/requests/:id/reject`, `DELETE /api/requests/:id` (admin only).
- Errors and payloads
  - Backend uses `{ msg: '...' }` for error messages; frontend often reads `err.response?.data?.msg`.
  - JWT payload uses `{ userId, role }` — **role** values are exact strings: `'farmer'` or `'admin'`.
  - Request `status` enum: `'Pending'`, `'Approved'`, `'Rejected'`.

## Development patterns & expectations ✅

- Add new server endpoints under `backend/routes/*` and corresponding controllers in `backend/controllers/*`.
- Keep auth checks using `authMiddleware` then `authorizeRoles('farmer'|'admin')` when needed.
- On frontend, reuse `api` from `src/api.js` so Authorization header and base URL are consistent.
- UI styling uses Tailwind classes; prefer existing components (`Navbar`, page layouts) to keep consistent design.

## Debugging & common pitfalls ⚠️

- Missing JWT → 401 with message: `No token, authorization denied`.
- Role mismatch → 403 with message: `Access denied: insufficient role`.
- DB connection errors are logged to console; check `MONGO_URI` in backend `.env`.
- Dates: code may reference `createdAt` or `requestDate`; prefer `createdAt` when available.

## Quick examples

- Login (curl):

  curl -s -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{"email":"x","password":"y"}'

- Create request (farmer):

  curl -s -X POST http://localhost:5000/api/requests -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" -d '{"area":"Village A","powerRequired":15}'

## For an AI agent — task guidance ✍️

- Prioritize small, reversible changes; update both backend and frontend for end-to-end features.
- Use existing patterns: controllers → routes, `api` axios instance, `AuthContext` for auth state.
- When adding fields to `PowerRequest`, update Mongoose schema (`models/PowerRequest.js`), backend validation, and all frontend pages that show or submit that field.

---

If anything in these notes is unclear or you want this file tailored to a specific workflow (CI, tests, or deployment), tell me which area to expand and I'll iterate. ✅
