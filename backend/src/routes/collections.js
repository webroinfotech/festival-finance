import { Router } from "express";
import crypto from "crypto";
import {
  getCollections,
  addCollection,
  getCollectionById,
  updateCollection,
  deleteCollection,
} from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { buildLedgerPdf } from "../utils/pdfGenerator.js";
import { recordAudit } from "../utils/audit.js";

const router = Router();

function validatePayload(body) {
  const { name, amount, paymentType, description } = body || {};

  if (!name || !String(name).trim()) {
    return { error: "Name is required" };
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
      name: String(name).trim(),
      amount: numericAmount,
      paymentType,
      description: description ? String(description).trim() : "",
    },
  };
}

router.get("/", (req, res) => {
  const collections = getCollections().sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  res.json(collections);
});

router.post("/", requireAuth, (req, res) => {
  const { error, data } = validatePayload(req.body);
  if (error) return res.status(400).json({ message: error });

  const entry = {
    id: crypto.randomUUID(),
    ...data,
    createdAt: new Date().toISOString(),
  };

  addCollection(entry);
  recordAudit({
    action: "create",
    entityType: "collection",
    entityId: entry.id,
    performedBy: req.user.username,
    before: null,
    after: entry,
  });
  res.status(201).json(entry);
});

router.put("/:id", requireAuth, (req, res) => {
  const existing = getCollectionById(req.params.id);
  if (!existing) return res.status(404).json({ message: "Collection not found" });

  const { error, data } = validatePayload(req.body);
  if (error) return res.status(400).json({ message: error });

  const updated = updateCollection(req.params.id, {
    ...data,
    updatedAt: new Date().toISOString(),
  });

  recordAudit({
    action: "update",
    entityType: "collection",
    entityId: req.params.id,
    performedBy: req.user.username,
    before: existing,
    after: updated,
  });
  res.json(updated);
});

router.delete("/:id", requireAuth, (req, res) => {
  const removed = deleteCollection(req.params.id);
  if (!removed) return res.status(404).json({ message: "Collection not found" });

  recordAudit({
    action: "delete",
    entityType: "collection",
    entityId: req.params.id,
    performedBy: req.user.username,
    before: removed,
    after: null,
  });
  res.json({ message: "Deleted", id: req.params.id });
});

router.get("/pdf", (req, res) => {
  const items = getCollections().sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );
  const doc = buildLedgerPdf({ kind: "collections", items });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `inline; filename="collections-report.pdf"`
  );
  doc.pipe(res);
  doc.end();
});

export default router;
