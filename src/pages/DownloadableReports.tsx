import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AppHeader } from "@/components/sellezy/AppHeader";
import { PageWrapper } from "@/components/sellezy/PageWrapper";
import { GlassCard } from "@/components/sellezy/GlassCard";
import { DownloadButton } from "@/components/sellezy/DownloadButton";
import { LANGUAGES } from "@/lib/mockData";
import { FileText, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const CATS = ["Electronics", "FMCG", "Apparel"];
const STAGES = ["All stages", "Noise Report", "Sentiment", "Quality", "Recommendations"];
const SENTIMENTS = ["All", "Positive", "Negative", "Neutral"];

const MOCK_REPORTS = [
  { name: "Sentiment Summary — Electronics", date: "Apr 12, 2026", size: "2.4 MB", category: "Electronics" },
  { name: "Quality Anomalies — FMCG (Q1)", date: "Apr 10, 2026", size: "1.1 MB", category: "FMCG" },
  { name: "Multilingual Coverage — Apparel", date: "Apr 09, 2026", size: "880 KB", category: "Apparel" },
];

const formatColor: Record<string, string> = {
  CSV: "text-success border-success/40 bg-success/10",
  JSON: "text-primary-glow border-primary/40 bg-primary/10",
  PDF: "text-destructive border-destructive/40 bg-destructive/10",
};

const downloadCSV = (name: string) => {
  const headers = ["reviewId", "product", "sentiment", "score", "language", "stage"];
  const rows = Array.from({ length: 10 }).map((_, i) => [
    `R-${1000 + i}`, `Product ${i + 1}`, ["positive", "neutral", "negative"][i % 3],
    Math.floor(Math.random() * 100), ["EN", "HI", "TA", "BN", "MR", "Hinglish"][i % 6], "Stage 2",
  ].join(","));
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  triggerDownload(blob, name.replace(/\s+/g, "-").toLowerCase() + ".csv");
};

const downloadJSON = (name: string) => {
  const data = Array.from({ length: 10 }).map((_, i) => ({
    reviewId: `R-${1000 + i}`, product: `Product ${i + 1}`,
    sentiment: ["positive", "neutral", "negative"][i % 3],
    score: Math.floor(Math.random() * 100),
    language: ["EN", "HI", "TA", "BN", "MR", "Hinglish"][i % 6], stage: "Stage 2",
  }));
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  triggerDownload(blob, name.replace(/\s+/g, "-").toLowerCase() + ".json");
};

const triggerDownload = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export default function DownloadableReports() {
  const { role } = useAuth();
  const [cats, setCats] = useState<string[]>(["Electronics"]);
  const [range, setRange] = useState("Last 30 days");
  const [langs, setLangs] = useState<string[]>(["EN"]);
  const [sentiment, setSentiment] = useState("All");
  const [stage, setStage] = useState("All stages");
  const [format, setFormat] = useState<"CSV" | "JSON" | "PDF">("CSV");
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState<typeof MOCK_REPORTS | null>(null);

  if (role !== "producer") return <Navigate to="/home" replace />;

  const toggleArr = (arr: string[], v: string, setter: (a: string[]) => void) =>
    setter(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const generate = () => {
    setLoading(true); setReports(null);
    setTimeout(() => { setLoading(false); setReports(MOCK_REPORTS); }, 1500);
  };

  const handleDownload = (name: string) => {
    if (format === "PDF") {
      toast.info("PDF export requires backend — scaffold ready");
      return;
    }
    if (format === "CSV") downloadCSV(name);
    else downloadJSON(name);
    toast.success(`${format} downloaded: ${name}`);
  };

  return (
    <>
      <AppHeader />
      <PageWrapper>
        <main className="container py-10 space-y-6">
          <div>
            <h1 className="font-display font-extrabold text-3xl md:text-5xl">Downloadable Reports</h1>
            <p className="text-muted-foreground mt-1">Generate and export role-specific intelligence reports.</p>
          </div>

          <div className="grid md:grid-cols-[300px_1fr] gap-6">
            {/* Filters */}
            <GlassCard hoverable={false} className="space-y-5 h-fit sticky top-20">
              <div>
                <label className="text-xs font-mono text-muted-foreground uppercase">Category</label>
                <div className="mt-2 space-y-1.5">
                  {CATS.map((c) => (
                    <label key={c} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={cats.includes(c)} onChange={() => toggleArr(cats, c, setCats)} className="accent-primary" />
                      {c}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-mono text-muted-foreground uppercase">Date Range</label>
                <select value={range} onChange={(e) => setRange(e.target.value)} className="mt-2 w-full bg-input/60 border border-primary/20 rounded-md px-3 py-2 text-sm">
                  <option>Last 7 days</option><option>Last 30 days</option><option>Last 90 days</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-mono text-muted-foreground uppercase">Sentiment</label>
                <select value={sentiment} onChange={(e) => setSentiment(e.target.value)} className="mt-2 w-full bg-input/60 border border-primary/20 rounded-md px-3 py-2 text-sm">
                  {SENTIMENTS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-mono text-muted-foreground uppercase">Stage</label>
                <select value={stage} onChange={(e) => setStage(e.target.value)} className="mt-2 w-full bg-input/60 border border-primary/20 rounded-md px-3 py-2 text-sm">
                  {STAGES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <button onClick={generate} className="btn-glow w-full inline-flex items-center justify-center gap-2 py-3 rounded-md font-mono">
                <Sparkles className="w-4 h-4" /> Generate Report
              </button>
            </GlassCard>

            {/* Reports list */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-xl">Available Reports</h2>
                <div className="flex gap-1.5">
                  {(["CSV", "JSON", "PDF"] as const).map((f) => (
                    <button key={f} onClick={() => setFormat(f)}
                      className={`px-3 py-1.5 rounded-full text-xs font-mono border transition-all ${format === f ? "bg-primary text-primary-foreground border-primary" : "border-primary/30 hover:border-primary"}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {loading && (
                <div className="space-y-3">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="glass-card p-4 animate-pulse">
                      <div className="h-4 bg-primary/15 rounded w-2/3 mb-2" />
                      <div className="h-3 bg-primary/10 rounded w-1/3" />
                    </div>
                  ))}
                </div>
              )}

              {!loading && reports && reports.map((r, i) => (
                <motion.div key={r.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                  <GlassCard hoverable={false} className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-md border ${formatColor[format]}`}>
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-display font-bold truncate">{r.name}</div>
                      <div className="text-xs text-muted-foreground font-mono mt-0.5">
                        {r.date} · {r.size} · <span className="text-primary-glow">{r.category}</span>
                      </div>
                    </div>
                    <DownloadButton format={format} onClick={() => handleDownload(r.name)} />
                  </GlassCard>
                </motion.div>
              ))}

              {!loading && !reports && (
                <GlassCard hoverable={false} className="text-center py-12 text-muted-foreground">
                  <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  Select filters and click "Generate Report" to start.
                </GlassCard>
              )}
            </div>
          </div>
        </main>
      </PageWrapper>
    </>
  );
}
