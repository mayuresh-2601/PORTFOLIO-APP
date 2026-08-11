import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Loader2, AlertCircle } from "lucide-react";
import api from "../../api/axios";

/**
 * AIExplainModal
 *
 * Generic "explain this in plain language" popup. Pass an `endpoint`
 * (relative to /api) and a `payload` — the modal handles loading state,
 * errors, and the fetch itself, so Skills.jsx and Certificates.jsx only
 * need a couple of lines each to use it.
 */
export default function AIExplainModal({ open, onClose, title, endpoint, payload }) {
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    setLoading(true);
    setError("");
    setExplanation("");

    api
      .post(endpoint, payload)
      .then((res) => {
        if (!cancelled) setExplanation(res.data.explanation || res.data.answer || "");
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              "Couldn't load an explanation right now. Please try again shortly."
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, endpoint, JSON.stringify(payload)]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card w-full max-w-md rounded-2xl border border-sky-500/20 p-6"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-sky-400" />
                <h3 className="text-lg font-bold text-white">{title}</h3>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="rounded-full p-1 text-gray-400 transition hover:bg-white/5 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {loading && (
              <div className="flex items-center gap-3 py-6 text-gray-400">
                <Loader2 size={18} className="animate-spin text-sky-400" />
                <span>Thinking it through...</span>
              </div>
            )}

            {!loading && error && (
              <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-300">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {!loading && !error && explanation && (
              <p className="text-sm leading-relaxed text-gray-300">{explanation}</p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
