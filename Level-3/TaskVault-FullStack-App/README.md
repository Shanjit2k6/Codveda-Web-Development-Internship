# TaskVault – Full-Stack Task Management System

<div align="center">

![TaskVault Banner](https://img.shields.io/badge/TaskVault-Full--Stack-6c4df6?style=for-the-badge&logo=node.js&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-24.x-339933?style=flat-square&logo=node.js)
![Express](https://img.shields.io/badge/Express-5.x-000000?style=flat-square&logo=express)
![SQLite](https://img.shields.io/badge/SQLite-3.x-003B57?style=flat-square&logo=sqlite)
![JWT](https://img.shields.io/badge/JWT-Auth-FB015B?style=flat-square&logo=jsonwebtokens)

**Codveda Technologies Web Development Internship – Level 3**  
Task 1: Full-Stack CRUD Application | Task 2: User Authentication System

</div>

---

## 📌 Project Overview

TaskVault is a **production-quality, full-stack task management web application** built from scratch as part of the Codveda Technologies Level-3 internship. It provides:

- 🔐 Secure user registration and login (bcrypt + JWT)
- ✅ Full CRUD task management (Create, Read, Update, Delete)
- 📊 Live dashboard with task statistics (Total / Completed / Pending)
- 🎯 Task priorities (Low, Medium, High) and due dates
- 🔍 Real-time search and status filter
- 📱 Fully responsive design (desktop, tablet, mobile)

---

## 🎓 Internship Coverage

| Criterion | Coverage |
|---|---|
| **Task 1 – CRUD** | RESTful APIs (GET/POST/PUT/DELETE), SQLite persistence, Fetch API frontend |
| **Task 2 – Auth** | bcrypt hashing, JWT in HttpOnly cookies, protected routes, user data isolation |

---

## ✨ Features

- 🔐 **Authentication** – Register, login, logout with secure JWT cookie sessions
- 🗄️ **SQLite Database** – SQLite via `better-sqlite3` with parameterized queries
- 🔒 **Password Security** – bcrypt with 12 salt rounds; hashes never exposed in APIs
- 📋 **Task Management** – Full CRUD with title, description, priority, due date, completed status
- 👤 **Data Isolation** – Every task endpoint enforces ownership; users can only see their own tasks
- 🔍 **Search** – Real-time search by title and description
- 🏷️ **Filters** – All / Pending / Completed status tabs + priority dropdown
- ✏️ **Inline Edit Modal** – Edit any task field without leaving the page
- 🗑️ **Safe Delete** – Confirmation dialog before deletion
- 📱 **Responsive** – Sidebar collapses to drawer on mobile
- 🌐 **4 Pages** – Landing, Login, Register, Dashboard
- 🎨 **Premium UI** – Purple SaaS-style design with Inter font, smooth animations

---

## 🛠️ Technology Stack

### Frontend
| Technology | Purpose |
|---|---|
| HTML5 | Page structure |
| CSS3 with custom properties | Design system (Flexbox + Grid) |
| Vanilla JavaScript | CRUD interactions, fetch API |
| Google Fonts (Inter) | Typography |

### Backend
| Package | Version | Purpose |
|---|---|---|
| `express` | ^5.3.0 | Web framework |
| `better-sqlite3` | ^13.0.3 | SQLite ORM-free driver |
| `bcrypt` | ^6.0.0 | Password hashing |
| `jsonwebtoken` | ^9.0.3 | JWT tokens |
| `cookie-parser` | ^1.4.7 | HttpOnly cookie support |
| `dotenv` | ^18.0.8 | Environment variables |
| `cors` | ^2.8.6 | Cross-origin headers |

---

## 📁 Project Structure

```
TaskVault-FullStack-App/
├── public/
│   ├── index.html          # Landing page
│   ├── login.html          # Login page
│   ├── register.html       # Registration page
│   ├── dashboard.html      # Main dashboard
│   ├── css/
│   │   └── styles.css      # Complete design system
│   └── js/
│       ├── auth.js         # Toast utilities
│       └── dashboard.js    # Task CRUD logic
├── routes/
│   ├── auth.js             # Auth API endpoints
│   └── tasks.js            # Task CRUD endpoints
├── middleware/
│   └── authMiddleware.js   # JWT verification
├── database/
│   └── db.js               # SQLite init & schema
├── tests/
│   └── api.test.js         # Automated API tests
├── server.js               # Express app entry
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js v18+ (tested on v24.11.1)
- npm v8+

### 1. Clone / navigate to the project
```bash
cd "d:\Codeveda Intern\Level-3\TaskVault-FullStack-App"
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
```bash
# Copy the example and edit
copy .env.example .env
```

Edit `.env`:
```env
PORT=3000
JWT_SECRET=your_super_secret_jwt_key_change_this_min32chars
NODE_ENV=development
```

### 4. Start the server
```bash
npm start
# or for auto-reload during development:
npm run dev
```

### 5. Open in browser
```
http://localhost:3000
```

---

## 🔑 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `PORT` | No (default: 3000) | Server port |
| `JWT_SECRET` | **Yes** | Secret for JWT signing (min 32 chars) |
| `NODE_ENV` | No | `development` or `production` |

---

## 🗄️ Database Schema

### `users` table
| Column | Type | Constraints |
|---|---|---|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT |
| `name` | TEXT | NOT NULL |
| `email` | TEXT | NOT NULL, UNIQUE |
| `password_hash` | TEXT | NOT NULL |
| `created_at` | TEXT | DEFAULT datetime('now') |

### `tasks` table
| Column | Type | Constraints |
|---|---|---|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT |
| `user_id` | INTEGER | NOT NULL, FK → users(id) CASCADE |
| `title` | TEXT | NOT NULL |
| `description` | TEXT | DEFAULT '' |
| `priority` | TEXT | CHECK IN ('low','medium','high') |
| `due_date` | TEXT | NULL allowed |
| `completed` | INTEGER | DEFAULT 0 (boolean) |
| `created_at` | TEXT | DEFAULT datetime('now') |
| `updated_at` | TEXT | DEFAULT datetime('now') |

---

## 🌐 API Endpoints

### Authentication
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login (sets JWT cookie) |
| GET  | `/api/auth/me` | ✅ | Get current user profile |
| POST | `/api/auth/logout` | ❌ | Clear JWT cookie |

### Tasks (all require authentication)
| Method | Endpoint | Query Params | Description |
|---|---|---|---|
| GET | `/api/tasks` | `?status=&priority=&search=` | List user's tasks |
| GET | `/api/tasks/:id` | – | Get single task |
| POST | `/api/tasks` | – | Create task |
| PUT | `/api/tasks/:id` | – | Update task |
| DELETE | `/api/tasks/:id` | – | Delete task |

**Request body examples:**

```json
// POST /api/auth/register
{ "name": "Jane", "email": "jane@example.com", "password": "securepass123" }

// POST /api/tasks
{ "title": "Buy groceries", "description": "Milk, eggs", "priority": "medium", "due_date": "2024-12-31" }

// PUT /api/tasks/:id
{ "title": "Updated title", "priority": "high", "completed": true }
```

---

## 🧪 Testing

### Automated API Tests (17 test cases)

```bash
# Start server first, then in another terminal:
npm test
```

### Test Cases & Results

| # | Test | Status |
|---|---|---|
| 1 | User registration | ✅ PASS |
| 2 | Duplicate email rejection (409) | ✅ PASS |
| 3 | Login with correct credentials | ✅ PASS |
| 4 | Wrong password rejected (401) | ✅ PASS |
| 5 | `/api/auth/me` returns user | ✅ PASS |
| 6 | Unauthenticated task access returns 401 | ✅ PASS |
| 7 | Create task | ✅ PASS |
| 8 | Read all tasks | ✅ PASS |
| 9 | Read single task | ✅ PASS |
| 10 | Update task | ✅ PASS |
| 11 | Mark task completed | ✅ PASS |
| 12 | Filter by status=completed | ✅ PASS |
| 13 | Search tasks by title | ✅ PASS |
| 14 | User data isolation (other user cannot access) | ✅ PASS |
| 15 | Delete task | ✅ PASS |
| 16 | Task 404 after deletion | ✅ PASS |
| 17 | Logout clears session | ✅ PASS |

---

## 🔒 Security Considerations

| Measure | Implementation |
|---|---|
| Password hashing | bcrypt with 12 salt rounds |
| JWT storage | HttpOnly, SameSite=Strict cookie |
| SQL injection | Parameterized queries throughout |
| Password not exposed | `password_hash` never returned in API responses |
| Route protection | `authMiddleware` applied to all task routes |
| Task ownership | Every task endpoint filters by `user_id = req.user.id` |
| Secrets | JWT secret loaded from `.env`, never hardcoded |
| Cookie security | `secure: true` auto-enabled in `NODE_ENV=production` |

---

## 📝 License

ISC – Built for educational internship purposes by **Shanjit Manoj** for **Codveda Technologies Level-3 Internship**.
