import crypto from "crypto";
import { addAuditLog } from "../db.js";

export async function recordAudit({ action, entityType, entityId, performedBy, before, after }) {
  const entry = {
    id: crypto.randomUUID(),
    action,
    entityType,
    entityId,
    performedBy,
    before: before || null,
    after: after || null,
    timestamp: new Date(),
  };
  await addAuditLog(entry);
  return entry;
}
