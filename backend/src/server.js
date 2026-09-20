import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import collectionsRoutes from "./routes/collections.js";
import expensesRoutes from "./routes/expenses.js";
import summaryRoutes from "./routes/summary.js";
import auditRoutes from "./routes/audit.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "festival-finance-backend" });
});

app.use("/api/auth", authRoutes);
app.use("/api/collections", collectionsRoutes);
app.use("/api/expenses", expensesRoutes);
app.use("/api/summary", summaryRoutes);
app.use("/api/audit", auditRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong on the server" });
});

app.listen(PORT, () => {
  console.log(`Festival Finance backend running on http://localhost:${PORT}`);
});
