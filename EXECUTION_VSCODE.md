# Guide Complet d'Exécution sur VSCode

## 1. Prérequis d'Installation

### Windows
1. **Python** - Télécharger depuis https://www.python.org/downloads/
   - Cocher "Add Python to PATH" pendant l'installation
   - Vérifier: Ouvrir PowerShell et taper `python --version`

2. **Node.js** - Télécharger depuis https://nodejs.org/
   - Choisir LTS version
   - Vérifier: Ouvrir PowerShell et taper `node --version` et `npm --version`

3. **PostgreSQL** - Télécharger depuis https://www.postgresql.org/download/
   - Installer et noter le mot de passe du superuser
   - Créer une base de données appelée `mini_stackoverflow`

4. **VSCode** - Télécharger depuis https://code.visualstudio.com/

### Mac
```bash
# Installer Homebrew si pas installé
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Installer Python
brew install python@3.11

# Installer Node.js
brew install node

# Installer PostgreSQL
brew install postgresql
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install python3 python3-pip python3-venv
sudo apt install nodejs npm
sudo apt install postgresql postgresql-contrib
```

## 2. Configuration Initiale du Projet

### Étape 1: Télécharger et organiser le projet

1. **Télécharger** le projet ZIP depuis v0
2. **Extraire** dans votre dossier de travail
3. **Ouvrir le dossier** `mini-stack-overflow` dans VSCode
   - File → Open Folder → Sélectionner le dossier

## 3. Configuration du Backend Django

### Étape 1: Ouvrir un terminal pour le backend

