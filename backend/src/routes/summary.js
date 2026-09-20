import { Router } from "express";
import { getSummary } from "../db.js";

const router = Router();

router.get("/", (req, res) => {
  res.json(getSummary());
});

export default router;
