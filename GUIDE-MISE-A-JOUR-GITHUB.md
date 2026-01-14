# 📤 Guide : Mise à jour sur GitHub

## 🎯 Méthode 1 : Via l'interface GitHub (Le plus simple - 5 minutes)

### Étape 1 : Aller sur votre repository

1. **Ouvrir** votre navigateur
2. **Aller sur** : `https://github.com/VOTRE-USERNAME/calculateur-impression-3d`
3. **Se connecter** si nécessaire

---

### Étape 2 : Créer le dossier images

1. **Cliquer** sur `Add file` → `Create new file`
2. **Dans le nom du fichier**, taper : `images/README.md`
   - Le `/` créera automatiquement le dossier `images`
3. **Dans le contenu**, taper simplement : `# Images`
4. **Cliquer** sur `Commit changes`
5. Dans la popup, cliquer sur `Commit changes` (vert)

---

### Étape 3 : Uploader votre logo

1. **Aller** dans le dossier `images` que vous venez de créer
2. **Cliquer** sur `Add file` → `Upload files`
3. **Glisser-déposer** ou sélectionner le fichier : `logo-ced-it.png`
   - 📥 [Télécharger le logo ici](https://www.genspark.ai/api/files/s/7Wj2EjP2)
4. **Cliquer** sur `Commit changes`

---

### Étape 4 : Mettre à jour index.html

1. **Retourner** à la racine du repository
2. **Cliquer** sur le fichier `index.html`
3. **Cliquer** sur l'icône **crayon** (Edit this file) en haut à droite
4. **Trouver** la ligne `<div class="text-center mb-8 mt-4">` (ligne ~61)
5. **Remplacer** le bloc suivant :

**AVANT :**
```html
        <!-- Header -->
        <div class="text-center mb-8 mt-4">
            <h1 class="text-5xl font-bold text-white mb-3">
                <i class="fas fa-cube mr-3"></i>Calculateur d'Impression 3D
            </h1>
            <p class="text-white text-lg opacity-90">Calculez précisément le coût de vos impressions 3D</p>
        </div>
```

**APRÈS :**
```html
        <!-- Header -->
        <div class="text-center mb-8 mt-4">
            <!-- Logo Ced-IT -->
            <div class="mb-6 flex justify-center">
                <img src="images/logo-ced-it.png" alt="Ced-IT Logo" class="h-24 w-auto drop-shadow-lg">
            </div>
            
            <h1 class="text-5xl font-bold text-white mb-3">
                <i class="fas fa-cube mr-3"></i>Calculateur d'Impression 3D
            </h1>
            <p class="text-white text-lg opacity-90">Calculez précisément le coût de vos impressions 3D</p>
        </div>
```

6. **Scroll** vers le bas et **trouver** le footer (ligne ~345) :

**AVANT :**
```html
        <!-- Footer -->
        <div class="text-center mt-8 mb-4 text-white">
            <p class="opacity-75">Calculateur d'impression 3D - Tous les coûts sont estimatifs</p>
        </div>
```

**APRÈS :**
```html
        <!-- Footer -->
        <div class="text-center mt-8 mb-4 text-white">
            <div class="flex items-center justify-center mb-2 opacity-90">
                <img src="images/logo-ced-it.png" alt="Ced-IT" class="h-8 w-auto mr-3">
                <span class="text-sm">Powered by Ced-IT</span>
            </div>
            <p class="opacity-75 text-sm">Calculateur d'impression 3D - Tous les coûts sont estimatifs</p>
        </div>
```

7. **Cliquer** sur `Commit changes` (bouton vert en haut à droite)
8. **Confirmer** en cliquant sur `Commit changes` dans la popup

---

### Étape 5 : Mettre à jour le Dockerfile

1. **Cliquer** sur le fichier `Dockerfile`
2. **Cliquer** sur l'icône **crayon** (Edit)
3. **Trouver** la ligne :
   ```dockerfile
   COPY index.html /usr/share/nginx/html/
   COPY js/ /usr/share/nginx/html/js/
   COPY README.md /usr/share/nginx/html/
   ```

4. **Ajouter** la ligne pour les images :
   ```dockerfile
   COPY index.html /usr/share/nginx/html/
   COPY js/ /usr/share/nginx/html/js/
   COPY images/ /usr/share/nginx/html/images/
   COPY README.md /usr/share/nginx/html/
   ```

5. **Commit changes**

---

### Étape 6 : Redéployer dans Portainer

1. **Ouvrir Portainer** : `http://IP-PROXMOX:9000`
2. **Menu gauche** → `Stacks`
3. **Cliquer** sur votre stack `calculateur-3d`
4. **Cliquer** sur le bouton `Pull and redeploy` 🔄
5. **Attendre** quelques secondes...
6. **C'est fait !** ✅

---

## 🎯 Méthode 2 : Via Git en ligne de commande (Pour utilisateurs avancés)

### Prérequis
- Git installé sur votre ordinateur
- Repository cloné localement

### Commandes

```bash
# 1. Se placer dans le dossier du projet
cd chemin/vers/calculateur-impression-3d

# 2. Créer le dossier images (si pas encore fait)
mkdir images

# 3. Copier votre logo dans le dossier images
# (Télécharger d'abord : https://www.genspark.ai/api/files/s/7Wj2EjP2)
cp /chemin/vers/logo-ced-it.png images/

# 4. Vérifier les fichiers modifiés
git status

# 5. Ajouter tous les changements
git add .

# 6. Créer un commit avec un message
git commit -m "feat: Ajout du logo Ced-IT dans le header et footer"

# 7. Pousser les modifications sur GitHub
git push origin main
```

### Puis dans Portainer
- Stacks → calculateur-3d → **Pull and redeploy**

---

## 🎯 Méthode 3 : Upload multiple sur GitHub (Rapide)

### Si vous avez tous les fichiers mis à jour localement

1. **Aller** sur votre repo GitHub
2. **Cliquer** sur `Add file` → `Upload files`
3. **Sélectionner** tous les fichiers modifiés :
   - `index.html` (modifié)
   - `Dockerfile` (modifié)
   - `images/logo-ced-it.png` (nouveau)
4. **Commit changes**
5. **Portainer** → Pull and redeploy

---

## 📋 Checklist de mise à jour

- [ ] Dossier `images/` créé sur GitHub
- [ ] Logo `logo-ced-it.png` uploadé dans `images/`
- [ ] `index.html` modifié (header + footer)
- [ ] `Dockerfile` modifié (ligne COPY images/)
- [ ] Commit fait sur GitHub
- [ ] Portainer → Pull and redeploy
- [ ] Tester l'accès : `http://IP-SERVEUR:3080`
- [ ] Vérifier que le logo apparaît en haut et en bas

---

## 🎨 Résultat attendu

### En haut de la page :
```
[LOGO CED-IT]
🧊 Calculateur d'Impression 3D
Calculez précisément le coût de vos impressions 3D
```

### En bas de la page :
```
[LOGO CED-IT] Powered by Ced-IT
Calculateur d'impression 3D - Tous les coûts sont estimatifs
```

---

## 🐛 Problèmes courants

### Le logo ne s'affiche pas

**Vérifier que :**
1. Le fichier `images/logo-ced-it.png` existe bien sur GitHub
2. Le chemin dans `index.html` est correct : `images/logo-ced-it.png`
3. Le Dockerfile copie bien le dossier images
4. Vous avez fait "Pull and redeploy" dans Portainer

**Solution :**
```bash
# Vider le cache du navigateur
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)

# Ou forcer le rebuild dans Portainer
Stacks → calculateur-3d → Editor → Update the stack
```

### Erreur lors du build Docker

**Vérifier la structure :**
```
calculateur-impression-3d/
├── index.html
├── Dockerfile
├── docker-compose.yml
├── images/
│   └── logo-ced-it.png
└── js/
    └── calculator.js
```

---

## 💡 Astuces

### Voir les changements avant de committer

**Sur GitHub, dans l'éditeur :**
- Onglet **Preview** pour voir le résultat

### Annuler une modification

**Si vous vous êtes trompé :**
1. GitHub → Fichier → History
2. Voir les versions précédentes
3. Copier l'ancien contenu
4. Edit → Coller → Commit

### Télécharger tout le projet depuis GitHub

```bash
git clone https://github.com/VOTRE-USERNAME/calculateur-impression-3d.git
```

---

## 📊 Workflow complet de mise à jour

```
1. Modifier les fichiers localement
   ↓
2. Tester localement (optionnel)
   ↓
3. Uploader sur GitHub
   ↓
4. Commit changes
   ↓
5. Portainer → Pull and redeploy
   ↓
6. Tester en ligne
   ↓
7. ✅ Terminé !
```

---

## 🎯 Prochaines fois : Mise à jour simplifiée

**Une fois que tout est en place :**

Pour toute modification future :
1. Modifier le fichier sur GitHub (icône crayon)
2. Commit changes
3. Portainer → Pull and redeploy
4. C'est tout ! 🎉

---

## 📞 Besoin d'aide ?

**Fichiers de référence :**
- `index.html` - Version avec logo (dans le projet)
- `Dockerfile` - Version avec images/ (dans le projet)
- `QUICK-START.md` - Guide de démarrage
- `DEPLOIEMENT-PORTAINER.md` - Guide complet

---

**🎨 Votre logo Ced-IT sera maintenant visible sur l'application !**

**Fichiers modifiés :**
- ✅ `images/logo-ced-it.png` - Ajouté
- ✅ `index.html` - Logo dans header et footer
- ✅ `Dockerfile` - Copie du dossier images

**Prochaine étape :** Uploader sur GitHub et redéployer ! 🚀