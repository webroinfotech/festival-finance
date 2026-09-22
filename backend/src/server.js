import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import collectionsRoutes from "./routes/collections.js";
import expensesRoutes from "./routes/expenses.js";
import summaryRoutes from "./routes/summary.js";
import auditRoutes from "./routes/audit.js";
import { checkConnection } from "./db.js";

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "https://festival-finance.webroinfotech.in",
  "http://localhost:5173",
  "http://localhost:4173",
];
if (process.env.CORS_ORIGIN) {
  allowedOrigins.push(...process.env.CORS_ORIGIN.split(",").map((o) => o.trim()));
}

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser requests (curl, server-to-server, health checks) which send no Origin header.
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} is not allowed by CORS`));
      }
    },
  })
);
app.use(express.json());

app.get("/api/health", async (req, res) => {
  try {
    await checkConnection();
    res.json({ status: "ok", service: "festival-finance-backend", database: "connected" });
  } catch (err) {
    const message = err.errors?.map((e) => e.message).join("; ") || err.message || "Unknown error";
    res.status(503).json({
      status: "degraded",
      service: "festival-finance-backend",
      database: "unreachable",
      message,
    });
  }
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
