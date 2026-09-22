import { Router } from "express";
import { getAuditLog } from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const log = (await getAuditLog()).sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
    res.json(log);
  })
);

export default router;
