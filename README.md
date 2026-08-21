# 🎮 Plateforme de gestion de compétitions e-sport

Backend REST API pour la gestion de tournois e-sport — joueurs, équipes, tournois et inscriptions.

---

## Stack technique

| Élément | Technologie |
|---|---|
| Runtime | Node.js |
| Framework | Express |
| Base de données | PostgreSQL (hébergé sur Supabase) |
| ORM | Drizzle ORM |
| Authentification | JWT (jsonwebtoken) + bcryptjs |
| Validation | validator |
| Sécurité | helmet, cors, express-rate-limit |
| Variables d'env | dotenv |

---

## Installation

### 1. Cloner le projet et installer les dépendances

```bash
npm init -y
npm install -g nodemon
npm install express bcryptjs jsonwebtoken dotenv cors helmet express-rate-limit validator drizzle-orm --save sequelize --save pg pg-hstore
```

### 2. Configurer les variables d'environnement

Créer un fichier `.env` à la racine :

```env
DATABASE_URL=postgresql://postgres:[MOT_DE_PASSE]@[HOST]/[NOM_DB]
JWT_SECRET=votre_secret
PORT=3005
```

> L'URL de la base de données est disponible dans votre projet Supabase.

### 3. Lancer le serveur

```bash
nodemon app.js
```

---

## Structure du projet

```
mon-projet/
├── app.js                  → point d'entrée, config express + sécurité
├── .env                    → variables d'environnement (non versionné)
├── config/
│   └── db.js               → connexion à la base de données
├── models/
│   ├── userModel.js        → table Users + vérification bcrypt
│   ├── teamModel.js        → table Teams
│   ├── tournamentModel.js  → table Tournaments
│   └── registrationModel.js→ table Registrations (jointure teams/tournaments)
├── middlewares/
│   └── authMiddleware.js   → vérification JWT + récupération userId
├── controllers/
│   ├── authController.js   → inscription, connexion
│   ├── userController.js   → profil utilisateur, gestion des rôles
│   ├── teamController.js   → création et gestion des équipes
│   └── tournamentController.js → tournois + inscriptions + stats
└── routes/
    ├── authRoutes.js
    ├── userRoutes.js
    ├── teamRoutes.js
    └── tournamentRoutes.js
```

---

## Sécurité

- **CORS** — accès restreint au `localhost:3005`
- **Helmet** — headers HTTP sécurisés, protection XSS
- **Rate limiting** — limite les requêtes par IP pour éviter le bruteforce
- **JWT** — token d'authentification, expiration à 150 jours
- **bcrypt** — hashage des mots de passe
- **Validation** — format email, mot de passe (6 car. min, 1 maj, 1 min, 1 chiffre, 1 caractère spécial)

---

## Rôles utilisateurs

| Rôle | Permissions |
|---|---|
| `joueur` | créer/rejoindre une équipe, s'inscrire à un tournoi |
| `capitaine` | gérer les membres de son équipe |
| `organisateur` | créer, modifier, supprimer des tournois |
| `admin` | accès total — utilisateurs, équipes, tournois, stats |

---

## Modèle de données

### Users
| Champ | Type | Description |
|---|---|---|
| id | PK | identifiant unique |
| email | string | unique, validé |
| password | string | hashé avec bcrypt |
| role | enum | joueur / capitaine / organisateur / admin |

### Teams
| Champ | Type | Description |
|---|---|---|
| id | PK | identifiant unique |
| name | string | nom de l'équipe |
| user_id | FK → Users | capitaine de l'équipe |
| members | integer[] | tableau des ids membres |

### Tournaments
| Champ | Type | Description |
|---|---|---|
| id | PK | identifiant unique |
| name | string | nom du tournoi |
| game | string | jeu concerné |
| date | date | date de l'événement |
| rules | text | règlement |
| organizer_id | FK → Users | créateur du tournoi |

### Registrations
| Champ | Type | Description |
|---|---|---|
| id | PK | identifiant unique |
| team_id | FK → Teams | équipe inscrite |
| tournament_id | FK → Tournaments | tournoi concerné |

---

## Endpoints

### Auth — `/auth`

| Méthode | Route | Description | Auth |
|---|---|---|---|
| POST | `/auth/register` | Créer un compte | ✗ |
| POST | `/auth/login` | Se connecter | ✗ |

### Utilisateurs — `/users`

| Méthode | Route | Description | Auth |
|---|---|---|---|
| PATCH | `/users/me` | Modifier son profil | ✓ |
| PATCH | `/users/:id/role` | Modifier le rôle d'un user | Admin |

### Équipes — `/teams`

| Méthode | Route | Description | Auth |
|---|---|---|---|
| POST | `/teams` | Créer une équipe | ✓ |
| PATCH | `/teams/:id/join` | Rejoindre une équipe | ✓ |
| PATCH | `/teams/:id/members` | Ajouter/retirer un membre | Capitaine |
| GET | `/teams/:id` | Détail d'une équipe | ✓ |
| DELETE | `/teams/:id` | Supprimer une équipe | Admin |

### Tournois — `/tournaments`

| Méthode | Route | Description | Auth |
|---|---|---|---|
| POST | `/tournaments` | Créer un tournoi | Organisateur |
| PATCH | `/tournaments/:id` | Modifier un tournoi | Organisateur |
| DELETE | `/tournaments/:id` | Supprimer un tournoi | Organisateur / Admin |
| GET | `/tournaments` | Lister les tournois ouverts | ✓ |
| GET | `/tournaments/:id/teams` | Équipes inscrites à un tournoi | Organisateur |
| GET | `/tournaments/stats` | Stats de participation | Admin |
| POST | `/tournaments/:id/register` | Inscrire une équipe | ✓ |
| GET | `/tournaments/my` | Mes inscriptions | ✓ |

---
