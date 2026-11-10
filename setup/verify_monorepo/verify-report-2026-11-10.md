# CODE QUALITY REPORT

**Heure du test :** 10/11/2026 23:31:57

<div class="summary"><div class="summary-left"><div class="summary-item pass"style="color:white!important"> Réussis : 51</div><div class="summary-item fail"style="color:white!important"> Échoués : 0</div><div class="summary-item ignored"style="color:white!important"> Ignorés : 6</div><div class="summary-item generated"style="color:white!important"> Générés : 1</div></div><div class="summary-divider"></div><div class="summary-rate" style="color:white!important">📊 Taux : 100%</div></div>

## ℹ  INFORMATION DU PROJET

| Test | Statut |
|------|--------|
| Nom du projet : egppneumatique | <span class="ok"><span class="dot dot-ok"></span> OK</span> |
| Version : 1.0.0 | <span class="ok"><span class="dot dot-ok"></span> OK</span> |
| Node.js | <span class="ok"><span class="dot dot-ok"></span> OK</span> |
| npm | <span class="ok"><span class="dot dot-ok"></span> OK</span> |
| Biome | <span class="ok"><span class="dot dot-ok"></span> OK</span> |

## 🐳  VÉRIFICATION DOCKER

| Test | Statut |
|------|--------|
| Docker installé | <span class="ok"><span class="dot dot-ok"></span> OK</span> |
| Docker Compose | <span class="ok"><span class="dot dot-ok"></span> OK</span> |
| PostgreSQL en cours d'exécution | <span class="ok"><span class="dot dot-ok"></span> OK</span> |

## 🗄  VÉRIFICATION BASE DE DONNÉES

| Test | Statut |
|------|--------|
| Connexion à PostgreSQL | <span class="ok"><span class="dot dot-ok"></span> OK</span> |
| Table 'users' existe | <span class="ok"><span class="dot dot-ok"></span> OK</span> |

## ⚙  VÉRIFICATION SERVER

| Test | Statut |
|------|--------|
| server/.env | <span class="ok"><span class="dot dot-ok"></span> OK</span> |
| server/src/index.ts | <span class="ok"><span class="dot dot-ok"></span> OK</span> |
| Package 'express' installé | <span class="ok"><span class="dot dot-ok"></span> OK</span> |
| Package 'pg' installé | <span class="ok"><span class="dot dot-ok"></span> OK</span> |

## 🎨  VÉRIFICATION FRONTEND (Web)

| Test | Statut |
|------|--------|
| Dossier web/ | <span class="ok"><span class="dot dot-ok"></span> OK</span> |
| Fichiers TypeScript/TSX | <span class="ok"><span class="dot dot-ok"></span> OK</span> |
| package.json | <span class="ok"><span class="dot dot-ok"></span> OK</span> |

## 🎨  VÉRIFICATION FRONTEND (Mobile)

| Test | Statut |
|------|--------|
| Dossier mobile/ | <span class="ok"><span class="dot dot-ok"></span> OK</span> |
| package.json | <span class="ok"><span class="dot dot-ok"></span> OK</span> |

## ⚙  VÉRIFICATION CONFIGURATION

| Test | Statut |
|------|--------|
| docker-compose.yml | <span class="ok"><span class="dot dot-ok"></span> OK</span> |
| .gitignore | <span class="ok"><span class="dot dot-ok"></span> OK</span> |

## 📁  VÉRIFICATION MONOREPO

| Test | Statut |
|------|--------|
| 7 package.json détectés | <span class="ok"><span class="dot dot-ok"></span> OK</span> |

## 🔌  VÉRIFICATION API

| Test | Statut |
|------|--------|
| Backend accessible | <span class="ok"><span class="dot dot-ok"></span> OK</span> |

## 🚀  LIAISONS ENTRE WORKSPACES

| Test | Statut |
|------|--------|
| server/.env présent | <span class="ok"><span class="dot dot-ok"></span> OK</span> |
| web/.env présent | <span class="ok"><span class="dot dot-ok"></span> OK</span> |
| .env (racine) présent | <span class="ok"><span class="dot dot-ok"></span> OK</span> |
| Cohérence ports server ↔ web | <span class="ok"><span class="dot dot-ok"></span> OK</span> |
| Cohérence PGDATABASE server ↔ docker | <span class="ok"><span class="dot dot-ok"></span> OK</span> |
| server → DB (SELECT 1) | <span class="ok"><span class="dot dot-ok"></span> OK</span> |
| server → DB (table users) | <span class="ok"><span class="dot dot-ok"></span> OK</span> |
| web → server (GET /api/health) | <span class="ok"><span class="dot dot-ok"></span> OK</span> |
| express installé (server) | <span class="ok"><span class="dot dot-ok"></span> OK</span> |
| pg installé (server) | <span class="ok"><span class="dot dot-ok"></span> OK</span> |
| react installé (web) | <span class="ok"><span class="dot dot-ok"></span> OK</span> |
| React Native (non configuré) | <span class="ignored"><span class="dot dot-ignored"></span> IGNORÉ</span> |
| Cloudinary configuré | <span class="ignored"><span class="dot dot-ignored"></span> IGNORÉ</span> |
| EmailJS configuré | <span class="ignored"><span class="dot dot-ignored"></span> IGNORÉ</span> |

## ⚠  SÉCURITÉ

