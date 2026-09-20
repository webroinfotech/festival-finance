import { useEffect, useRef, useState } from "react";
import { Download, FileText, Loader2, Share2 } from "lucide-react";
import toast from "react-hot-toast";
import Modal from "./Modal";
import client from "../api/client";

export default function PdfModal({ open, onClose, kind }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [blob, setBlob] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const objectUrlRef = useRef(null);

  const isCollections = kind === "collections";
  const title = isCollections ? "Total Collections Report" : "Total Expenses Report";
  const fileName = isCollections ? "collections-report.pdf" : "expenses-report.pdf";
  const endpoint = isCollections ? "/collections/pdf" : "/expenses/pdf";

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    setLoading(true);
    setError("");
    setBlob(null);

    client
      .get(endpoint, { responseType: "blob" })
      .then((res) => {
        if (cancelled) return;
        setBlob(res.data);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load the report. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, endpoint]);

  useEffect(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    if (blob) {
      const url = URL.createObjectURL(blob);
      objectUrlRef.current = url;
      setPdfUrl(url);
    } else {
      setPdfUrl(null);
    }
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, [blob]);

  const handleDownload = () => {
    if (!pdfUrl) return;
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Downloaded!");
  };

  const handleShare = async () => {
    if (!blob) return;
    const file = new File([blob], fileName, { type: "application/pdf" });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title,
          text: `Festival Amount Maintenance — ${title}`,
        });
      } catch (err) {
        if (err?.name !== "AbortError") {
          toast.error("Sharing was cancelled or failed.");
        }
      }
    } else {
      handleDownload();
      toast("Sharing isn't supported on this browser — downloaded instead.", { icon: "ℹ️" });
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={title} subtitle="View, download or share as PDF" icon={FileText} maxWidth="max-w-3xl">
      <div className="space-y-4">
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/30 h-[60vh] grid place-items-center">
          {loading && (
            <div className="flex flex-col items-center gap-2 text-gray-400">
              <Loader2 size={28} className="animate-spin text-amber-400" />
              <p className="text-sm">Preparing your report...</p>
            </div>
          )}
          {!loading && error && <p className="text-sm text-rose-400 px-6 text-center">{error}</p>}
          {!loading && !error && pdfUrl && (
            <iframe title={title} src={pdfUrl} className="w-full h-full" />
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleDownload}
            disabled={!blob}
            className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-sm rounded-xl py-3 transition-colors disabled:opacity-50"
          >
            <Download size={16} /> Download
          </button>
          <button
            onClick={handleShare}
            disabled={!blob}
            className="flex-1 flex items-center justify-center gap-2 gold-btn font-bold text-sm rounded-xl py-3 disabled:opacity-50"
          >
            <Share2 size={16} /> Share
          </button>
        </div>
      </div>
    </Modal>
  );
}
