import { Router } from "express";
import { getSummary } from "../db.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    res.json(await getSummary());
  })
);

export default router;
