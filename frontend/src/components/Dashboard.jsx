import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, PlusCircle, ReceiptText, Wallet } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { collectionsApi, expensesApi, summaryApi } from "../api/client";
import { formatCurrency } from "../utils/format";
import StatCard from "./StatCard";
import ActionCard from "./ActionCard";
import RecentEntries from "./RecentEntries";
import PdfModal from "./PdfModal";
import BalanceModal from "./BalanceModal";
import EntryFormModal from "./EntryFormModal";
import ConfirmModal from "./ConfirmModal";
import AuditModal from "./AuditModal";

export default function Dashboard() {
  const { isAuthenticated } = useAuth();

  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);

  const [entries, setEntries] = useState([]);
  const [entriesLoading, setEntriesLoading] = useState(true);

  const [pdfModal, setPdfModal] = useState(null); // 'collections' | 'expenses' | null
  const [balanceOpen, setBalanceOpen] = useState(false);
  const [auditOpen, setAuditOpen] = useState(false);

  const [formModal, setFormModal] = useState(null); // 'collection' | 'expense' | null
  const [editingEntry, setEditingEntry] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadSummary = useCallback(async () => {
    setSummaryLoading(true);
    try {
      const data = await summaryApi.get();
      setSummary(data);
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  const loadEntries = useCallback(async () => {
    if (!isAuthenticated) return;
    setEntriesLoading(true);
    try {
      const [collections, expenses] = await Promise.all([
        collectionsApi.list(),
        expensesApi.list(),
      ]);
      const merged = [
        ...collections.map((c) => ({ ...c, type: "collection" })),
        ...expenses.map((e) => ({ ...e, type: "expense" })),
      ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setEntries(merged);
    } finally {
      setEntriesLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const refreshAll = () => {
    loadSummary();
    loadEntries();
  };

  const openCreateForm = (type) => {
    setEditingEntry(null);
    setFormModal(type);
  };

  const openEditForm = (entry) => {
    setEditingEntry(entry);
    setFormModal(entry.type);
  };

  const closeForm = () => {
    setFormModal(null);
    setEditingEntry(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const api = deleteTarget.type === "collection" ? collectionsApi : expensesApi;
      await api.remove(deleteTarget.id);
      toast.success(`${deleteTarget.type === "collection" ? "Collection" : "Expense"} deleted`);
      setDeleteTarget(null);
      refreshAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete this record.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
      {isAuthenticated && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4"
        >
          <ActionCard
            icon={PlusCircle}
            label="New Collection"
            subtitle="Add a fund received"
            tone="primary"
            onClick={() => openCreateForm("collection")}
          />
          <ActionCard
            icon={ReceiptText}
            label="New Expense"
            subtitle="Add a payment made"
            tone="secondary"
            onClick={() => openCreateForm("expense")}
          />
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <StatCard
          icon={FileText}
          label="Total Collections"
          value={formatCurrency(summary?.totalCollections)}
          subtitle="Tap to view & share PDF report"
          accent="emerald"
          loading={summaryLoading}
          onClick={() => setPdfModal("collections")}
        />
        <StatCard
          icon={ReceiptText}
          label="Total Expenses"
          value={formatCurrency(summary?.totalExpenses)}
          subtitle="Tap to view & share PDF report"
          accent="rose"
          loading={summaryLoading}
          onClick={() => setPdfModal("expenses")}
        />
        <StatCard
          icon={Wallet}
          label="Balance"
          value={formatCurrency(summary?.balance)}
          subtitle="Tap to see GPay & Cash split"
          accent="gold"
          loading={summaryLoading}
          onClick={() => setBalanceOpen(true)}
        />
      </motion.div>

      {isAuthenticated && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4"
        >
          <RecentEntries
            entries={entries}
            loading={entriesLoading}
            onEdit={openEditForm}
            onDelete={setDeleteTarget}
            onOpenAudit={() => setAuditOpen(true)}
          />
        </motion.div>
      )}

      <PdfModal open={pdfModal !== null} kind={pdfModal} onClose={() => setPdfModal(null)} />

      <BalanceModal
        open={balanceOpen}
        onClose={() => setBalanceOpen(false)}
        summary={summary}
        loading={summaryLoading}
      />

      <EntryFormModal
        open={formModal !== null}
        type={formModal}
        editingEntry={editingEntry}
        onClose={closeForm}
        onSaved={refreshAll}
      />

      <ConfirmModal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        submitting={deleting}
        title={deleteTarget?.type === "expense" ? "Delete expense?" : "Delete collection?"}
        message={
          deleteTarget
            ? `This will permanently remove "${deleteTarget.name}" (${formatCurrency(
                deleteTarget.amount
              )}). This action cannot be undone.`
            : ""
        }
      />

      <AuditModal open={auditOpen} onClose={() => setAuditOpen(false)} />
    </main>
  );
}
