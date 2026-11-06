# سراج

Site statique en arabe RTL, organisé en pages HTML, styles et scripts partagés.

## Pages

- `index.html` : accueil et outils (Coran, adhkār, qibla, calendrier et hadith).
- `quran.html` : lecture du texte complet d’une sourate et lecture audio de la sourate entière.
- `dashboard.html` : tableau de bord des habitudes quotidiennes.
- `tasbih.html` : compteur de dhikr avec sauvegarde locale.
- `assets/favicon.svg` : icône du site.
- `robots.txt` et `sitemap.xml` : exploration et déclaration des pages dans Google Search Console.

## Fichiers partagés

- `assets/css/site-nav.css` et `assets/js/site-nav.js` : navigation commune.
- `assets/css/cookie-consent.css` et `assets/js/cookie-consent.js` : choix et mémorisation du consentement; aucun outil d’analyse ou de publicité n’est activé.
- `assets/css/dashboard.css` et `assets/js/dashboard.js` : styles et interactions du tableau de bord.
- `assets/css/tasbih.css` et `assets/js/tasbih.js` : styles et interactions du compteur.

Ouvrir `index.html` dans un navigateur ou servir le dossier avec un serveur HTTP local. Les données de progression restent dans `localStorage`; les contenus dynamiques de la page principale dépendent des API externes.

La bibliothèque du Coran utilise l’API publique AlQuran Cloud et ses flux audio CDN, sans clé API. Choisir une sourate l’ouvre dans `quran.html`, qui affiche tous ses versets, permet d’écouter la sourate complète, ou de toucher une ayah pour écouter cette ayah et consulter son tafsir.

## Référencement et publication

L’URL canonique actuellement configurée est `https://siraj-islamic.vercel.app`. Après déploiement, ajouter cette propriété de domaine dans Google Search Console, puis envoyer `https://siraj-islamic.vercel.app/sitemap.xml`. L’indexation et l’apparence du résultat Google ne sont pas garanties et peuvent prendre du temps.

Si le domaine personnalisé `siraj-islamic.tn` est configuré et doit devenir le domaine principal, remplacer l’URL Vercel dans les balises canoniques/Open Graph, `robots.txt`, `sitemap.xml` et les données structurées avant de soumettre le sitemap.

La collection de douas/adhkār attribuée à « Ben Ibrahim » n’est pas incluse tant que le nom complet et les sources vérifiables ne sont pas fournis.
