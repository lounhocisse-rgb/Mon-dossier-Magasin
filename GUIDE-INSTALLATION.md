# 📱 Guide : Mettre « Mon Magasin » sur ton iPhone

Ton app est un projet web complet, prêt à être déployé. Voici 3 méthodes,
de la plus simple à la plus technique. **Commence par la Méthode 1.**

---

## ✅ MÉTHODE 1 — StackBlitz (la plus simple, tout dans le navigateur, ~10 min)

Aucune installation. Tout se fait en ligne.

1. Va sur **https://stackblitz.com** (depuis un ordinateur, c'est plus facile)
2. Clique sur **« Sign in »** en haut à droite et connecte-toi avec Google ou GitHub (gratuit)
3. Clique sur le bouton **« Create »** puis choisis **« Vite »** → **« React »**
4. Un projet exemple s'ouvre. Maintenant on remplace les fichiers par les tiens :
   - Supprime le fichier `src/App.jsx` existant et glisse-dépose le mien à la place
   - Fais pareil pour `src/main.jsx`, `index.html`, `package.json`, `vite.config.js`,
     `tailwind.config.js`, `postcss.config.js`, et `src/index.css`
   - (Astuce : tu peux glisser-déposer tout le dossier `mon-magasin` directement
     dans la zone de fichiers à gauche)
5. StackBlitz installe tout et lance l'aperçu automatiquement à droite 🎉
6. Pour avoir un lien public : clique sur **« Connect Repository »** ou utilise
   le bouton de partage **« Share »** → tu obtiens une URL
7. Ouvre cette URL dans **Safari sur ton iPhone**

---

## ✅ MÉTHODE 2 — Vercel (lien permanent et pro, ~15 min)

Idéale pour ta présentation : lien stable et professionnel.

1. Crée un compte gratuit sur **https://vercel.com** (connecte-toi avec GitHub)
2. Tu auras besoin de mettre le dossier `mon-magasin` sur **GitHub** d'abord :
   - Crée un compte sur https://github.com
   - Crée un nouveau « repository » (dépôt)
   - Téléverse tous les fichiers du dossier `mon-magasin`
3. Sur Vercel, clique **« Add New… » → « Project »**
4. Sélectionne ton dépôt GitHub → Vercel détecte Vite automatiquement
5. Clique **« Deploy »** → en 1 minute, tu obtiens un lien comme
   `mon-magasin.vercel.app`
6. Ouvre ce lien dans **Safari sur ton iPhone**

---

## 📲 AJOUTER L'APP À TON ÉCRAN D'ACCUEIL (iPhone)

Une fois l'app ouverte dans **Safari** :

1. Touche le bouton **Partager** (le carré avec une flèche vers le haut, en bas)
2. Fais défiler et touche **« Sur l'écran d'accueil »**
3. Donne-lui le nom « Mon Magasin » et touche **« Ajouter »**
4. 🎉 L'icône apparaît sur ton écran d'accueil comme une vraie app, en plein écran!

**Bonus :** une fois déployée sur le web (pas dans l'aperçu), **les vraies photos
des produits s'affichent** — le blocage qu'on avait n'existe plus.

---

## 💻 MÉTHODE 3 — Sur ton ordinateur (pour tester localement)

Si tu as Node.js installé (https://nodejs.org) :

```bash
cd mon-magasin
npm install
npm run dev
```

Puis ouvre l'adresse affichée (ex. http://localhost:5173) dans ton navigateur.
Pour créer la version finale : `npm run build` (le résultat va dans le dossier `dist/`).

---

## ❓ Besoin d'aide?

Si tu bloques à une étape, dis-moi exactement où tu es rendu et je te guide.
La Méthode 1 (StackBlitz) est vraiment la plus simple pour commencer.
