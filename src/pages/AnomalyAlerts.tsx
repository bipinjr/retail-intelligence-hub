import { useState, useMemo } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LanguageContext";
import { AppHeader } from "@/components/sellezy/AppHeader";
import { PageWrapper, stagger } from "@/components/sellezy/PageWrapper";
import { GlassCard } from "@/components/sellezy/GlassCard";
import { motion, AnimatePresence } from "framer-motion";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceDot } from "recharts";
import { ANOMALY_ALERTS, ANOMALY_TIMELINE } from "@/lib/mockData";
import { AlertCircle, AlertTriangle, CheckCircle2, MapPin, Layers } from "lucide-react";

const TABS = ["All", "critical", "warning", "resolved"] as const;
const sevColor: Record<string, string> = {
  critical: "border-destructive bg-destructive/10",
  warning: "border-warning bg-warning/10",
  resolved: "border-success bg-success/10",
};
const sevIcon: Record<string, any> = { critical: AlertCircle, warning: AlertTriangle, resolved: CheckCircle2 };
const sevText: Record<string, string> = { critical: "text-destructive", warning: "text-warning", resolved: "text-success" };

export default function AnomalyAlerts() {
  const { role } = useAuth();
  const { t } = useLang();
  const [tab, setTab] = useState<typeof TABS[number]>("All");
  const [resolved, setResolved] = useState<number[]>([]);
  const list = useMemo(() => {
    return ANOMALY_ALERTS.map((a) => ({ ...a, severity: resolved.includes(a.id) ? "resolved" : a.severity }))
      .filter((a) => tab === "All" || a.severity === tab);
  }, [tab, resolved]);
  if (role !== "producer") return <Navigate to="/home" replace />;

  return (
    <>
      <AppHeader />
      <PageWrapper>
        <main className="container py-10 space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="font-display font-extrabold text-3xl md:text-5xl">{t("pt_anomaly")}</h1>
              <p className="text-muted-foreground mt-1">{t("pt_anomaly_sub")}</p>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono bg-success/10 border border-success/30 text-success">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
              </span>
              Monitoring Active
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {TABS.map((s) => (
              <button key={s} onClick={() => setTab(s)}
                className={`px-4 py-2 rounded-full text-xs font-mono uppercase border transition-all ${tab === s ? "bg-primary text-primary-foreground border-primary" : "border-primary/30 hover:border-primary"}`}>
                {s === "All" ? "All" : s === "critical" ? "Critical 🔴" : s === "warning" ? "Warning 🟡" : "Resolved ✅"}
              </button>
            ))}
          </div>

          <motion.div variants={stagger.container} initial="hidden" animate="visible" className="space-y-3">
            <AnimatePresence>
              {list.map((a) => {
                const Icon = sevIcon[a.severity];
                return (
                  <motion.div key={a.id} variants={stagger.item} layout
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                    <GlassCard hoverable={false} className={`!p-0 border-l-4 ${sevColor[a.severity]}`}>
                      <div className="p-4 flex flex-wrap gap-4 items-start">
                        <Icon className={`w-6 h-6 shrink-0 ${sevText[a.severity]}`} />
                        <div className="flex-1 min-w-[200px]">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] font-mono uppercase ${sevText[a.severity]}`}>{a.severity}</span>
                            <span className="text-[10px] font-mono text-muted-foreground">· {a.time}</span>
                          </div>
                          <div className="font-display font-bold">{a.title}</div>
                          <div className="text-xs text-muted-foreground">{a.desc}</div>
                          <div className="flex flex-wrap gap-3 mt-2 text-[11px] font-mono text-muted-foreground">
                            <span className="inline-flex items-center gap-1"><Layers className="w-3 h-3" /> {a.category}</span>
                            <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" /> {a.region}</span>
                            <span>· {a.batch}</span>
                          </div>
                          <div className="text-xs text-foreground/85 mt-2 font-mono">{a.change}</div>
                        </div>
                        <div className="flex flex-col gap-2 shrink-0">
                          <Link to="/producer/sentiment" className="text-xs font-mono text-primary-glow hover:underline whitespace-nowrap">
                            {t("viewPipelineStage")} →
                          </Link>
                          {a.severity !== "resolved" && (
                            <button onClick={() => setResolved((r) => [...r, a.id])}
                              className="text-xs font-mono px-2 py-1 rounded-md border border-success/40 text-success hover:bg-success/15">
                              {t("markResolved")}
                            </button>
                          )}
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          <GlassCard hoverable={false}>
            <h2 className="font-display font-bold text-xl mb-4">Anomaly Timeline</h2>
            <div className="h-72">
              <ResponsiveContainer>
                <LineChart data={ANOMALY_TIMELINE}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(174 62% 47% / 0.15)" />
                  <XAxis dataKey="week" stroke="hsl(203 33% 62%)" fontSize={11} />
                  <YAxis stroke="hsl(203 33% 62%)" fontSize={11} />
                  <Tooltip contentStyle={{ background: "hsl(218 60% 15%)", border: "1px solid hsl(174 62% 47% / 0.4)", borderRadius: 8 }} />
                  <Line type="monotone" dataKey="count" stroke="hsl(174 62% 47%)" strokeWidth={2} dot={{ r: 3 }} />
                  {ANOMALY_TIMELINE.map((d, i) => d.critical >= 2 && (
                    <ReferenceDot key={i} x={d.week} y={d.count} r={6} fill="hsl(0 75% 60%)" stroke="white" />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </main>
      </PageWrapper>
    </>
  );
}
