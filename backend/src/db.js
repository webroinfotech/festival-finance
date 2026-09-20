import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "..", "data", "db.json");

function ensureDb() {
  if (!fs.existsSync(DB_PATH)) {
    const initial = { collections: [], expenses: [], auditLog: [] };
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2));
  }
}

function readDb() {
  ensureDb();
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  const data = JSON.parse(raw);
  if (!Array.isArray(data.collections)) data.collections = [];
  if (!Array.isArray(data.expenses)) data.expenses = [];
  if (!Array.isArray(data.auditLog)) data.auditLog = [];
  return data;
}

function writeDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export function getCollections() {
  return readDb().collections;
}

export function getExpenses() {
  return readDb().expenses;
}

export function getCollectionById(id) {
  return readDb().collections.find((c) => c.id === id) || null;
}

export function getExpenseById(id) {
  return readDb().expenses.find((e) => e.id === id) || null;
}

export function addCollection(entry) {
  const db = readDb();
  db.collections.push(entry);
  writeDb(db);
  return entry;
}

export function addExpense(entry) {
  const db = readDb();
  db.expenses.push(entry);
  writeDb(db);
  return entry;
}

export function updateCollection(id, patch) {
  const db = readDb();
  const idx = db.collections.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  db.collections[idx] = { ...db.collections[idx], ...patch };
  writeDb(db);
  return db.collections[idx];
}

export function updateExpense(id, patch) {
  const db = readDb();
  const idx = db.expenses.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  db.expenses[idx] = { ...db.expenses[idx], ...patch };
  writeDb(db);
  return db.expenses[idx];
}

export function deleteCollection(id) {
  const db = readDb();
  const idx = db.collections.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  const [removed] = db.collections.splice(idx, 1);
  writeDb(db);
  return removed;
}

export function deleteExpense(id) {
  const db = readDb();
  const idx = db.expenses.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  const [removed] = db.expenses.splice(idx, 1);
  writeDb(db);
  return removed;
}

export function getAuditLog() {
  return readDb().auditLog;
}

export function addAuditLog(entry) {
  const db = readDb();
  db.auditLog.push(entry);
  writeDb(db);
  return entry;
}

export function getSummary() {
  const { collections, expenses } = readDb();

  const sumBy = (items, type) =>
    items
      .filter((i) => (type ? i.paymentType === type : true))
      .reduce((acc, i) => acc + Number(i.amount), 0);

  const totalCollections = sumBy(collections);
  const totalExpenses = sumBy(expenses);

  const gpayCollections = sumBy(collections, "gpay");
  const cashCollections = sumBy(collections, "cash");
  const gpayExpenses = sumBy(expenses, "gpay");
  const cashExpenses = sumBy(expenses, "cash");

  return {
    totalCollections,
    totalExpenses,
    balance: totalCollections - totalExpenses,
    gpayBalance: gpayCollections - gpayExpenses,
    cashBalance: cashCollections - cashExpenses,
    gpayCollections,
    cashCollections,
    gpayExpenses,
    cashExpenses,
    collectionsCount: collections.length,
    expensesCount: expenses.length,
  };
}
