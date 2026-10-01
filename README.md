# Bug Tracking & Project Management System — Backend

Node.js + Express backend using MySQL.

---

## 📁 Folder Structure

```
bugtracking_backend/
│
├── src/
│   ├── config/
│   │   └── database.js          ← MySQL connection pool
│   │
│   ├── controllers/
│   │   └── healthController.js  ← Health check logic
│   │
│   ├── middleware/
│   │   └── errorMiddleware.js   ← Global error handler
│   │
│   ├── routes/
│   │   ├── healthRoutes.js      ← GET /api/health, GET /api/health/db
│   │   ├── authRoutes.js        ← /api/auth        (stub — Phase 2)
│   │   ├── projectRoutes.js     ← /api/projects    (stub — Phase 2)
│   │   ├── teamRoutes.js        ← /api/teams       (stub — Phase 2)
│   │   ├── studentRoutes.js     ← /api/students    (stub — Phase 2)
│   │   ├── taskRoutes.js        ← /api/tasks       (stub — Phase 2)
│   │   ├── bugRoutes.js         ← /api/bugs        (stub — Phase 2)
│   │   └── commentRoutes.js     ← /api/comments    (stub — Phase 2)
│   │
│   ├── services/                ← Business logic (Phase 2)
│   ├── utils/                   ← Helper functions (Phase 2)
│   └── app.js                   ← Express setup (middleware + routes)
│
├── .env                         ← Your real secrets (never commit!)
├── .env.example                 ← Safe template — commit this
├── .gitignore
├── package.json
└── server.js                    ← Entry point
```

### What each folder does

| Folder / File | Purpose |
|---|---|
| `config/database.js` | Creates a MySQL connection pool. Import this wherever you need to query the database. |
| `controllers/` | Handles requests and sends responses. Calls services for business logic. |
| `middleware/errorMiddleware.js` | Catches all errors and returns clean JSON. Registered last in app.js. |
| `routes/` | Maps URL paths to controller functions. One file per resource. |
| `services/` | Business logic (Phase 2). Keeps controllers clean. |
| `utils/` | Small reusable helper functions shared across the project. |

---

## ⚙️ Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env`:

```bash
copy .env.example .env
```

Then open `.env` and fill in your MySQL credentials (provided by your database teammate):

```
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_NAME=bug_tracking_system
DB_USER=root
DB_PASSWORD=your_actual_password
```

> ⚠️ Never commit `.env` — it is already in `.gitignore`.

---

## ▶️ Running the Server

```bash
# Development — auto-restarts when you save a file
npm run dev

# Production
npm start
```

Expected output:

```
--------------------------------------------------
  Bug Tracking & Project Management System
  Server running on port 5000
  Health:    http://localhost:5000/api/health
  DB Check:  http://localhost:5000/api/health/db
--------------------------------------------------
```

---

## 🧪 Testing

### 1. Test the server health endpoint

Open your browser or use curl:

```
GET http://localhost:5000/api/health
```

Expected response:

```json
{
  "success": true,
  "message": "Backend is running"
}
```

This works even if MySQL is not running.

---

### 2. Test the MySQL connection

```
GET http://localhost:5000/api/health/db
```

**If MySQL is running and credentials are correct:**

```json
{
  "success": true,
  "message": "MySQL database connected successfully"
}
```

**If MySQL is NOT running (or credentials are wrong):**

```json
{
  "success": false,
  "message": "MySQL database connection failed"
}
```

The backend will NOT crash if the database is unavailable.

---

### 3. Test the prepared API route stubs

All routes below return a "route is ready" response until CRUD is implemented in Phase 2.

| Method | URL | Expected Response |
|---|---|---|
| GET | `/api/auth` | `{ "success": true, "message": "Auth route is ready" }` |
| GET | `/api/projects` | `{ "success": true, "message": "Projects route is ready" }` |
| GET | `/api/teams` | `{ "success": true, "message": "Teams route is ready" }` |
| GET | `/api/students` | `{ "success": true, "message": "Students route is ready" }` |
| GET | `/api/tasks` | `{ "success": true, "message": "Tasks route is ready" }` |
| GET | `/api/bugs` | `{ "success": true, "message": "Bugs route is ready" }` |
| GET | `/api/comments` | `{ "success": true, "message": "Comments route is ready" }` |

---

## 📦 Dependencies

| Package | Purpose |
|---|---|
| `express` | Web framework — handles HTTP requests and routing |
| `mysql2` | MySQL client — connects to and queries the database |
| `cors` | Allows the frontend (different port) to call this backend |
| `dotenv` | Loads `.env` values into `process.env` |
| `nodemon` *(dev only)* | Auto-restarts server on file save |

---

## 🔌 Connecting to MySQL (When DB is Ready)

Once your teammate has created the database, update `.env` with the real values:

```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=bug_tracking_system
DB_USER=root
DB_PASSWORD=real_password_here
```

No code changes needed — only the `.env` file.

---

## 🗄️ Planned Database Tables (Phase 2)

Your database teammate will create these tables:

```
FACULTY → PROJECT → TEAM → STUDENT
PROJECT → TASK → BUG_REPORT → COMMENTS
TASK is also linked to STUDENT
COMMENTS are linked to STUDENT and BUG_REPORT
```

Do NOT create these tables — the database team handles this.