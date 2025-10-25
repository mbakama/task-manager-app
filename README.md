# TaskFlow - Application de Gestion de Tâches Collaborative

Une application moderne de gestion de tâches avec interface drag & drop, développée avec React, Material-UI et préparée pour Firebase.

## 🚀 Fonctionnalités

### 📋 Gestion des Tâches
- **Tableau Kanban** avec 4 colonnes : À faire, En cours, En révision, Terminé
- **Drag & Drop** fluide pour déplacer les tâches entre les colonnes
- **CRUD complet** : Créer, lire, modifier, supprimer des tâches
- **Priorités** : Haute, Moyenne, Basse avec codes couleur

### 👥 Collaboration
- **Attribution des tâches** à différents membres de l'équipe
- **Suivi temporel** : Dates de création et modification
- **Interface utilisateur** intuitive et responsive

### 🎨 Interface Moderne
- **Material-UI** pour un design professionnel
- **Animations fluides** et transitions
- **Responsive design** adapté à tous les écrans
- **Thème cohérent** avec palette de couleurs moderne

## 🛠️ Technologies Utilisées

- **React 18** - Framework JavaScript moderne
- **Material-UI (MUI)** - Composants UI professionnels
- **React Beautiful DND** - Fonctionnalité drag & drop
- **Firebase** (préparé) - Base de données temps réel
- **LocalStorage** - Stockage temporaire en mode démo

## 📦 Installation

1. **Cloner le projet**
   ```bash
   cd task-manager-app
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Lancer l'application**
   ```bash
   npm start
   ```

4. **Ouvrir dans le navigateur**
   ```
   http://localhost:3000
   ```

## 🔧 Configuration Firebase (Production)

Pour activer la synchronisation en temps réel :

1. **Créer un projet Firebase**
   - Aller sur [Firebase Console](https://console.firebase.google.com/)
   - Créer un nouveau projet
   - Activer Firestore Database

2. **Configurer les clés**
   ```javascript
   // Dans src/services/taskService.js
   const firebaseConfig = {
     apiKey: "votre-api-key",
     authDomain: "votre-projet.firebaseapp.com",
     projectId: "votre-projet-id",
     // ... autres clés
   };
   ```

3. **Installer Firebase**
   ```bash
   npm install firebase
   ```

## 📱 Utilisation

### Créer une Tâche
1. Cliquer sur le bouton **+** (FAB) en bas à droite
2. Remplir le formulaire :
   - Titre (obligatoire)
   - Description
   - Priorité
   - Assigné à
3. Cliquer sur **Créer**

### Gérer les Tâches
- **Déplacer** : Glisser-déposer entre les colonnes
- **Modifier** : Menu 3 points → Modifier
- **Supprimer** : Menu 3 points → Supprimer

### Navigation
- **Tableau de bord** : Vue d'ensemble des tâches
- **Statistiques** : Compteurs par colonne
- **Profil utilisateur** : Informations dans la barre supérieure

## 🎯 Fonctionnalités Avancées

### Drag & Drop
- **Glisser-déposer** intuitif entre colonnes
- **Animations** visuelles pendant le déplacement
- **Feedback visuel** avec rotation et ombre

### Interface Responsive
- **Mobile-first** design
- **Adaptation automatique** aux différentes tailles d'écran
- **Navigation tactile** optimisée

### Gestion d'État
- **État local React** pour les interactions
- **Persistance** avec localStorage (mode démo)
- **Synchronisation** préparée pour Firebase

## 📊 Structure du Projet

```
task-manager-app/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── TaskBoard.js      # Tableau Kanban
│   │   └── TaskCard.js       # Carte de tâche
│   ├── services/
│   │   └── taskService.js    # Service de données
│   ├── App.js               # Composant principal
│   └── index.js             # Point d'entrée
├── package.json
└── README.md
```

## 🎨 Personnalisation

### Thème Material-UI
```javascript
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
});
```

### Colonnes Kanban
```javascript
const columns = {
  todo: { id: 'todo', title: 'À faire', color: '#1976d2' },
  inProgress: { id: 'inProgress', title: 'En cours', color: '#ed6c02' },
  // ...
};
```

## 🚀 Déploiement

### Build de Production
```bash
npm run build
```

### Déploiement Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 📈 Améliorations Futures

- [ ] **Authentification** utilisateur avec Firebase Auth
- [ ] **Notifications** en temps réel
- [ ] **Commentaires** sur les tâches
- [ ] **Pièces jointes** et fichiers
- [ ] **Filtres** et recherche avancée
- [ ] **Rapports** et analytics
- [ ] **Mode hors ligne** avec synchronisation
- [ ] **API REST** pour intégrations externes

## 👨‍💻 Auteur

**Hector Mbakama** - Développeur Full Stack
- Portfolio : [Votre site web]
- LinkedIn : [Votre profil]
- GitHub : [Votre profil]

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier LICENSE pour plus de détails.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche feature
3. Commit vos changements
4. Push vers la branche
5. Ouvrir une Pull Request