# CareerSync

CareerSync is a platform connecting students, institutes, and industry — bridging the gap between academic learning and career readiness.

## Project Structure

```
careersync/
├── frontend/        # React + Vite frontend application
├── backend/         # Django REST Framework backend API
└── README.md
```

## Getting Started

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend

**Mac / Linux**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

**Windows**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## Tech Stack

- **Frontend**: React, Vite, Redux Toolkit
- **Backend**: Django, Django REST Framework, SQLite
