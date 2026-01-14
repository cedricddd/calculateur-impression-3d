# 🔧 Guide de Dépannage - Portainer/Docker

## 🚨 Problèmes identifiés

### 1. Mode Sombre ne fonctionne pas
### 2. Import STL ne fonctionne pas

---

## 🔍 Diagnostic Rapide

### Étape 1 : Accéder à la page de diagnostic

```
http://VOTRE-IP:3080/test-diagnostic.html
```

Cette page va tester :
- ✅ LocalStorage
- ✅ Mode sombre
- ✅ Upload STL
- ✅ Chargement des scripts

---

## 🛠️ Solutions

### Solution 1 : Vider le cache du navigateur

**Le problème le plus courant !**

1. **Chrome/Edge** :
   - `Ctrl + Shift + Del`
   - Cocher "Images et fichiers en cache"
   - Cliquer sur "Effacer les données"

2. **Firefox** :
   - `Ctrl + Shift + Del`
   - Cocher "Cache"
   - Cliquer sur "Effacer maintenant"

3. **Safari** :
   - `Cmd + Option + E`

4. **Ou en mode navigation privée** :
   - `Ctrl + Shift + N` (Chrome)
   - `Ctrl + Shift + P` (Firefox)

### Solution 2 : Vérifier les logs du conteneur

**Dans Portainer :**

1. **Containers** → `calculateur-impression-3d`
2. **Logs** → Vérifier s'il y a des erreurs
3. Chercher des lignes comme :
   ```
   Error: Cannot find module...
   404 Not Found
   Failed to load resource
   ```

### Solution 3 : Vérifier la console du navigateur

1. Ouvrir la page : `http://VOTRE-IP:3080`
2. Appuyer sur **F12**
3. Aller dans l'onglet **Console**
4. Chercher des erreurs en rouge

**Erreurs communes :**
```
Failed to load resource: net::ERR_CONNECTION_REFUSED
Uncaught ReferenceError: toggleTheme is not defined
Cannot read property 'setAttribute' of null
```

### Solution 4 : Forcer le rechargement

1. **Ouvrir la page**
2. **Ctrl + F5** (Windows) ou **Cmd + Shift + R** (Mac)
3. Cela force le rechargement de tous les fichiers

### Solution 5 : Vérifier que les fichiers sont bien dans le conteneur

**Via Portainer Console :**

1. **Containers** → `calculateur-impression-3d`
2. **Console** → Cliquer sur "Connect"
3. Exécuter :

```bash
# Vérifier la structure des fichiers
ls -la /usr/share/nginx/html/

# Doit afficher :
# index.html
# js/calculator.js
# nginx.conf
# etc.

# Vérifier le contenu du fichier JavaScript
head -n 50 /usr/share/nginx/html/js/calculator.js

# Vérifier que nginx tourne
ps aux | grep nginx
```

### Solution 6 : Rebuild le conteneur

**Si les fichiers sont corrects localement mais pas dans le conteneur :**

1. **Dans Portainer** :
   - Stacks → `calculateur-3d`
   - **Remove** (supprimer la stack)

