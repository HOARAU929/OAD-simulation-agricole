# OAD Frontend

Frontend React pour l'Outil d'Aide à la Décision de Simulation Agricole

## Installation

```bash
cd frontend
npm install
npm run dev
```

L'application sera disponible sur http://localhost:5173

## Structure

```
src/
├── components/      # Composants réutilisables
├── pages/          # Pages principales
├── stores/         # Zustand stores (state management)
├── api.js          # Configuration axios
└── App.jsx         # Composant principal
```

## Features

- 📊 Tableau de bord avec statistiques
- 🌾 Gestion des cultures
- 🧪 Simulation de scénarios
- 📈 Visualisation des résultats
- 💾 Historique des simulations

## API

Pointe vers http://localhost:8000/api/v1
