# OAD Simulation Agricole

**Outil d'Aide à la Décision pour simuler les scénarios de baisse de rendement agricole**

## 🎯 Objectif

Transformer un outil Excel en application web ergonomique pour simuler différents scénarios de production agricole (baisse de rendement, attaques d'insectes, variation de prix) et analyser leurs impacts sur la marge nette.

## ✨ Fonctionnalités

- ✅ Simulation de scénarios personnalisés
- ✅ Variables d'entrée : rendement, bioagresseurs, prix de vente
- ✅ Calcul automatique des marges (brute & nette)
- ✅ Calcul du coût de production au 100kg
- ✅ Export des résultats (CSV, JSON)
- ✅ Historique des simulations
- ✅ Comparaison de scénarios

## 🏗️ Architecture

```
OAD-simulation-agricole/
├── backend/           # FastAPI
│   ├── app/
│   │   ├── main.py
│   │   ├── core/
│   │   ├── api/
│   │   ├── engine/
│   │   ├── models/
│   │   ├── schemas/
│   │   └── services/
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/          # À faire (React/Vue)
├── docker-compose.yml
└── README.md
```

## 🚀 Démarrage rapide

### Avec Docker

```bash
docker-compose up -d
```

### Sans Docker

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API disponible sur : http://localhost:8000  
Docs interactive : http://localhost:8000/docs

## 📊 Variables de simulation

### Entrées
- **Rendement** (t/ha) : variation en %
- **Bioagresseurs** (%) : impact en %
- **Prix de vente** (€/kg) : variation en %

### Charges
- **Charges opérationnelles** : Fertilisants, intrants, main-d'œuvre...
- **Charges de structure** : Mécanisation, bâtiment, assurances...
- **Charges supplétives** : Fermage, rémunération chef, capital...

### Sorties
- Produits bruts
- Marge brute
- Marge nette
- Coût de production /100kg
- Impact du scénario

## 📚 API Endpoints

### Health
- `GET /api/v1/health` - Vérifier l'état de l'API

### Cultures
- `POST /api/v1/cultures/` - Créer une culture
- `GET /api/v1/cultures/` - Lister toutes les cultures
- `GET /api/v1/cultures/{id}` - Récupérer une culture
- `PUT /api/v1/cultures/{id}` - Modifier une culture
- `DELETE /api/v1/cultures/{id}` - Supprimer une culture

### Simulations
- `POST /api/v1/simulations/run/{culture_id}` - Lancer une simulation (sans sauvegarder)
- `POST /api/v1/simulations/` - Créer et sauvegarder une simulation
- `GET /api/v1/simulations/` - Lister les simulations
- `GET /api/v1/simulations/{id}` - Récupérer une simulation
- `PUT /api/v1/simulations/{id}` - Modifier une simulation
- `DELETE /api/v1/simulations/{id}` - Supprimer une simulation

## 📝 Exemple d'utilisation

### 1. Créer une culture (Ananas)

```bash
curl -X POST "http://localhost:8000/api/v1/cultures/" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ananas Queen Victoria",
    "description": "Cycle bas, zone Est",
    "fertilizer_cost": 3050,
    "bioagressor_intrants_cost": 56,
    "other_intrants_cost": 3227,
    "labor_cost": 10036,
    "mechanization_cost": 5636,
    "building_cost": 0,
    "insurance_cost": 4000,
    "miscellaneous_cost": 11000,
    "fermage_cost": 4378,
    "capital_cost": 110,
    "default_yield": 30.0,
    "default_price": 1.30
  }'
```

### 2. Lancer une simulation rapide

```bash
curl -X POST "http://localhost:8000/api/v1/simulations/run/1" \
  -H "Content-Type: application/json" \
  -d '{
    "yield_variation": -30,
    "bioagressor_impact": 15,
    "price_variation": -20,
    "scenario_name": "Sécheresse + Ravageurs"
  }'
```

### 3. Sauvegarder une simulation

```bash
curl -X POST "http://localhost:8000/api/v1/simulations/" \
  -H "Content-Type: application/json" \
  -d '{
    "culture_id": 1,
    "name": "Sim_Ananas_Scenario1",
    "yield_variation": -30,
    "bioagressor_impact": 15,
    "price_variation": -20,
    "scenario_name": "Sécheresse + Ravageurs"
  }'
```

## 🛠️ Structure des résultats

```json
{
  "yield_value": 18.5,
  "price_value": 1.04,
  "bioagressor_impact": 15.0,
  "total_operational_charges": 16369.4,
  "total_structure_charges": 14630.5,
  "total_suppletive_charges": 4488.33,
  "gross_products": 24180,
  "gross_margin": 7810.6,
  "net_margin": -6819.9,
  "cost_per_100kg": 121.08,
  "cost_per_kg": 1.21,
  "impact_on_gross_products": -38.08,
  "impact_on_margin": -185.27
}
```

## 📖 Documentation

La documentation interactive est disponible sur `/docs` (Swagger UI)

## 👤 Auteur

HOARAU929

## 📄 Licence

MIT
