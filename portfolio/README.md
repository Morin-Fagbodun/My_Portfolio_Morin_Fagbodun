# Morin Fagbodun — Portfolio (React + Express)

A full-stack portfolio with a React/Bootstrap frontend and an Express backend. All content (projects, skills, profile info) is editable via a private admin panel — no database required.

---

## Project Structure

```
portfolio/
├── backend/
│   ├── data/
│   │   ├── portfolio.json    ← All site content lives here
│   │   └── auth.json         ← Admin credentials (hashed)
│   ├── middleware/
│   │   └── auth.js           ← JWT token verification
│   ├── routes/
│   │   ├── auth.js           ← Login, change-password
│   │   └── portfolio.js      ← CRUD for profile/skills/projects
│   ├── assets/               ← Place your images/resume here
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── components/
        │   ├── Navbar/       ← Sticky responsive nav
        │   ├── Hero/         ← Profile + name + buttons
        │   ├── About/        ← Bio + education cards
        │   ├── Experience/   ← Skills grid
        │   ├── Projects/     ← Cards + modal popups
        │   ├── Contact/      ← Email + LinkedIn links
        │   └── Footer/
        ├── pages/
        │   ├── PortfolioPage.jsx   ← Public site
        │   ├── LoginPage.jsx       ← /admin/login
        │   └── AdminPage.jsx       ← /admin (protected)
        ├── context/
        │   └── AuthContext.jsx     ← Login state
        ├── hooks/
        │   └── useApi.js           ← All API calls
        └── index.css               ← All custom styles
```

---

## Setup (First Time)

### 1. Install dependencies

```bash
# In the root portfolio/ folder:
npm install
npm run install:all
```

### 2. Configure the backend

```bash
cd backend
cp .env.example .env
```

Open `.env` and replace `JWT_SECRET` with any long random string:
```
PORT=5000
JWT_SECRET=some-really-long-random-string-here
CLIENT_URL=http://localhost:3000
```

### 3. Add your assets

Put your files in `backend/assets/`:
- `profile_pic.png` — your profile photo
- `about-pic-pt2.JPG` — about section photo
- `Morin_Fagbodun_Resume.pdf` — your resume
- Project images (any name)

Then update the URLs in `backend/data/portfolio.json` to match (e.g. `/assets/profile_pic.png`).

### 4. Set your admin password

The default password is `password`. **Change it immediately after first login.**

To pre-set a custom password, generate a bcrypt hash and paste it into `backend/data/auth.json`:

```bash
# Quick way — run this in Node:
node -e "const b=require('bcryptjs'); console.log(b.hashSync('YourNewPassword', 10))"
```

Paste the output into `auth.json`:
```json
{ "admin": { "username": "admin", "passwordHash": "<paste here>" } }
```

---

## Running the App

```bash
# From the root portfolio/ folder — runs both at once:
npm run dev
```

- **Portfolio site:** http://localhost:3000
- **Admin panel:** http://localhost:3000/admin/login
- **API:** http://localhost:5000/api

---

## Admin Panel

Navigate to `http://localhost:3000/admin/login`. This page is **not linked** anywhere on the public site.

**Login:** username `admin`, password `password` (change it!)

### What you can do in the admin panel:

| Tab | What you can edit |
|-----|------------------|
| **Profile** | Name, title, bio, education, photos, social links, resume URL |
| **Skills** | Add/remove skills in Frontend or Backend categories |
| **Projects** | Add, edit, delete projects with title, description, image, GitHub/demo links, tags |
| **Password** | Change your admin password |

---

## API Reference

### Public (no auth needed)
| Method | Endpoint | Returns |
|--------|----------|---------|
| GET | `/api/portfolio` | All data |
| GET | `/api/portfolio/profile` | Profile object |
| GET | `/api/portfolio/skills` | Skills object |
| GET | `/api/portfolio/projects` | Projects array |

### Protected (requires `Authorization: Bearer <token>` header)
| Method | Endpoint | Action |
|--------|----------|--------|
| POST | `/api/auth/login` | Get a token |
| PUT | `/api/portfolio/profile` | Update profile |
| PUT | `/api/portfolio/skills` | Replace all skills |
| POST | `/api/portfolio/skills/item` | Add a skill |
| DELETE | `/api/portfolio/skills/:cat/:id` | Remove a skill |
| POST | `/api/portfolio/projects` | Add a project |
| PUT | `/api/portfolio/projects/:id` | Update a project |
| DELETE | `/api/portfolio/projects/:id` | Delete a project |

---

## Upgrading to a Real Database Later

The backend stores data in `portfolio.json` right now, which is perfect for a personal portfolio. When you're ready to upgrade, swap the `readData()` / `writeData()` calls in `backend/routes/portfolio.js` with MongoDB/Prisma queries — the API interface stays the same.

---

## Deploying

- **Backend** → Deploy to Railway, Render, or Heroku. Set `JWT_SECRET` and `CLIENT_URL` as environment variables.
- **Frontend** → Run `npm run build --prefix frontend` and deploy the `build/` folder to Netlify/Vercel. Set `REACT_APP_API_URL` if your backend is on a different domain and update the `proxy` in `frontend/package.json`
.
