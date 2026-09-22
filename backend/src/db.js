import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

export async function checkConnection() {
  const conn = await pool.getConnection();
  try {
    await conn.query("SELECT 1");
  } finally {
    conn.release();
  }
}

function mapEntity(row) {
  if (!row) return null;
  const entity = {
    id: row.id,
    name: row.name,
    amount: Number(row.amount),
    paymentType: row.payment_type,
    description: row.description || "",
    createdAt: row.created_at,
  };
  if (row.updated_at) entity.updatedAt = row.updated_at;
  return entity;
}

function buildEntityStore(table) {
  return {
    async getAll() {
      const [rows] = await pool.query(
        `SELECT * FROM ${table} ORDER BY created_at DESC`
      );
      return rows.map(mapEntity);
    },
    async getById(id) {
      const [rows] = await pool.query(`SELECT * FROM ${table} WHERE id = ?`, [id]);
      return mapEntity(rows[0]);
    },
    async add(entry) {
      await pool.query(
        `INSERT INTO ${table} (id, name, amount, payment_type, description, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
        [entry.id, entry.name, entry.amount, entry.paymentType, entry.description, entry.createdAt]
      );
      return entry;
    },
    async update(id, patch) {
      const existing = await this.getById(id);
      if (!existing) return null;
      const merged = { ...existing, ...patch };
      await pool.query(
        `UPDATE ${table} SET name = ?, amount = ?, payment_type = ?, description = ?, updated_at = ? WHERE id = ?`,
        [merged.name, merged.amount, merged.paymentType, merged.description, merged.updatedAt, id]
      );
      return merged;
    },
    async remove(id) {
      const existing = await this.getById(id);
      if (!existing) return null;
      await pool.query(`DELETE FROM ${table} WHERE id = ?`, [id]);
      return existing;
    },
  };
}

const collectionsStore = buildEntityStore("collections");
const expensesStore = buildEntityStore("expenses");

export const getCollections = () => collectionsStore.getAll();
export const getCollectionById = (id) => collectionsStore.getById(id);
export const addCollection = (entry) => collectionsStore.add(entry);
export const updateCollection = (id, patch) => collectionsStore.update(id, patch);
export const deleteCollection = (id) => collectionsStore.remove(id);

export const getExpenses = () => expensesStore.getAll();
export const getExpenseById = (id) => expensesStore.getById(id);
export const addExpense = (entry) => expensesStore.add(entry);
export const updateExpense = (id, patch) => expensesStore.update(id, patch);
export const deleteExpense = (id) => expensesStore.remove(id);

export async function getAuditLog() {
  const [rows] = await pool.query(
    "SELECT * FROM audit_log ORDER BY created_at DESC"
  );
  return rows.map((row) => ({
    id: row.id,
    action: row.action,
    entityType: row.entity_type,
    entityId: row.entity_id,
    performedBy: row.performed_by,
    before: parseJsonColumn(row.before_data),
    after: parseJsonColumn(row.after_data),
    timestamp: row.created_at,
  }));
}

export async function addAuditLog(entry) {
  await pool.query(
    `INSERT INTO audit_log (id, action, entity_type, entity_id, performed_by, before_data, after_data, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      entry.id,
      entry.action,
      entry.entityType,
      entry.entityId,
      entry.performedBy,
      entry.before ? JSON.stringify(entry.before) : null,
      entry.after ? JSON.stringify(entry.after) : null,
      entry.timestamp,
    ]
  );
  return entry;
}

function parseJsonColumn(value) {
  if (value == null) return null;
  return typeof value === "string" ? JSON.parse(value) : value;
}

export async function getSummary() {
  const [[collectionsAgg]] = await pool.query(`
    SELECT
      COALESCE(SUM(amount), 0) AS total,
      COALESCE(SUM(CASE WHEN payment_type = 'gpay' THEN amount ELSE 0 END), 0) AS gpay,
      COALESCE(SUM(CASE WHEN payment_type = 'cash' THEN amount ELSE 0 END), 0) AS cash,
      COUNT(*) AS count
    FROM collections
  `);
  const [[expensesAgg]] = await pool.query(`
    SELECT
      COALESCE(SUM(amount), 0) AS total,
      COALESCE(SUM(CASE WHEN payment_type = 'gpay' THEN amount ELSE 0 END), 0) AS gpay,
      COALESCE(SUM(CASE WHEN payment_type = 'cash' THEN amount ELSE 0 END), 0) AS cash,
      COUNT(*) AS count
    FROM expenses
  `);

  const totalCollections = Number(collectionsAgg.total);
  const totalExpenses = Number(expensesAgg.total);
  const gpayCollections = Number(collectionsAgg.gpay);
  const cashCollections = Number(collectionsAgg.cash);
  const gpayExpenses = Number(expensesAgg.gpay);
  const cashExpenses = Number(expensesAgg.cash);

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
    collectionsCount: Number(collectionsAgg.count),
    expensesCount: Number(expensesAgg.count),
  };
}
