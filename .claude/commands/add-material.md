---
name: add-material
description: Ajouter un nouveau matériau ou profil de prix au calculateur d'impression 3D. Modifie calculator.js avec le bon pattern.
---

# Add Material — Ajouter un Matériau

Ajouter un matériau ou modifier les tarifs dans le calculateur.

## Étape 1 — Lire calculator.js

```bash
# Localiser la structure des matériaux
grep -n "material\|matériau\|price\|prix" public/js/calculator.js | head -30
```

Comprendre le schéma actuel avant de modifier.

## Étape 2 — Ajouter le matériau

Le pattern attendu (à adapter selon la structure existante) :
```javascript
{
  name: "Nom du matériau",
  density: 1.24,        // g/cm³
  pricePerKg: 29.99,    // EUR/kg
  supports: true,       // nécessite des supports ?
  notes: "Description courte"
}
```

## Étape 3 — Tester

```bash
node server.js  # Port 3080
# Ouvrir http://localhost:3080
# Sélectionner le nouveau matériau
# Vérifier le calcul de prix
```

## Règles

- Tester avec plusieurs volumes (1cm³, 100cm³, 1000cm³)
- Vérifier que le calcul de poids est cohérent : `volume × density = poids`
- Documenter les sources des prix si prix marché

$ARGUMENTS
