# College Assistant

A starter full-stack college management portal with three roles:

- Admin: create students, faculty, subjects, notices and labs.
- Faculty: upload/update marks and attendance; publish assignments and exams.
- Student: view profile/digital ID data, marks, attendance, assignments, exams, notices, notifications, timetable, current lab availability and replacements.

## Stack

Backend: FastAPI + SQLAlchemy + MySQL + JWT
Frontend: React + Vite + Axios

## Windows setup

### 1. MySQL

Create the database:

```sql
CREATE DATABASE college_assistant;
```

### 2. Backend

```powershell
cd backend
py -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
```

Edit `.env` and put your MySQL password in DATABASE_URL.

Then:

```powershell
python seed.py
uvicorn app.main:app --reload
```

Open:

- API: http://127.0.0.1:8000
- Swagger: http://127.0.0.1:8000/docs

### 3. Frontend

Keep the backend running, then open another PowerShell from the project root:

```powershell
cd frontend
npm install
npm run dev
```

Open http://localhost:5176. During development, Vite forwards `/api` requests to
the backend at `http://127.0.0.1:8000`, so the browser does not need a separate
API origin. To use a different API host, create `frontend/.env` from
`frontend/.env.example` and set `VITE_API_BASE_URL` to that host's `/api` URL.
For example: `VITE_API_BASE_URL=https://api.example.com/api`. For a
cross-origin deployment, set `FRONTEND_ORIGINS` in `backend/.env` to the
frontend origin (for example, `https://college.example.com`).

## Demo accounts

Admin:
`admin@college.com` / `Admin@123`

Faculty:
`faculty@college.com` / `Faculty@123`

Student:
`student@college.com` / `Student@123`

## Important

This is a working foundation/MVP. Before production, add:

- refresh tokens and stronger authentication
- password reset
- file upload storage (S3/Cloudinary/local storage)
- CSV/Excel bulk import
- timetable management
- lecture replacement management
- 10-minute scheduled notifications
- assignment submission by students
- AI assistant and RAG study assistant
- audit logs and admin permissions
- validation for mark ranges and duplicate records
- production CORS, HTTPS and secret management
