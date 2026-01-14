# 🚀 Déploiement Rapide - Version 3.0.1

## ⚡ Actions Immédiates (2 minutes)

### 1️⃣ Pousser sur GitHub
```bash
git add .
git commit -m "Fix: Mode sombre et import STL pour Docker (v3.0.1)"
git push origin main
```

### 2️⃣ Redéployer dans Portainer
1. **Portainer** → **Stacks** → `calculateur-impression-3d`
2. Cliquez sur **🔄 Pull and redeploy**
3. Attendez 30 secondes

### 3️⃣ Vider le Cache du Navigateur
**Windows/Linux :** `Ctrl + Shift + R`  
**Mac :** `Cmd + Shift + R`

**OU Navigation privée :**  
`Ctrl + Shift + N` (Windows) / `Cmd + Shift + N` (Mac)

---

## ✅ Vérifications

| Test | URL | Résultat Attendu |
|------|-----|-----------------|
| **Page principale** | `http://IP:3080` | Interface s'affiche |
| **Mode Sombre** | Clic sur bouton en haut à droite | Page devient sombre immédiatement |
| **Import STL** | Glisser un fichier `.stl` | Poids auto-rempli |
| **Console** | F12 → Console | Aucune erreur rouge |
| **Diagnostic** | `http://IP:3080/test-diagnostic.html` | Tous les tests verts |

---

## 🐛 Si Problème Persiste

### Option A : Forcer le Rechargement
```bash
# Dans Portainer
Stacks → calculateur-impression-3d → Delete
Stacks → Add stack → From GitHub → Deploy
```

### Option B : Vérifier la Version
```bash
ssh root@IP_SERVEUR
docker ps --filter "name=calculateur" --format "{{.Label \"com.example.version\"}}"
# Devrait afficher : 3.0.1
```

### Option C : Logs du Conteneur
```bash
docker logs calculateur-impression-3d
```

---

## 📋 Ce Qui a Changé

✅ **index.html** : Script inline avec fonctions critiques  
✅ **docker-compose.yml** : Version 3.0.1  
✅ **CORRECTIF-DOCKER.md** : Documentation complète  

---

## 🎯 Résultat Final

- ✅ Mode Sombre fonctionne en Docker
- ✅ Import STL fonctionne en Docker  
- ✅ Aucune erreur JavaScript
- ✅ Comportement identique à la version locale

**🔗 Accès :** `http://IP-SERVEUR:3080`

---

**Besoin d'aide ?** Consultez [CORRECTIF-DOCKER.md](CORRECTIF-DOCKER.md) pour plus de détails.
