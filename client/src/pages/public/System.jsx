import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Cpu, MemoryStick, Server, GitBranch, Container, Terminal, Send, Loader2 } from "lucide-react";
import api from "../../api/axios";

const POLL_INTERVAL_MS = 5000;

function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="mb-2 flex items-center gap-2 text-gray-400">
        <Icon size={16} className="text-sky-400" />
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      {sub && <div className="mt-1 text-xs text-gray-500">{sub}</div>}
    </div>
  );
}

function ProgressBar({ percent, warn = 75, danger = 90 }) {
  const color = percent >= danger ? "bg-red-500" : percent >= warn ? "bg-amber-400" : "bg-sky-400";
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
      <motion.div
        className={`h-full rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, percent)}%` }}
        transition={{ duration: 0.6 }}
      />
    </div>
  );
}

function formatUptime(seconds) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export default function System() {
  const [snapshot, setSnapshot] = useState(null);
  const [error, setError] = useState("");
  const [terminalLines, setTerminalLines] = useState([
    "$ connecting to live server metrics...",
  ]);

  const [chatQuestion, setChatQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const terminalEndRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const fetchSnapshot = async () => {
      try {
        const res = await api.get("/system");
        if (cancelled) return;
        const data = res.data.data;
        setSnapshot(data);
        setError("");

        setTerminalLines((prev) => {
          const next = [
            ...prev,
            `$ uptime -> up ${formatUptime(data.host.uptimeSeconds)}, load ${data.cpu.loadPercent}%`,
            `$ free -m -> ${data.memory.usedMB}MB / ${data.memory.totalMB}MB used (${data.memory.usedPercent}%)`,
            data.docker.runningInContainer
              ? "$ cat /.dockerenv -> container detected: this API is running inside Docker"
              : `$ docker --version -> ${data.docker.version || "not available on host"}`,
            data.git.commit ? `$ git rev-parse --short HEAD -> ${data.git.commit} (${data.git.branch})` : null,
          ].filter(Boolean);
          return next.slice(-14); // keep terminal from growing forever
        });
      } catch (err) {
        if (!cancelled) {
          setError("Live metrics unavailable right now — backend may be waking up (free-tier cold start).");
        }
      }
    };

    fetchSnapshot();
    const interval = setInterval(fetchSnapshot, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalLines]);

  const handleAsk = async (e) => {
    e.preventDefault();
    const q = chatQuestion.trim();
    if (!q || chatLoading) return;

    setChatHistory((prev) => [...prev, { role: "user", text: q }]);
    setChatQuestion("");
    setChatLoading(true);

    try {
      const res = await api.post("/ai/ask-about-me", { question: q });
      setChatHistory((prev) => [...prev, { role: "ai", text: res.data.answer }]);
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        {
          role: "ai",
          text:
            err.response?.data?.message ||
            "Couldn't reach the AI assistant right now — please try again shortly.",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <section className="min-h-screen px-6 pb-20 pt-32">
      <div className="mx-auto max-w-6xl space-y-12">
        <div className="space-y-4 text-center">
          <h2 className="text-4xl font-black md:text-5xl">
            Live <span className="text-gradient">System</span>
          </h2>
          <p className="mx-auto max-w-2xl text-gray-400">
            Real metrics pulled live from the server this site runs on — proof of the
            Linux, Docker, and backend monitoring skills listed above, not just a claim on a resume.
          </p>
        </div>

        {error && (
          <div className="glass-card rounded-2xl border border-amber-500/20 p-4 text-center text-sm text-amber-300">
            {error}
          </div>
        )}

        {/* Stat cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Cpu}
            label="CPU Load"
            value={snapshot ? `${snapshot.cpu.loadPercent}%` : "—"}
            sub={snapshot ? `${snapshot.cpu.cores} core(s)` : ""}
          />
          <StatCard
            icon={MemoryStick}
            label="Memory"
            value={snapshot ? `${snapshot.memory.usedPercent}%` : "—"}
            sub={snapshot ? `${snapshot.memory.usedMB}MB / ${snapshot.memory.totalMB}MB` : ""}
          />
          <StatCard
            icon={Server}
            label="Uptime"
            value={snapshot ? formatUptime(snapshot.host.uptimeSeconds) : "—"}
            sub={snapshot ? snapshot.host.platform : ""}
          />
          <StatCard
            icon={Container}
            label="Environment"
            value={snapshot ? (snapshot.docker.runningInContainer ? "Docker" : "Bare Node") : "—"}
            sub={snapshot ? `Node ${snapshot.host.nodeVersion}` : ""}
          />
        </div>

        {/* Progress bars for a more visual read */}
        {snapshot && (
          <div className="glass-card grid gap-6 rounded-2xl p-6 sm:grid-cols-2">
            <div>
              <div className="mb-2 flex justify-between text-sm text-gray-400">
                <span>CPU</span>
                <span>{snapshot.cpu.loadPercent}%</span>
              </div>
              <ProgressBar percent={snapshot.cpu.loadPercent} />
            </div>
            <div>
              <div className="mb-2 flex justify-between text-sm text-gray-400">
                <span>Memory</span>
                <span>{snapshot.memory.usedPercent}%</span>
              </div>
              <ProgressBar percent={snapshot.memory.usedPercent} />
            </div>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Terminal-style live log */}
          <div className="glass-card overflow-hidden rounded-2xl">
            <div className="flex items-center gap-2 border-b border-white/5 px-5 py-3 text-gray-400">
              <Terminal size={16} className="text-sky-400" />
              <span className="text-xs font-medium uppercase tracking-wide">Live Server Log</span>
            </div>
            <div className="h-72 overflow-y-auto p-5 font-mono text-xs leading-relaxed text-emerald-400">
              {terminalLines.map((line, i) => (
                <div key={i} className="whitespace-pre-wrap">
                  {line}
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>
          </div>

          {/* Ask AI about me */}
          <div className="glass-card flex flex-col overflow-hidden rounded-2xl">
            <div className="flex items-center gap-2 border-b border-white/5 px-5 py-3 text-gray-400">
              <Send size={16} className="text-sky-400" />
              <span className="text-xs font-medium uppercase tracking-wide">Ask AI About Mayuresh</span>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-5 text-sm">
              {chatHistory.length === 0 && (
                <p className="text-gray-500">
                  Try: "What DevOps skills does he have?" or "Is he ready for a full-stack role?"
                </p>
              )}
              {chatHistory.map((msg, i) => (
                <div
                  key={i}
                  className={`rounded-xl p-3 ${
                    msg.role === "user"
                      ? "ml-8 bg-sky-500/10 text-sky-100"
                      : "mr-8 bg-white/5 text-gray-300"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              {chatLoading && (
                <div className="mr-8 flex items-center gap-2 rounded-xl bg-white/5 p-3 text-gray-400">
                  <Loader2 size={14} className="animate-spin" />
                  Thinking...
                </div>
              )}
            </div>

            <form onSubmit={handleAsk} className="flex gap-2 border-t border-white/5 p-4">
              <input
                type="text"
                value={chatQuestion}
                onChange={(e) => setChatQuestion(e.target.value)}
                placeholder="Ask a question..."
                maxLength={300}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-sky-400/50"
              />
              <button
                type="submit"
                disabled={chatLoading || !chatQuestion.trim()}
                className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-400 disabled:opacity-40"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <GitBranch size={14} />
          {snapshot?.git.commit
            ? `Deployed from commit ${snapshot.git.commit} on ${snapshot.git.branch}`
            : "Git metadata unavailable in this environment"}
        </div>
      </div>
    </section>
  );
}
