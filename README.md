# سراج

Site statique en arabe RTL, organisé en pages HTML, styles et scripts partagés.

## Pages

- `index.html` : accueil et outils (Coran, adhkār, qibla, calendrier et hadith).
- `dashboard.html` : tableau de bord des habitudes quotidiennes.
- `tasbih.html` : compteur de dhikr avec sauvegarde locale.

## Fichiers partagés

- `assets/css/site-nav.css` et `assets/js/site-nav.js` : navigation commune.
- `assets/css/dashboard.css` et `assets/js/dashboard.js` : styles et interactions du tableau de bord.
- `assets/css/tasbih.css` et `assets/js/tasbih.js` : styles et interactions du compteur.

Ouvrir `index.html` dans un navigateur ou servir le dossier avec un serveur HTTP local. Les données de progression restent dans `localStorage`; les contenus dynamiques de la page principale dépendent des API externes.
