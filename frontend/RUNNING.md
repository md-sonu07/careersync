# CareerSync Frontend — Running Instructions

## Prerequisites

- Node.js 20+ installed
- Backend Django server running (see [Backend Running Instructions](#backend-running-instructions))
- API base URL configured (default: `http://127.0.0.1:8000/api`)

---

## Installation

```bash
# Install dependencies
npm install
```

---

## Development

Start the Vite development server:

```bash
npm run dev
```

The frontend will be available at:

```
http://localhost:5173
```

---

## API Configuration

The frontend reads the API base URL from environment variables. By default, it uses:

```
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

This is already set in `frontend/.env`. If you need to change it:

1. Copy the example env file (if needed):

```bash
cp .env.example .env  # if .env.example exists
```

2. Edit `.env`:

```
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

3. Restart the dev server:

```bash
npm run dev
```

---

## Available npm Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server at `http://localhost:5173` |
| `npm run build` | Build production bundle (174 modules, ~737kb gzipped to 191kb) |
| `npm run lint` | Run oxlint for code quality |
| `npm run preview` | Preview production build locally |
| `npm test` | Run Vitest test suite |
| `npm run test:run` | Run tests once |
| `npm run test:coverage` | Run tests with coverage report |

---

## Development Workflow

1. **Start the backend** first (see backend instructions)
2. **Start the frontend** `npm run dev`
3. Visit `http://localhost:5173` in your browser
4. The app will auto-reload on code changes
5. API calls go to `VITE_API_BASE_URL` (configured in `.env`)

---

## Build for Production

```bash
npm run build
```

Output goes to `frontend/dist/`. The build is optimized with 174 modules minified to ~737kb (gzip: 191kb).

---

## Testing

```bash
# Run all tests once
npm run test:run

# Run tests with coverage
npm run test:coverage
```

Test setup uses Vitest + React Testing Library + jsdom. Test files are in `src/__tests__/` and `tests/`.

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://127.0.0.1:8000/api` | Base URL for all Django REST API calls |

Edit `frontend/.env` to override.

---

# CareerSync Backend — Running Instructions

## Prerequisites

- Python 3.10+ installed
- `virtualenv` or `venv` available
- PostgreSQL (optional — SQLite is used by default)
- Git

---

## Installation

### 1. Create and activate a virtual environment

```bash
# From the backend directory
python -m venv venv

# Activate:
# macOS / Linux:
source venv/bin/activate

# Windows:
.\venv\Scripts\activate
```

### 2. Install Python dependencies

```bash
pip install upgrade pip
pip install -r requirements.txt
```

### 3. Configure environment variables

The backend uses `.env` for configuration. A sample is provided:

```bash
cp .env .env  # already exists
```

Edit `backend/.env` as needed:

```
SECRET_KEY=django-insecure-careersync-dev-key-change-in-production-12345
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0

# CORS for React frontend
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# JWT Configuration (optional overrides)
JWT_ACCESS_MINUTES=60
JWT_REFRESH_DAYS=7
```

### 4. Run database migrations

```bash
python manage.py migrate
```

This creates the SQLite database (`db.sqlite3`) with all tables.

### 5. Create a superuser (optional, for admin access)

```bash
python manage.py createsuperuser
```

Enter email and password when prompted.

---

## Development

Start the Django development server:

```bash
python manage.py runserver
```

The backend API will be available at:

```
http://127.0.0.1:8000
```

### API Base URLs

- **Admin interface:** `http://127.0.0.1:8000/admin`
- **API endpoints:** `http://127.0.0.1:8000/api/...`
- **Swagger docs:** `http://127.0.0.1:8000/api/schema/swagger/` (via drf_yasg)
- **Redoc docs:** `http://127.0.0.1:8000/api/schema/redoc/`

### Key API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/health/` | Health check |
| `POST /api/auth/register/` | User registration |
| `POST /api/auth/login/` | User login (returns JWT) |
| `POST /api/auth/token/refresh/` | Refresh access token |
| `GET /api/auth/me/` | Get current user info |
| `GET /api/students/...` | Student-related APIs |
| `GET /api/companies/...` | Company-related APIs |
| `GET /api/skills/...` | Skill-related APIs |
| `GET /api/opportunities/...` | Opportunity/matching APIs |
| `GET /api/assessments/...` | Assessment APIs |

---

## Database Management

### Run migrations after code changes

```bash
python manage.py makemigrations
python manage.py migrate
```

### Reset database (development only)

```bash
rm db.sqlite3
python manage.py makemigrations
python manage.py migrate
```

### SQLite browser (optional)

You can view the database with [DB Browser for SQLite](https://sqlite.org/index.html).

---

## Production Deployment

1. Set `DEBUG=False` in `.env`
2. Add production domains to `ALLOWED_HOSTS`
3. Use `python manage.py collectstatic`
4. Use a production WSGI server (Gunicorn, uWSGI) instead of `runserver`
5. Configure PostgreSQL instead of SQLite
6. Set secure `SECRET_KEY` and JWT settings
7. Use HTTPS with proper CORS configuration

---

## Testing the Backend

```bash
# Run Django test suite
python manage.py test

# Specific app tests
python manage.py test accounts
python manage.py test students
python manage.py test companies
```

---

## Local Development Summary

### Start Order

1. **Backend first:** `cd backend && source venv/bin/activate && python manage.py runserver`
2. **Frontend second:** `cd frontend && npm run dev`

### Access Points

| Service | URL |
|---------|-----|
| Frontend (React) | `http://localhost:5173` |
| Backend API | `http://127.0.0.1:8000` |
| Backend Admin | `http://127.0.0.1:8000/admin` |
| Health Check | `http://127.0.0.1:8000/api/health/` |

### Environment Variables Summary

| Location | Variable | Default |
|----------|----------|---------|
| `backend/.env` | `SECRET_KEY` | `django-insecure-careersync-dev-key-change-in-production-12345` |
| `backend/.env` | `DEBUG` | `True` |
| `backend/.env` | `CORS_ALLOWED_ORIGINS` | `http://localhost:3000,http://localhost:5173` |
| `frontend/.env` | `VITE_API_BASE_URL` | `http://127.0.0.1:8000/api` |

---

## Need Help?

- Check `backend/CareerSync — Backend Development Guide for Gemini.md` for full phase-by-phase development guide
- Check `frontend/README.md` for component conventions, routing, and design system docs
- Run `python manage.py check` to validate Django configuration
- Run `npm run lint` to validate frontend code