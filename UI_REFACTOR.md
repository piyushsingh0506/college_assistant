# College Assistant — UI Refactor

## What changed
- Admin dashboard now uses the same `role-dashboard` interface system as Student and Faculty.
- Admin sidebar, profile block, navigation, top bar, welcome banner, metrics, panels, and responsive behavior use the shared theme.
- Admin CRUD section pages use the same shared shell and visual language.
- Existing Admin API endpoints and role protection were preserved.
- Added shared styling for existing Admin forms/tables so they no longer fall back to the old blue/gray theme.
- Removed private backend `.env` from this delivery. Use `backend/.env.example` to configure your local environment.

## Run
### Backend
```bash
cd backend
python -m venv venv
# activate venv
pip install -r requirements.txt
# configure .env
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

The uploaded `node_modules` was intentionally not included. Run `npm install` on the target machine so Vite/Rollup installs the correct platform binaries.