Dans VSCode:
1. Terminal → New Terminal (ou Ctrl+`)
2. Naviguer vers le backend:
```bash
cd backend
```

### Étape 2: Créer l'environnement virtuel Python

**Windows (PowerShell):**
```bash
python -m venv venv
venv\Scripts\Activate.ps1
```

**Mac/Linux (Bash):**
```bash
python3 -m venv venv
source venv/bin/activate
```

Vous devriez voir `(venv)` au début de votre terminal.

### Étape 3: Installer les dépendances Django

```bash
pip install -r requirements.txt
```

### Étape 4: Configurer les variables d'environnement

1. Créer un fichier `.env` dans le dossier `backend/`
2. Copier le contenu de `.env.example`
3. Modifier les valeurs:

```env
SECRET_KEY=votre-clé-secrète-ici
DEBUG=True
DATABASE_URL=postgresql://postgres:votre_mdp@localhost:5432/mini_stackoverflow
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Étape 5: Migrer la base de données

```bash
python manage.py migrate
```

### Étape 6: Créer un superuser (administrateur)

```bash
python manage.py createsuperuser
```

Exemple:
```
Username: admin
Email: admin@example.com
Password: admin123
```

### Étape 7: Lancer le backend Django

```bash
python manage.py runserver
```

Vous devriez voir:
```
Starting development server at http://127.0.0.1:8000/
```

✅ **Backend prêt à** `http://localhost:8000`

## 4. Configuration du Frontend React

### Étape 1: Ouvrir un DEUXIÈME terminal pour le frontend

**Important**: Ne pas fermer le terminal du backend!

Dans VSCode:
1. Terminal → New Terminal (ou Ctrl+Backtick une deuxième fois)
2. Naviguer vers le frontend:
```bash
cd frontend
```

### Étape 2: Installer les dépendances Node.js

```bash
npm install
```

Cela peut prendre quelques minutes.

### Étape 3: Configurer les variables d'environnement (optionnel)

Le frontend devrait déjà pointer vers `http://localhost:8000` par défaut.

Si vous avez un fichier `.env`, vérifiez:
```env
REACT_APP_API_BASE_URL=http://localhost:8000
```

### Étape 4: Lancer le frontend React

```bash
npm start
```

Vous devriez voir:
```
Compiled successfully!
You can now view frontend in the browser.
Local: http://localhost:3000
```

Une fenêtre du navigateur devrait s'ouvrir automatiquement.

✅ **Frontend prêt à** `http://localhost:3000`

## 5. Test Complet de l'Application

### Vérifier que tout fonctionne

1. **Backend Django Admin**
   - Ouvrir http://localhost:8000/admin
   - Se connecter avec les identifiants du superuser (admin/admin123)
   - Voir les tables: Users, Questions, Answers, etc.

2. **Frontend React**
   - Ouvrir http://localhost:3000
   - La page d'accueil devrait charger
   - Cliquer sur "Inscription"

### Tester l'authentification

1. **Créer un nouveau compte**
   - Email: test@example.com
   - Password: Test123!

2. **Se connecter**
   - Utiliser test@example.com / Test123!

3. **Créer une question**
   - Cliquer sur "Poser une question"
   - Titre: "Comment faire un API en Django?"
   - Description: "Je veux créer une API REST..."
   - Tags: django, api
   - Cliquer "Soumettre"

4. **Voir la question**
   - La question devrait apparaître sur la page d'accueil
   - Cliquer sur la question pour voir les détails
   - Vous devriez pouvoir modifier ou supprimer (vous êtes l'auteur)

5. **Voter et commenter**
   - Cliquer sur les flèches pour voter
   - Ajouter une réponse en bas

6. **Accès sans connexion**
   - Cliquer sur "Se déconnecter"
   - Vous pouvez voir les questions mais pas les modifier
   - Les boutons "Répondre", "Voter" sont désactivés

## 6. Architecture avec Plusieurs Terminaux

Voici comment organiser VSCode:

```
Terminal 1 (Backend): 
   cd backend && source venv/bin/activate && python manage.py runserver

Terminal 2 (Frontend):
   cd frontend && npm start

Terminal 3 (Optionnel - Commandes supplémentaires)
   Pour créer des migrations, exécuter des commandes...
```

### Raccourcis utiles:

- **Ctrl+`** : Ouvrir/Fermer terminal
- **Ctrl+Shift+`** : Nouveau terminal
- **Click sur Terminal 1/2** : Basculer entre terminaux
- **Split Terminal** : Bouton "Split" en haut à droite du terminal

## 7. Commandes Utiles

### Backend Django

```bash
# Voir toutes les commandes
python manage.py help

# Créer une migration après modification des models
python manage.py makemigrations

# Appliquer les migrations
python manage.py migrate

# Accéder à la console Python interactive Django
python manage.py shell

# Collecter les fichiers statiques
python manage.py collectstatic

# Tests unitaires
python manage.py test
```

### Frontend React

```bash
# Voir la version
npm --version

# Installer un nouveau package
npm install nom-package

# Vérifier les dépendances
npm list

# Build pour la production
npm run build

# Linter (vérifier le code)
npm run lint
```

## 8. Dépannage Courant

### Erreur: "Port 3000 already in use"
```bash
# Trouver le process utilisant le port
lsof -i :3000  # Mac/Linux
netstat -ano | findstr :3000  # Windows

# Tuer le process
kill -9 <PID>  # Mac/Linux
taskkill /PID <PID> /F  # Windows
```

### Erreur: "Port 8000 already in use"
```bash
# Lancer Django sur un autre port
python manage.py runserver 8001
# Mettre à jour REACT_APP_API_BASE_URL dans frontend/.env
```

### Erreur CORS lors de l'appel API
1. Vérifier que le backend est lancé (http://localhost:8000)
2. Vérifier CORS_ALLOWED_ORIGINS dans backend/config/settings.py
3. Redémarrer le backend

### Erreur "Database does not exist"
```bash
# Créer la base de données
python manage.py migrate

# Ou en PostgreSQL:
psql -U postgres
CREATE DATABASE mini_stackoverflow;
```

### Erreur: "ModuleNotFoundError"
```bash
# Vérifier que l'environnement virtuel est activé
# (Vous devriez voir (venv) au début du terminal)

# Réinstaller les dépendances
pip install -r requirements.txt
```

### React ne se compile pas
```bash
# Supprimer node_modules et réinstaller
rm -rf node_modules package-lock.json  # Mac/Linux
rmdir /s node_modules  # Windows
npm install
npm start
```

## 9. Workflow Quotidien

Chaque fois que vous voulez développer:

1. **Ouvrir VSCode**
2. **Terminal 1 - Backend**:
   ```bash
   cd backend
   source venv/bin/activate  # Mac/Linux: ou venv\Scripts\Activate.ps1 Windows
   python manage.py runserver
   ```

3. **Terminal 2 - Frontend**:
   ```bash
   cd frontend
   npm start
   ```

4. **Accéder à http://localhost:3000**

5. **Modifier le code** - Les changements se rechargent automatiquement (hot reload)

6. **Pour arrêter**: Ctrl+C dans chaque terminal

## 10. Déboguer avec VSCode

### Déboguer le Frontend (React)

1. Installer l'extension "Debugger for Chrome"
2. Dans VSCode, clicker sur "Run and Debug" (Ctrl+Shift+D)
3. Sélectionner "Chrome" et cliquer "Launch"

### Déboguer le Backend (Django)

1. Installer l'extension "Python"
2. Créer un fichier `.vscode/launch.json`:
```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Python: Django",
            "type": "python",
            "request": "launch",
            "program": "${workspaceFolder}/backend/manage.py",
            "args": ["runserver"],
            "django": true,
            "jinja": true,
            "justMyCode": true
        }
    ]
}
```

## Prochaines Étapes

Une fois le projet en local:
1. Modifier le code et voir les changements en temps réel
2. Tester les différentes features
3. Consulter la documentation DEPLOYMENT.md pour déployer gratuitement
4. Ajouter vos propres features personnalisées

Bon développement! 🚀