2. **Sur GitHub** :
   - Vérifier que TOUS les fichiers modifiés sont bien pushés
   - `index.html` (avec le script inline d'initialisation)
   - `js/calculator.js` (avec les fonctions corrigées)
   - `test-diagnostic.html` (nouveau)

3. **Redéployer** :
   - Stacks → Add stack
   - Repository → URL de votre repo
   - Deploy

### Solution 7 : Vérifier les permissions

**Dans le conteneur :**

```bash
# Vérifier les permissions
ls -la /usr/share/nginx/html/js/

# Les fichiers doivent être lisibles (r--)
# Si ce n'est pas le cas :
chmod -R 755 /usr/share/nginx/html/
```

### Solution 8 : Tester l'accès direct aux fichiers

Ouvrir dans le navigateur :

```
http://VOTRE-IP:3080/js/calculator.js
```

**Résultats possibles :**
- ✅ **Le fichier s'affiche** : Les fichiers sont accessibles
- ❌ **404 Not Found** : Le fichier n'est pas dans le conteneur
- ❌ **403 Forbidden** : Problème de permissions

---

## 🔧 Checklist Complète

### Avant de redéployer

- [ ] Les fichiers modifiés sont bien sur GitHub
- [ ] `index.html` contient le script inline d'initialisation
- [ ] `js/calculator.js` contient les fonctions corrigées
- [ ] `test-diagnostic.html` est présent
- [ ] Le cache du navigateur est vidé

### Après redéploiement

- [ ] Le conteneur démarre bien (status: Running)
- [ ] Accès à `http://IP:3080` fonctionne
- [ ] Accès à `http://IP:3080/js/calculator.js` affiche le fichier
- [ ] La console du navigateur (F12) n'affiche pas d'erreurs
- [ ] Le bouton "Mode Sombre" est visible
- [ ] Clic sur "Mode Sombre" change l'apparence
- [ ] La page de diagnostic fonctionne

---

## 💡 Explications Techniques

### Pourquoi ça marche en local mais pas dans Docker ?

1. **Cache du navigateur** : Le navigateur a mis en cache les anciennes versions
2. **Fichiers non mis à jour** : Le build Docker utilise d'anciennes versions
3. **Chemins différents** : Les chemins relatifs peuvent différer
4. **Permissions** : Les fichiers dans le conteneur n'ont peut-être pas les bonnes permissions

### Pourquoi le mode sombre ne fonctionne pas ?

1. **JavaScript non chargé** : Le fichier `calculator.js` n'est pas chargé ou a des erreurs
2. **LocalStorage bloqué** : Certains paramètres de sécurité bloquent LocalStorage
3. **Événements non attachés** : Le DOM n'est pas prêt quand les événements sont attachés

### Pourquoi l'import STL ne fonctionne pas ?

1. **FileReader API** : Peut être bloqué par des politiques de sécurité
2. **JavaScript errors** : Une erreur précédente empêche l'exécution
3. **Event handlers** : Les gestionnaires d'événements ne sont pas attachés

---

## 🎯 Solution Définitive

### Procédure Complète

1. **Sur votre machine locale** :
   ```bash
   # Assurez-vous que tous les fichiers modifiés sont commités
   git status
   git add .
   git commit -m "Fix: Mode sombre et import STL pour Docker"
   git push
   ```

2. **Dans Portainer** :
   - Stacks → Supprimer `calculateur-3d`
   - Stacks → Add stack
   - Repository URL: `https://github.com/VOTRE-USERNAME/calculateur-impression-3d`
   - Reference: `refs/heads/main`
   - Deploy

3. **Dans votre navigateur** :
   - Vider le cache (**important !**)
   - Mode navigation privée (pour tester)
   - Accéder à `http://IP:3080`

4. **Tester** :
   - Cliquer sur "Mode Sombre"
   - Uploader un fichier STL
   - Vérifier la console (F12) pour les erreurs

---

## 📞 Si ça ne fonctionne toujours pas

### Informations à fournir

1. **Logs du conteneur** :
   - Portainer → Containers → calculateur-impression-3d → Logs
   - Copier les dernières lignes

2. **Console du navigateur** :
   - F12 → Console
   - Copier les erreurs en rouge

3. **Test de diagnostic** :
   - Accéder à `http://IP:3080/test-diagnostic.html`
   - Tester chaque fonction
   - Noter les résultats

4. **Vérifier l'accès aux fichiers** :
   - `http://IP:3080/js/calculator.js` → S'affiche ?
   - `http://IP:3080/index.html` → S'affiche ?

---

## ✅ Vérification Finale

Le calculateur fonctionne correctement si :

- ✅ Le bouton "Mode Sombre" est visible en haut à droite
- ✅ Cliquer dessus change l'apparence de la page
- ✅ Le thème est conservé après rafraîchissement
- ✅ La zone d'upload STL est visible
- ✅ Glisser-déposer un fichier STL affiche les informations
- ✅ Aucune erreur dans la console (F12)

---

## 🔄 Workflow Recommandé

### Pour chaque modification future

1. **Modifier** les fichiers localement
2. **Tester** en local (`index.html` dans le navigateur)
3. **Commit et push** vers GitHub
4. **Dans Portainer** : Pull and redeploy
5. **Vider le cache** du navigateur
6. **Tester** sur le conteneur

---

**Note** : Le cache du navigateur est souvent la cause principale des problèmes. Toujours tester en navigation privée après un déploiement !