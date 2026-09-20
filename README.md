# Festival Amount Maintenance

Full-stack app for tracking a festival's collections and expenses — public transparency view plus an admin panel to record entries.

## Stack

- **Frontend:** React (Vite), Tailwind CSS v4, Framer Motion
- **Backend:** Node.js, Express, PDFKit (JSON file storage, no database needed)

## Run it

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

Entries are stored in `backend/data/db.json`. Delete its contents (or reset to `{"collections":[],"expenses":[]}`) to start fresh.
