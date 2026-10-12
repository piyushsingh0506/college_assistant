# College Assistant 🎓

A full-stack college management portal that connects administrators, faculty, and students through a single web application.

## Features

### Admin
- Create and manage students and faculty.
- Manage subjects, notices, and laboratories.
- Access administrative dashboard features.

### Faculty
- Upload and update student marks.
- Manage attendance.
- Publish assignments and exams.

### Student
- View profile and digital ID information.
- Check marks and attendance.
- View assignments, exams, and notices.
- Access notifications and timetable information.
- Check laboratory availability and lecture replacements.

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | React, Vite, Axios |
| Backend | Python, FastAPI |
| Database | MySQL, SQLAlchemy |
| Authentication | JWT |
| Web server | Nginx |
| Cloud hosting | AWS EC2 |
| Database hosting | AWS RDS |
| CI/CD | GitHub Actions |

## Project Structure

```text
college_assistant/
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   ├── models/
│   │   └── ...
│   ├── requirements.txt
│   ├── .env.example
│   └── seed.py
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env.example
├── .github/
│   └── workflows/
│       └── main.yml
└── README.md
```

## Local Setup on Windows

### Prerequisites
- Python 3.11 or a compatible version.
- Node.js and npm.
- MySQL Server.
- Git.

### 1. Clone the repository

```powershell
git clone https://github.com/piyushsingh0506/college_assistant.git
cd college_assistant
```

### 2. Create the database

Open MySQL and execute:

```sql
CREATE DATABASE college_assistant;
```

### 3. Configure the backend

```powershell
cd backend
py -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
```

Update `backend/.env` with your local database connection and required environment variables.

Example database URL:

```text
DATABASE_URL=mysql+pymysql://YOUR_USER:YOUR_PASSWORD@localhost:3306/college_assistant
```

Use your own MySQL username and password. Do not commit `.env` to GitHub.

### 4. Start the backend

From the `backend` directory, activate the virtual environment and run:

```powershell
python seed.py
uvicorn app.main:app --reload
```

Backend API:

- API: http://127.0.0.1:8000
- Swagger documentation: http://127.0.0.1:8000/docs
- Health check: http://127.0.0.1:8000/api/health

### 5. Start the frontend

Open a second PowerShell terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite in your terminal. The configured development port may be `5176`.

If using a separate API host, configure `VITE_API_BASE_URL` in `frontend/.env` according to `frontend/.env.example`.

## Demo Accounts

The following credentials are documented for local demo use, provided the corresponding users have been created in the database.

| Role | Email | Password |
|---|---|---|
| Admin | admin@college.com | Admin@123 |
| Faculty | faculty@college.com | Faculty@123 |
| Student | student@college.com | Student@123 |

Do not use demo passwords in a production deployment.

## AWS Deployment

The application is designed to run with the following architecture:

```text
User's Browser
      |
      v
AWS EC2 — Nginx
      |
      +---- React frontend
      |
      +---- /api requests
                  |
                  v
            FastAPI backend
                  |
                  v
             AWS RDS MySQL
```

### Deployment components

- **AWS EC2:** Hosts the application and backend service.
- **Nginx:** Serves the frontend and reverse-proxies API requests.
- **AWS RDS:** Hosts the MySQL database.
- **GitHub Actions:** Automates frontend build, backend validation, and deployment workflows.

For production deployment, configure environment variables, security groups, CORS, HTTPS, and database access securely.

## Environment Variables

Backend settings may include:

- `DATABASE_URL`
- `SECRET_KEY`
- `FRONTEND_ORIGINS`
- `GEMINI_API_KEY` and `GEMINI_MODEL`, if the AI assistant is enabled.

Use the variable names defined in `backend/.env.example` and the application's configuration. Keep all secrets out of source control.

## Current Scope and Future Improvements

This project is a working foundation/MVP. Depending on the implemented features, future improvements may include:

- Refresh tokens and stronger authentication.
- Password reset functionality.
- Cloud file storage using S3 or another storage service.
- Complete timetable and lecture replacement management.
- Scheduled notifications.
- Student assignment submissions.
- AI-powered study assistant with retrieval-augmented generation (RAG).
- Audit logs and finer-grained admin permissions.
- Validation for marks, duplicate records, and other inputs.
- Production-grade HTTPS, CORS, and secret management.

## Security

- Never commit `.env` files, database passwords, API keys, or private SSH keys.
- Use strong, unique secrets in production.
- Restrict database access to authorized application servers.
- Use HTTPS for public access.
- Change demo credentials before production use.

## License

Add a license file if you intend to distribute this project under an open-source license.
