import { Router } from "express";
import { getAuditLog } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, (req, res) => {
  const log = [...getAuditLog()].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );
  res.json(log);
});

export default router;
