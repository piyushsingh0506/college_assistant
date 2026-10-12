# 🎓 College Assistant

A full-stack college management portal built with React, FastAPI, and MySQL. The application provides separate dashboards for administrators, faculty, and students to manage academic activities through a centralized platform.

## 🚀 Live Demo

**Live Application:** http://13.60.231.220

**GitHub Repository:** https://github.com/piyushsingh0506/college_assistant

> The live application requires the AWS EC2 server, Nginx, and backend services to be running. HTTPS should be configured before using the application to handle real user credentials.

## ✨ Features

### 👨‍💼 Admin Dashboard
- Create and manage students.
- Manage faculty information.
- Manage subjects.
- Publish college notices.
- Manage laboratory information.
- Access administrative dashboard features.

### 👨‍🏫 Faculty Dashboard
- Upload and update student marks.
- Manage student attendance.
- Publish assignments.
- Create and manage exams.
- Access faculty dashboard features.

### 👨‍🎓 Student Dashboard
- View profile and digital ID information.
- Check marks and academic performance.
- View attendance records.
- Access assignments and exams.
- View college notices and notifications.
- View timetable information.
- Check laboratory availability.
- View lecture replacements.

### 🔐 Authentication
- JWT-based authentication.
- Role-based dashboards for admin, faculty, and students.
- Protected API requests using authorization tokens.

## 🛠️ Technology Stack

| Component | Technology |
|---|---|
| Frontend | React |
| Frontend tooling | Vite |
| HTTP client | Axios |
| Backend | Python, FastAPI |
| ORM | SQLAlchemy |
| Database | MySQL |
| Authentication | JSON Web Tokens (JWT) |
| Web server | Nginx |
| Cloud hosting | AWS EC2 |
| Managed database | AWS RDS |
| CI/CD | GitHub Actions |
| Version control | Git and GitHub |

## 🏗️ System Architecture

```text
                 Users
                   |
                   v
             Web Browser
                   |
                   v
            AWS EC2 / Nginx
                   |
          +--------+--------+
          |                 |
          v                 v
    React Frontend     /api Requests
                            |
                            v
                      FastAPI Backend
                            |
                            v
                       SQLAlchemy
                            |
                            v
                       AWS RDS MySQL
```

Nginx serves the frontend and forwards API requests to the FastAPI backend. The backend communicates with the MySQL database hosted on AWS RDS.

## 📂 Project Structure

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

*Note: The structure above is a simplified overview; the exact files and directories may vary.*

## 💻 Local Installation on Windows

### Prerequisites

Install the following software before starting:

- Python 3.11 or another version supported by the project.
- Node.js and npm.
- MySQL Server.
- Git.
- Visual Studio Code (recommended).

### Step 1: Clone the Repository

Open PowerShell and run:

```powershell
git clone https://github.com/piyushsingh0506/college_assistant.git
cd college_assistant
```

### Step 2: Create the MySQL Database

Open your MySQL client and execute:

```sql
CREATE DATABASE college_assistant;
```

Make sure MySQL is running before starting the backend.

### Step 3: Set Up the Backend

From the project root, run:

```powershell
cd backend
py -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
```

If PowerShell blocks virtual environment activation, review your local PowerShell execution policy rather than disabling security controls globally.

### Step 4: Configure Environment Variables

Open `backend/.env` and configure the variables required by your application.

Example database URL:

```text
DATABASE_URL=mysql+pymysql://YOUR_USER:YOUR_PASSWORD@localhost:3306/college_assistant
```

Replace `YOUR_USER` and `YOUR_PASSWORD` with your own local MySQL credentials.

Configure other required settings, such as the JWT secret and frontend origins, using the variable names in `backend/.env.example`.

**Important:** Never commit `.env` files, database passwords, API keys, or JWT secrets to GitHub.

### Step 5: Initialize the Database and Start the Backend

From the `backend` directory, with the virtual environment activated:

```powershell
python seed.py
uvicorn app.main:app --reload
```

The backend should now be available at:

- API base address: http://127.0.0.1:8000
- API health check: http://127.0.0.1:8000/api/health
- Swagger documentation: http://127.0.0.1:8000/docs

The Swagger page is intended for development and should be reviewed before exposing API documentation in production.

### Step 6: Set Up the Frontend

Open a second PowerShell terminal from the project root:

```powershell
cd frontend
npm install
npm run dev
```

Open the local development URL printed by Vite in the terminal. The configured development port may be `5176`.

