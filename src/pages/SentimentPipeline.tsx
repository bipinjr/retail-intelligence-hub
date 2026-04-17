import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

import { GlassCard } from "@/components/sellezy/GlassCard";
import { AnomalyAlert } from "@/components/sellezy/AnomalyAlert";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, ReferenceDot,
} from "recharts";
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PIPELINE_LANG_BREAKDOWN, SENTIMENT_FEATURE_DATA, QUALITY_TIMESERIES } from "@/lib/mockData";

const STAGE1_NOISE = [
  { type: "Spam Flagged", count: 412 },
  { type: "Duplicates", count: 287 },
  { type: "Bot-generated", count: 182 },
  { type: "Clean", count: 3940 },
];

const Stage = ({ num, title, children, defaultOpen }: { num: number; title: string; children: React.ReactNode; defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <GlassCard hoverable={false} topAccent className="!p-0 overflow-hidden">
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between p-5 text-left">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center font-mono text-primary-glow text-sm">
            {num}
          </div>
          <div>
            <div className="text-[10px] font-mono text-muted-foreground uppercase">Stage {num}</div>
            <h3 className="font-display font-bold text-lg">{title}</h3>
          </div>
        </div>
        {open ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-5 pt-0">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
};

const SOLUTIONS = [
  {
    key: "urgent" as const,
    severity: "Urgent",
    severityColor: "text-destructive",
    border: "border-destructive bg-destructive/10",
    icon: AlertCircle,
    title: "FMCG Packaging Defect",
    sub: "3 batches affected this week.",
    detail: [
      ["Affected Batches", "#A201, #A202, #A204"],
      ["Root Cause", "Packaging seal failure — supplier batch"],
      ["Impacted Region", "Maharashtra, Karnataka"],
      ["Complaint Volume", "142 reviews flagged"],
      ["Recommended Action", "Pause dispatch, contact supplier, issue replacement"],
      ["Responsible Team", "Quality Assurance → Supply Chain Lead"],
      ["Timeline", "Immediate (within 48h)"],
    ],
  },
  {
    key: "monitor" as const,
    severity: "Monitor",
    severityColor: "text-warning",
    border: "border-warning bg-warning/10",
    icon: AlertTriangle,
    title: "Electronics Delivery SLA",
    sub: "Tamil Nadu showing decline.",
    detail: [
      ["Affected SKUs", "3 electronics products (smartphones, earphones)"],
      ["Region", "Tamil Nadu (Chennai hub — 38% SLA breach rate)"],
      ["Trend", "SLA score dropped from 84% → 67% over 4 weeks"],
      ["Recommended Action", "Escalate to logistics partner, review last-mile ops"],
      ["Responsible Team", "Logistics Ops → Regional Manager"],
      ["Timeline", "5–7 business days"],
    ],
  },
  {
    key: "positive" as const,
    severity: "Positive",
    severityColor: "text-success",
    border: "border-success bg-success/10",
    icon: CheckCircle2,
    title: "Apparel Durability",
    sub: "Score at 76% — highlight in marketing.",
    detail: [
      ["Top Performing Products", "Cotton kurtas, denim jackets"],
      ["Durability Score", "76% positive (up from 61% last quarter)"],
      ["Customer Quotes", "\"Lasted 2 monsoons!\", \"Stitching holds well\""],
      ["Recommended Action", "Feature in marketing campaigns, push social proof"],
      ["Responsible Team", "Marketing → Brand Manager"],
      ["Timeline", "Next campaign cycle"],
    ],
  },
];

const BusinessSolutions = () => {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-3 gap-4">
        {SOLUTIONS.map((s) => (
          <div key={s.key} className={`border-l-4 rounded-md p-4 ${s.border}`}>
            <s.icon className={`w-5 h-5 mb-2 ${s.severityColor}`} />
            <div className={`text-xs font-mono uppercase ${s.severityColor}`}>{s.severity}</div>
            <div className="font-display font-bold mt-1">{s.title}</div>
            <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
            <button onClick={() => setOpen(open === s.key ? null : s.key)} className="text-xs text-primary-glow font-mono mt-3 hover:underline">
              {open === s.key ? "Hide details" : "Details →"}
            </button>
          </div>
        ))}
      </div>
      <AnimatePresence>
        {open && (() => {
          const s = SOLUTIONS.find((x) => x.key === open)!;
          return (
            <motion.div
              key={s.key}
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className={`glass-card border-l-4 ${s.border} p-5 mt-2`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <s.icon className={`w-5 h-5 ${s.severityColor}`} />
                    <div className="font-display font-bold">{s.title} — Action Plan</div>
                  </div>
                  <button onClick={() => setOpen(null)} className="text-xs font-mono text-muted-foreground hover:text-primary-glow">Close ×</button>
                </div>
                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
                  {s.detail.map(([label, val]) => (
                    <div key={label} className="text-xs">
                      <div className="text-muted-foreground font-mono uppercase tracking-wider text-[10px]">{label}</div>
                      <div className="text-foreground/90 mt-0.5">{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
};

export default function SentimentPipeline() {
  const { role } = useAuth();
  const [cat, setCat] = useState<"Electronics" | "FMCG" | "Apparel">("Electronics");
  if (role !== "producer") return <Navigate to="/home" replace />;

  return (
    <>
        <main className="container py-10 space-y-6">
          <div>
            <h1 className="font-display font-extrabold text-3xl md:text-5xl">Sentiment Pipeline</h1>
            <p className="text-muted-foreground mt-1">Live status across the 4-stage AI processing pipeline.</p>
          </div>

          <Stage num={1} title="Noise Reduction" defaultOpen>
            <p className="text-sm text-muted-foreground mb-4">
              <span className="text-primary-glow font-mono">4,821 reviews ingested → 3,940 passed</span> (18.2% filtered).
            </p>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="h-56">
                <ResponsiveContainer>
                  <BarChart data={STAGE1_NOISE}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(174 62% 47% / 0.15)" />
                    <XAxis dataKey="type" stroke="hsl(203 33% 62%)" fontSize={11} />
                    <YAxis stroke="hsl(203 33% 62%)" fontSize={11} />
                    <Tooltip contentStyle={{ background: "hsl(218 60% 15%)", border: "1px solid hsl(174 62% 47% / 0.4)", borderRadius: 8 }} />
                    <Bar dataKey="count" fill="hsl(174 62% 47%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="h-56">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={PIPELINE_LANG_BREAKDOWN} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={2}>
                      {PIPELINE_LANG_BREAKDOWN.map((e, i) => <Cell key={i} fill={e.fill} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: "hsl(218 60% 15%)", border: "1px solid hsl(174 62% 47% / 0.4)", borderRadius: 8 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Stage>

          <Stage num={2} title="Sentiment Analysis">
            <div className="flex gap-2 mb-4">
              {(["Electronics", "FMCG", "Apparel"] as const).map((c) => (
                <button
                  key={c} onClick={() => setCat(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-mono border transition-all ${cat === c ? "bg-primary text-primary-foreground border-primary" : "border-primary/30 text-foreground hover:border-primary"}`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="h-72">
              <ResponsiveContainer>
                <BarChart data={SENTIMENT_FEATURE_DATA[cat]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(174 62% 47% / 0.15)" />
                  <XAxis dataKey="feature" stroke="hsl(203 33% 62%)" fontSize={11} />
                  <YAxis stroke="hsl(203 33% 62%)" fontSize={11} />
                  <Tooltip contentStyle={{ background: "hsl(218 60% 15%)", border: "1px solid hsl(174 62% 47% / 0.4)", borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="positive" stackId="a" fill="hsl(174 62% 47%)" />
                  <Bar dataKey="neutral" stackId="a" fill="hsl(203 33% 62%)" />
                  <Bar dataKey="negative" stackId="a" fill="hsl(0 75% 60%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Stage>

          <Stage num={3} title="Quality Inference">
            <p className="text-sm text-muted-foreground mb-3">12-week sentiment trajectory with anomaly detection.</p>
            <div className="h-72">
              <ResponsiveContainer>
                <LineChart data={QUALITY_TIMESERIES}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(174 62% 47% / 0.15)" />
                  <XAxis dataKey="week" stroke="hsl(203 33% 62%)" fontSize={11} />
                  <YAxis stroke="hsl(203 33% 62%)" fontSize={11} domain={[50, 100]} />
                  <Tooltip contentStyle={{ background: "hsl(218 60% 15%)", border: "1px solid hsl(174 62% 47% / 0.4)", borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="Electronics" stroke="hsl(174 62% 47%)" strokeWidth={2} />
                  <Line type="monotone" dataKey="FMCG" stroke="hsl(27 87% 67%)" strokeWidth={2} />
                  <Line type="monotone" dataKey="Apparel" stroke="hsl(169 100% 55%)" strokeWidth={2} />
                  <ReferenceDot x="W8" y={QUALITY_TIMESERIES[7].Electronics} r={6} fill="hsl(0 75% 60%)" stroke="white" />
                  <ReferenceDot x="W5" y={QUALITY_TIMESERIES[4].FMCG} r={6} fill="hsl(0 75% 60%)" stroke="white" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <AnomalyAlert title="Anomaly: Week 8 Electronics" detail="Sudden drop detected — packaging complaints spiked." />
          </Stage>

          <Stage num={4} title="Business Solutions">
            <BusinessSolutions />
          </Stage>
        </main>
      </>
  );
}
