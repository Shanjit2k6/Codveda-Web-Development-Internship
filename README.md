# Codveda Technologies — Web Development Internship

**Intern:** Shanjit Manoj  
**Organization:** Codveda Technologies  
**Domain:** Web Development  

---

## Repository Structure

```
Codveda-Internship/
├── Level-1/
│   ├── Task-1-Static-Website/         ← Multi-page HTML/CSS site (PixelCraft)
│   └── Task-3-JavaScript-Interactivity/  ← Dropdown, modal, form validation
├── Level-2/
│   ├── Task-1-Responsive-Web-Design/  ← Flexbox + CSS Grid responsive site
│   └── Task-2-ToDo-List/              ← Full CRUD To-Do app with localStorage
└── Level-3/
    └── TaskVault-FullStack-App/       ← Node.js + Express + SQLite + JWT API
```

---

## Level 1 — Foundational Web Development

| Task | Project | Technologies | README |
|------|---------|-------------|--------|
| Task 1 | PixelCraft Static Website | HTML5, CSS3, Flexbox, Grid | [→ README](./Level-1/Task-1-Static-Website/README.md) |
| Task 3 | JavaScript Interactivity | HTML5, CSS3, Vanilla JS | [→ README](./Level-1/Task-3-JavaScript-Interactivity/README.md) |

**Key achievements:**
- Multi-page site with shared stylesheet and navigation
- Responsive layout with CSS Grid service cards
- Dropdown menu, modal dialog, and client-side form validation using pure JavaScript

---

## Level 2 — Intermediate Web Development

| Task | Project | Technologies | README |
|------|---------|-------------|--------|
| Task 1 | Responsive Web Design | HTML5, CSS Flexbox/Grid, Media Queries | [→ README](./Level-2/Task-1-Responsive-Web-Design/README.md) |
| Task 2 | TaskFlow To-Do App | HTML5, CSS3, Vanilla JS, localStorage | [→ README](./Level-2/Task-2-ToDo-List/README.md) |

**Key achievements:**
- Three-breakpoint responsive layout (desktop / tablet / mobile)
- Full CRUD task manager with filtering, counters, and persistent localStorage storage

---

## Level 3 — Advanced Full-Stack Development

| Task | Project | Technologies | README |
|------|---------|-------------|--------|
| Task 1 | TaskVault Full-Stack App | Node.js, Express, SQLite, JWT, bcrypt | [→ README](./Level-3/TaskVault-FullStack-App/README.md) |

**Key achievements:**
- Secure REST API with JWT authentication via `httpOnly` cookies
- bcrypt password hashing (12 rounds)
- SQLite with parameterized queries (SQL-injection proof)
- Full CRUD task management with per-user ownership enforcement
- 17 automated API tests — all passing

---

## Security Highlights (Level 3)

| Concern | Implementation |
|---------|---------------|
| Password storage | bcrypt (cost factor 12) |
| Authentication | JWT in `httpOnly`, `SameSite=strict` cookie |
| CSRF protection | `SameSite=strict` provides browser-level CSRF resistance |
| SQL injection | Parameterized queries via `better-sqlite3` |
| Sensitive files | `.env` and `*.db` excluded from version control |
| Error messages | Generic server errors; no stack traces exposed to clients |

---

## Quick Start — Level 3 (TaskVault)

```bash
cd Level-3/TaskVault-FullStack-App
npm install
cp .env.example .env          # add your own JWT_SECRET
node server.js                # starts on http://localhost:3000
```

Run the automated test suite (server must be running):

```bash
node tests/api.test.js        # 17 tests — Auth, CRUD, ownership, logout
```

---

## Submission

A clean ZIP archive (`Codveda-Internship-Final.zip`) is provided that excludes:
- `.env` (secrets)
- `node_modules/` (install locally with `npm install`)
- `*.db`, `*.db-wal`, `*.db-shm` (database files)
- Temporary and generated files

---

*Completed: October 2026*