| Test | Statut |
|------|--------|
| JWT_SECRET robuste | <span class="ok"><span class="dot dot-ok"></span> OK</span> |
| NODE_ENV défini (server) | <span class="ok"><span class="dot dot-ok"></span> OK</span> |
| .env dans .gitignore | <span class="ok"><span class="dot dot-ok"></span> OK</span> |
| .env.sample présent | <span class="ok"><span class="dot dot-ok"></span> OK</span> |
| CORS CLIENT_URL non wildcard | <span class="ok"><span class="dot dot-ok"></span> OK</span> |

## ⚙  QUALITÉ DU CODE

| Test | Statut |
|------|--------|
| Biome check | <span class="ok"><span class="dot dot-ok"></span> OK</span> |
| TypeScript | <span class="ok"><span class="dot dot-ok"></span> OK</span> |
| Script "dev" dans package.json | <span class="ok"><span class="dot dot-ok"></span> OK</span> |
| Script "start" dans package.json | <span class="ok"><span class="dot dot-ok"></span> OK</span> |
| Script "dev" dans server/package.json | <span class="ok"><span class="dot dot-ok"></span> OK</span> |
| Script "build" dans server/package.json | <span class="ok"><span class="dot dot-ok"></span> OK</span> |
| Script "start" dans server/package.json | <span class="ok"><span class="dot dot-ok"></span> OK</span> |
| Script "dev" dans web/package.json | <span class="ok"><span class="dot dot-ok"></span> OK</span> |
| Script "build" dans web/package.json | <span class="ok"><span class="dot dot-ok"></span> OK</span> |

## ⚙  TESTS

| Test | Statut |
|------|--------|
| npm test (racine) non configuré | <span class="ignored"><span class="dot dot-ignored"></span> IGNORÉ</span> |
| npm test (server) non configuré | <span class="ignored"><span class="dot dot-ignored"></span> IGNORÉ</span> |
| npm test (web) non configuré | <span class="ignored"><span class="dot dot-ignored"></span> IGNORÉ</span> |

## 📁  GIT / CI

| Test | Statut |
|------|--------|
| Git initialisé (.git/) | <span class="ok"><span class="dot dot-ok"></span> OK</span> |

## 📊  PERFORMANCE

| Test | Statut |
|------|--------|
| Temps réponse API : 6ms | <span class="ok"><span class="dot dot-ok"></span> OK</span> |
| Build size : 577.6 KB | <span class="ok"><span class="dot dot-ok"></span> OK</span> |
| Pipeline CI (.github/workflows/ci.yml) | <span class="generated"><span class="dot dot-generated"></span> GÉNÉRÉ</span> |

## 📁  ARBORESCENCE DU PROJET

```
.
├── .env
├── .env.sample
├── .github
│   └── workflows
│       └── ci.yml
├── .gitignore
├── .vscode
│   └── settings.json
├── biome.json
├── docker-compose.yml
├── mobile
│   ├── .env
│   ├── .env.sample
│   ├── package.json
│   └── src
│       ├── App.tsx
│       ├── components
│       │   ├── Footer
│       │   │   └── Footer.tsx
│       │   └── Header
│       │       └── Header.tsx
│       ├── constants
│       ├── main.tsx
│       ├── pages
│       ├── styles
│       │   └── index.css
│       └── utils
├── package-lock.json
├── package.json
├── server
│   ├── .env
│   ├── .env.sample
│   ├── database
│   │   └── script
│   │       └── schema.sql
│   ├── package.json
│   ├── src
│   │   ├── database
│   │   │   ├── client.ts
│   │   │   └── init-db.ts
│   │   ├── index.ts
│   │   └── routes
│   │       └── health.router.ts
│   └── tsconfig.json
├── setup
│   ├── exports_writings
│   │   ├── export_writings_all.ts
│   │   ├── export_writings_gitDiff.ts
│   │   └── export_writings_noCommit.ts
│   ├── liveApp.ts
│   ├── resources
│   │   └── resources.md
│   ├── sync-biome-schema.mjs
│   ├── update-package-name.ts
│   └── verify_monorepo
│       ├── report.css
│       └── verify_monorepo.ts
├── shared
│   ├── package.json
│   ├── src
│   │   ├── constants.ts
│   │   └── index.ts
│   ├── tsconfig.cjs.json
│   ├── tsconfig.esm.json
│   └── write-build-metadata.cjs
├── tsconfig.json
└── web
    ├── .env
    ├── .env.sample
    ├── .gitignore
    ├── index.html
    ├── package.json
    ├── public
    │   ├── favicon.svg
    │   └── favicon_app.svg
    ├── README.md
    ├── scripts
    │   └── prerender.mjs
    ├── src
    │   ├── App.tsx
    │   ├── assets
    │   │   └── logo_app.svg
    │   ├── components
    │   │   ├── footer
    │   │   │   └── Footer.tsx
    │   │   ├── header
    │   │   │   └── Header.tsx
    │   │   ├── layout
    │   │   │   └── Layout.tsx
    │   │   └── seo
    │   │       └── Seo.tsx
    │   ├── global.css
    │   ├── main.tsx
    │   ├── pages
    │   │   ├── homePage
    │   │   │   ├── HomePage.css
    │   │   │   └── HomePage.tsx
    │   │   └── notFoundPage
    │   │       ├── NotFoundPage.css
    │   │       └── NotFoundPage.tsx
    │   ├── router.tsx
    │   └── vite-env.d.ts
    ├── tsconfig.app.json
    ├── tsconfig.json
    ├── tsconfig.node.json
    ├── tsconfig.tsbuildinfo
    └── vite.config.ts
```

