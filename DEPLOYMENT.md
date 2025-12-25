# Guide de Déploiement Gratuit

## Backend Django sur Railway

### Étape 1: Préparer le projet
1. Créer un compte sur [Railway.app](https://railway.app)
2. Installer Railway CLI: `npm i -g @railway/cli`
3. Se connecter: `railway login`

### Étape 2: Configurer le projet
Créer les fichiers suivants dans `/backend`:

**Procfile**
```
web: gunicorn config.wsgi --log-file -
```

**runtime.txt**
```
python-3.11.0
```

**requirements.txt** (ajouter)
```
gunicorn==21.2.0
dj-database-url==2.1.0
whitenoise==6.6.0
```

### Étape 3: Modifier settings.py
```python
import dj_database_url

# Production settings
if not DEBUG:
    ALLOWED_HOSTS = ['*']  # À remplacer par votre domaine
    
    # Database
    DATABASES['default'] = dj_database_url.config(
        conn_max_age=600,
        conn_health_checks=True,
    )
    
    # Static files
    MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware')
    STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
```

### Étape 4: Déployer
```bash
cd backend
railway init
railway up
railway add postgresql
railway run python manage.py migrate
railway run python manage.py createsuperuser
```

### Étape 5: Variables d'environnement
Dans le dashboard Railway, ajouter:
- `SECRET_KEY`: votre clé secrète
- `DEBUG`: False
- `ALLOWED_HOSTS`: votre-app.railway.app
- `CORS_ALLOWED_ORIGINS`: https://votre-frontend.vercel.app

---

## Frontend React sur Vercel

### Étape 1: Préparer le projet
1. Créer un compte sur [Vercel.com](https://vercel.com)
2. Installer Vercel CLI: `npm i -g vercel`

### Étape 2: Configurer l'API
Modifier `frontend/src/api/axios.js`:
```javascript
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
});
```

Créer `frontend/.env.production`:
```
REACT_APP_API_URL=https://votre-backend.railway.app/api
```

### Étape 3: Déployer
```bash
cd frontend
vercel
```

Suivre les instructions et confirmer le projet.

### Étape 4: Variables d'environnement
Dans le dashboard Vercel, ajouter:
- `REACT_APP_API_URL`: https://votre-backend.railway.app/api

---

## Alternatives Gratuites

### Backend
- **Render.com**: 750h/mois gratuit
- **Fly.io**: Jusqu'à 3 petites VMs gratuites
- **PythonAnywhere**: 1 application gratuite

### Frontend
- **Netlify**: Déploiement gratuit illimité
- **GitHub Pages**: Pour sites statiques
- **Surge.sh**: CLI simple et rapide

### Base de Données
- **Supabase**: 500MB PostgreSQL gratuit
- **ElephantSQL**: 20MB PostgreSQL gratuit
- **Neon**: PostgreSQL serverless gratuit

---

## Checklist Avant Déploiement

- [ ] SECRET_KEY changée en production
- [ ] DEBUG = False en production
- [ ] ALLOWED_HOSTS configuré
- [ ] CORS_ALLOWED_ORIGINS configuré
- [ ] Base de données PostgreSQL configurée
- [ ] Migrations exécutées
- [ ] Superuser créé
- [ ] Variables d'environnement définies
- [ ] Frontend pointe vers le bon backend
- [ ] Tests effectués en production
