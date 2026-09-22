# Festival Amount Maintenance

Full-stack app for tracking a festival's collections and expenses — public transparency view plus an admin panel to record entries.

## Stack

- **Frontend:** React (Vite), Tailwind CSS v4, Framer Motion
- **Backend:** Node.js, Express, PDFKit, MySQL

## Run it

**Database** — create it once by running `backend/setup.sql` against your MySQL server:
```
mysql -u root -p < backend/setup.sql
```
Then set `DB_HOST` / `DB_PORT` / `DB_USER` / `DB_PASSWORD` / `DB_NAME` in `backend/.env` to match. `GET /api/health` reports whether the backend can reach the database.

**Backend** (http://localhost:5000)
```
cd backend
npm install
npm run dev
```

**Frontend** (http://localhost:5173)
```
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Admin login

- Username: `Admin`
- Password: `Admin@123`

Change these in `backend/.env` before deploying anywhere public.

## Features

- Public home page: live Total Collections, Total Expenses, and Balance
- Total Collections / Total Expenses → view, download, or share a generated PDF report
- Balance → current balance split by GPay vs Cash
- Admin login (top-right) unlocks New Collection and New Expense forms, plus a recent-activity feed
- Fully responsive, dark premium UI

## Data

Entries live in MySQL (`festival_finance` database — see `backend/setup.sql`): `collections`, `expenses`, and `audit_log` tables.
