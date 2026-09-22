import { Router } from "express";
import crypto from "crypto";
import {
  getExpenses,
  addExpense,
  getExpenseById,
  updateExpense,
  deleteExpense,
} from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { buildLedgerPdf } from "../utils/pdfGenerator.js";
import { recordAudit } from "../utils/audit.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

function validatePayload(body) {
  const { expenseFor, amount, paymentType, description } = body || {};

  if (!expenseFor || !String(expenseFor).trim()) {
    return { error: "Expense For is required" };
  }
  const numericAmount = Number(amount);
  if (!amount || Number.isNaN(numericAmount) || numericAmount <= 0) {
    return { error: "A valid amount is required" };
  }
  if (!["gpay", "cash"].includes(paymentType)) {
    return { error: "Payment type must be gpay or cash" };
  }

  return {
    data: {
      name: String(expenseFor).trim(),
      amount: numericAmount,
      paymentType,
      description: description ? String(description).trim() : "",
    },
  };
}

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const expenses = (await getExpenses()).sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    res.json(expenses);
  })
);

router.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { error, data } = validatePayload(req.body);
    if (error) return res.status(400).json({ message: error });

    const entry = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date(),
    };

    await addExpense(entry);
    await recordAudit({
      action: "create",
      entityType: "expense",
      entityId: entry.id,
      performedBy: req.user.username,
      before: null,
      after: entry,
    });
    res.status(201).json(entry);
  })
);

router.put(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const existing = await getExpenseById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Expense not found" });

    const { error, data } = validatePayload(req.body);
    if (error) return res.status(400).json({ message: error });

    const updated = await updateExpense(req.params.id, {
      ...data,
      updatedAt: new Date(),
    });

    await recordAudit({
      action: "update",
      entityType: "expense",
      entityId: req.params.id,
      performedBy: req.user.username,
      before: existing,
      after: updated,
    });
    res.json(updated);
  })
);

router.delete(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const removed = await deleteExpense(req.params.id);
    if (!removed) return res.status(404).json({ message: "Expense not found" });

    await recordAudit({
      action: "delete",
      entityType: "expense",
      entityId: req.params.id,
      performedBy: req.user.username,
      before: removed,
      after: null,
    });
    res.json({ message: "Deleted", id: req.params.id });
  })
);

router.get(
  "/pdf",
  asyncHandler(async (req, res) => {
    const items = (await getExpenses()).sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
    const doc = buildLedgerPdf({ kind: "expenses", items });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="expenses-report.pdf"`
    );
    doc.pipe(res);
    doc.end();
  })
);

export default router;
