# Mini Stack Overflow

Une plateforme de questions-réponses technique inspirée de Stack Overflow.

## Structure du Projet

```
mini-stack-overflow/
├── backend/          # Django REST API
├── frontend/         # React.js application
└── README.md
```

## Technologies

- **Backend**: Django REST Framework + PostgreSQL
- **Frontend**: React.js + Tailwind CSS
- **Auth**: JWT (djangorestframework-simplejwt)
- **Déploiement**: Railway (gratuit)

## Installation

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Sur Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## Déploiement Gratuit

### Backend (Railway)
1. Créer un compte sur [Railway](https://railway.app)
2. Connecter votre repo GitHub
3. Railway détecte automatiquement Django
4. Ajouter PostgreSQL depuis les services

### Frontend (Vercel)
1. Créer un compte sur [Vercel](https://vercel.com)
2. Importer votre repo GitHub
3. Vercel déploie automatiquement React

## Variables d'environnement

Voir `.env.example` dans chaque dossier.
