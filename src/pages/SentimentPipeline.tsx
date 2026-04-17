import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AppHeader } from "@/components/sellezy/AppHeader";
import { PageWrapper } from "@/components/sellezy/PageWrapper";
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

export default function SentimentPipeline() {
  const { role } = useAuth();
  const [cat, setCat] = useState<"Electronics" | "FMCG" | "Apparel">("Electronics");
  if (role !== "producer") return <Navigate to="/home" replace />;

  return (
    <>
      <AppHeader />
      <PageWrapper>
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
            <div className="grid md:grid-cols-3 gap-4">
              <div className="border-l-4 border-destructive bg-destructive/10 rounded-md p-4">
                <AlertCircle className="w-5 h-5 text-destructive mb-2" />
                <div className="text-xs font-mono text-destructive uppercase">Urgent</div>
                <div className="font-display font-bold mt-1">FMCG Packaging Defect</div>
                <p className="text-xs text-muted-foreground mt-1">3 batches affected this week.</p>
                <button className="text-xs text-primary-glow font-mono mt-3 hover:underline">Details →</button>
              </div>
              <div className="border-l-4 border-warning bg-warning/10 rounded-md p-4">
                <AlertTriangle className="w-5 h-5 text-warning mb-2" />
                <div className="text-xs font-mono text-warning uppercase">Monitor</div>
                <div className="font-display font-bold mt-1">Electronics Delivery SLA</div>
                <p className="text-xs text-muted-foreground mt-1">Tamil Nadu showing decline.</p>
                <button className="text-xs text-primary-glow font-mono mt-3 hover:underline">Details →</button>
              </div>
              <div className="border-l-4 border-success bg-success/10 rounded-md p-4">
                <CheckCircle2 className="w-5 h-5 text-success mb-2" />
                <div className="text-xs font-mono text-success uppercase">Positive</div>
                <div className="font-display font-bold mt-1">Apparel Durability</div>
                <p className="text-xs text-muted-foreground mt-1">Score at 76% — highlight in marketing.</p>
                <button className="text-xs text-primary-glow font-mono mt-3 hover:underline">Details →</button>
              </div>
            </div>
          </Stage>
        </main>
      </PageWrapper>
    </>
  );
}