During development, the Vite proxy can forward `/api` requests to the backend at `http://127.0.0.1:8000`, if configured in the project.

If a separate API base URL is required, create `frontend/.env` from `frontend/.env.example` and set `VITE_API_BASE_URL` to the appropriate API URL.

## 👤 Demo Accounts

The following demo accounts are documented for local testing:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@college.com` | `Admin@123` |
| Faculty | `faculty@college.com` | `Faculty@123` |
| Student | `student@college.com` | `Student@123` |

These accounts work only if they have been created in the database and the corresponding passwords match.

**Security:** These are demo credentials, not production credentials. Do not publish or reuse them for a live system containing real student data.

## ☁️ AWS Deployment

The application is configured for deployment using AWS EC2 and AWS RDS.

### Deployment Components

- **AWS EC2:** Hosts the frontend and backend application services.
- **Nginx:** Serves frontend assets and reverse-proxies API requests.
- **AWS RDS MySQL:** Stores application data.
- **GitHub Actions:** Automates build, validation, and deployment tasks.

### Deployment Workflow

The intended deployment process is:

1. Code is pushed to the GitHub repository.
2. GitHub Actions builds the React frontend.
3. The backend workflow installs dependencies and validates the Python code.
4. Deployment jobs transfer the required files to the EC2 instance.
5. Nginx serves the frontend and forwards API requests to FastAPI.

The exact steps executed depend on the current workflow configuration in `.github/workflows/main.yml`.

### Production Checklist

Before using the application with real users:

- Configure HTTPS using a valid TLS certificate.
- Restrict SSH access to trusted IP addresses.
- Allow RDS database connections only from the authorized application server.
- Use strong production secrets.
- Disable or restrict public API documentation if it is not required.
- Verify JWT authentication and role-based permissions on sensitive endpoints.
- Back up the database and monitor server health.
- Configure production CORS origins.
- Avoid exposing internal error messages or sensitive application details.

## ⚙️ Environment Configuration

The backend may use the following settings, depending on the application's implementation:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Database connection string |
| `SECRET_KEY` | Secret used for token signing |
| `FRONTEND_ORIGINS` | Allowed frontend origins |
| `GEMINI_API_KEY` | API key, if Gemini integration is enabled |
| `GEMINI_MODEL` | Selected Gemini model, if configured |

Check `backend/.env.example` for the exact environment variables supported by your current code.

Never add actual secret values to this README.

## 🔄 GitHub Actions CI/CD

The repository includes a GitHub Actions workflow at:

```text
.github/workflows/main.yml
```

Depending on its configuration, the workflow can automate:

- Frontend dependency installation and build.
- Backend dependency installation and code validation.
- Frontend deployment to EC2.
- Backend deployment to EC2.

Deployment jobs require correctly configured GitHub repository secrets and appropriate server permissions.

Typical secrets include:

- `EC2_HOST`
- `EC2_USERNAME`
- `EC2_SSH_KEY`

Configure these under your repository's **Settings → Secrets and variables → Actions**. Store private keys and other sensitive values only as secrets; never place them directly in the workflow file.

## 🧪 Testing

You can verify the local backend using the health endpoint:

```text
http://127.0.0.1:8000/api/health
```

For the deployed application, the corresponding health endpoint is:

```text
http://13.60.231.220/api/health
```

The health endpoint confirms basic backend availability only; it does not necessarily verify database connectivity or every application feature.

## 🚧 Current Scope and Future Improvements

This project provides a foundation for a college management system. Potential improvements include:

- Refresh tokens and stronger authentication controls.
- Password reset and account recovery.
- Secure file storage using Amazon S3 or another storage service.
- Complete timetable management.
- Complete lecture replacement management.
- Scheduled notifications.
- Student assignment submissions.
- AI-powered study assistant and retrieval-augmented generation (RAG).
- Audit logs and granular administrative permissions.
- Validation for marks, duplicate records, and other inputs.
- Automated tests and production monitoring.

Items in this list are planned improvements unless they are already implemented and tested in the application.

## 🔒 Security Guidelines

- Do not commit `.env` files or private credentials.
- Use unique and strong secrets in production.
- Change demo passwords before production use.
- Use HTTPS for public traffic.
- Keep database ports private.
- Enforce authentication and authorization on protected API routes.
- Apply security updates to the operating system and dependencies.
- Back up important data and monitor application logs.

## 📄 License

No license is specified here. Add a `LICENSE` file if you intend to distribute this project under a particular open-source license.

---

**Developed as a full-stack college management project using React, FastAPI, MySQL, and AWS.**

