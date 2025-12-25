# Guide Complet d'Installation et Déploiement

## Installation Locale

### Prérequis
- Python 3.11+
- Node.js 18+
- PostgreSQL 13+
- Git

### 1. Cloner le projet
```bash
git clone <votre-repo>
cd mini-stack-overflow
```

### 2. Backend Django

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Copier le fichier d'environnement
cp .env.example .env

# Installer les dépendances
pip install -r requirements.txt

# Créer la base de données
python manage.py migrate

# Créer un superuser
python manage.py createsuperuser

# Lancer le serveur
python manage.py runserver
```

Le backend sera disponible à `http://localhost:8000`

### 3. Frontend React

```bash
cd frontend
npm install

# Copier le fichier d'environnement (optionnel pour le dev)
cp .env.example .env

# Lancer le serveur de développement
npm start
```

Le frontend sera disponible à `http://localhost:3000`

### 4. Test de l'Application
1. Aller à http://localhost:3000
2. Cliquer sur "Inscription" et créer un compte
3. Se connecter
4. Créer une question en cliquant "Poser une question"
5. Voir les questions dans la page d'accueil
6. Cliquer sur une question pour voir les réponses

## Déploiement Gratuit

### Voir DEPLOYMENT.md pour les instructions détaillées

## Architecture du Projet

```
mini-stack-overflow/
├── backend/                    # Django REST API
│   ├── config/                # Configuration Django
│   ├── users/                 # App authentification
│   ├── questions/             # App questions/réponses
│   ├── manage.py
│   ├── requirements.txt
│   └── Procfile              # Pour Railway
│
├── frontend/                   # React.js
│   ├── src/
│   │   ├── pages/            # Pages de l'application
│   │   ├── components/       # Composants réutilisables
│   │   ├── context/          # Context API (Auth)
│   │   ├── api/              # Appels API
│   │   └── index.css         # Styles globaux
│   ├── package.json
│   └── vercel.json          # Configuration Vercel
│
├── README.md
└── DEPLOYMENT.md
```

## Features Implémentées

### Authentification
- Inscription / Connexion
- JWT tokens
- Rafraîchissement automatique de token
- Déconnexion

### Questions
- Lister toutes les questions
- Filtrer par tags, votes, unanswered
- Créer une question (authentifié)
- Voir les détails d'une question
- Modifier ses propres questions (auteur)
- Supprimer ses propres questions (auteur)

### Réponses
- Voir les réponses d'une question
- Créer une réponse (authentifié)
- Accepter une réponse comme meilleure (auteur de la question)
- Modifier ses propres réponses (auteur)
- Supprimer ses propres réponses (auteur)

### Votes
- Voter sur les questions et réponses (authentifié)
- Compter les votes

### Tags
- Filtrer les questions par tags
- Voir les tags disponibles

### Profils
- Voir son profil personnalisé
- Voir le profil public d'autres utilisateurs
- Voir les statistiques (questions, réponses, votes)

## API Endpoints

### Authentification
- `POST /api/auth/register/` - Inscription
- `POST /api/auth/login/` - Connexion
- `POST /api/auth/token/refresh/` - Rafraîchir token
- `GET /api/auth/profile/` - Profil actuel
- `GET /api/auth/users/<id>/` - Profil public

### Questions
- `GET /api/questions/` - Lister questions (filtres possibles)
- `POST /api/questions/` - Créer question
- `GET /api/questions/<id>/` - Détails question
- `PUT /api/questions/<id>/` - Modifier question
- `DELETE /api/questions/<id>/` - Supprimer question

### Réponses
- `POST /api/questions/<question_id>/answers/` - Créer réponse
- `GET /api/answers/<id>/` - Détails réponse
- `PUT /api/answers/<id>/` - Modifier réponse
- `DELETE /api/answers/<id>/` - Supprimer réponse
- `POST /api/answers/<id>/accept/` - Accepter réponse

### Votes
- `POST /api/questions/<id>/vote/` - Voter sur question
- `POST /api/answers/<id>/vote/` - Voter sur réponse

### Tags
- `GET /api/tags/` - Lister tags

## Dépannage

### Erreur CORS
Si vous avez une erreur CORS, vérifier que:
1. Le frontend pointe vers le bon backend
2. CORS_ALLOWED_ORIGINS dans settings.py inclut l'URL du frontend

### Token expiré
Le token est rafraîchi automatiquement. Si problèmes persistent:
1. Effacer les cookies du navigateur
2. Se reconnecter

### Base de données vide
Si aucune question ne s'affiche:
1. Créer une question via l'admin Django (http://localhost:8000/admin)
2. Ou créer via le formulaire frontend
