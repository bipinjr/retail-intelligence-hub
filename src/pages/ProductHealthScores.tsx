import { stagger } from "@/components/sellezy/PageWrapper";
import { useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LanguageContext";

import { GlassCard } from "@/components/sellezy/GlassCard";
import { SentimentBar } from "@/components/sellezy/SentimentBar";
import { motion } from "framer-motion";
import { Search, ArrowUp, ArrowDown, Minus } from "lucide-react";
import { PRODUCT_HEALTH } from "@/lib/mockData";

const CATS = ["Electronics", "FMCG", "Apparel"] as const;

const ringColor = (s: number) =>
  s >= 75 ? "hsl(142 65% 45%)" : s >= 50 ? "hsl(27 87% 67%)" : "hsl(0 75% 60%)";

const HealthRing = ({ score }: { score: number }) => {
  const c = 2 * Math.PI * 28;
  const dash = (score / 100) * c;
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" className="-rotate-90">
      <circle cx="36" cy="36" r="28" stroke="hsl(218 60% 22%)" strokeWidth="6" fill="none" />
      <motion.circle
        cx="36" cy="36" r="28" stroke={ringColor(score)} strokeWidth="6" fill="none" strokeLinecap="round"
        initial={{ strokeDasharray: `0 ${c}` }}
        animate={{ strokeDasharray: `${dash} ${c}` }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      <text x="36" y="40" textAnchor="middle" className="font-display font-bold text-sm fill-foreground rotate-90" transform="rotate(90 36 36)">
        {score}%
      </text>
    </svg>
  );
};

export default function ProductHealthScores() {
  const { role } = useAuth();
  const { t } = useLang();
  const [cat, setCat] = useState<typeof CATS[number]>("Electronics");
  const [q, setQ] = useState("");
  const products = useMemo(
    () => PRODUCT_HEALTH[cat].filter((p) => p.name.toLowerCase().includes(q.toLowerCase())),
    [cat, q]
  );
  const lowScoring = PRODUCT_HEALTH[cat].filter((p) => p.score < 75);
  if (role !== "producer") return <Navigate to="/home" replace />;

  return (
    <>
        <main className="container py-10 space-y-6">
          <div>
            <h1 className="font-display font-extrabold text-3xl md:text-5xl">{t("pt_health")}</h1>
            <p className="text-muted-foreground mt-1">{t("pt_health_sub")}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex gap-2">
              {CATS.map((c) => (
                <button key={c} onClick={() => setCat(c)}
                  className={`px-4 py-2 rounded-full text-sm font-mono border transition-all ${cat === c ? "bg-primary text-primary-foreground border-primary" : "border-primary/30 hover:border-primary"}`}>
                  {c}
                </button>
              ))}
            </div>
            <div className="relative ml-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search product…"
                className="bg-input/60 border border-primary/20 rounded-md pl-9 pr-3 py-2 text-sm focus:border-primary focus:outline-none w-64" />
            </div>
          </div>

          <motion.section variants={stagger.container} initial="hidden" animate="visible" className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((p) => (
              <motion.div key={p.name} variants={stagger.item}>
                <GlassCard className="h-full space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-display font-bold">{p.name}</div>
                      <span className="text-[10px] font-mono text-primary-glow border border-primary/40 rounded-full px-2 py-0.5 inline-block mt-1">{cat}</span>
                    </div>
                    <HealthRing score={p.score} />
                  </div>
                  <div className="space-y-1.5 pt-2 border-t border-primary/10">
                    <SentimentBar label="Quality" score={p.quality} />
                    <SentimentBar label="Durability" score={p.durability} />
                    <SentimentBar label="Packaging" score={p.packaging} />
                    <SentimentBar label="Delivery" score={p.delivery} />
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-primary/10">
                    <span className={`inline-flex items-center gap-1 text-xs font-mono ${p.trend === "up" ? "text-success" : p.trend === "down" ? "text-destructive" : "text-muted-foreground"}`}>
                      {p.trend === "up" ? <ArrowUp className="w-3 h-3" /> : p.trend === "down" ? <ArrowDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                      {p.trend === "up" ? "Improving" : p.trend === "down" ? "Declining" : "Stable"}
                    </span>
                    <button className="text-xs font-mono text-primary-glow hover:underline">View Details →</button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.section>

          {lowScoring.length > 0 && (
            <section>
              <h2 className="font-display font-bold text-lg mb-3">Defect Alerts</h2>
              <div className="flex gap-3 overflow-x-auto pb-3">
                {lowScoring.map((p) => (
                  <div key={p.name}
                    className={`shrink-0 px-4 py-2 rounded-full text-xs font-mono border ${p.score < 65 ? "bg-destructive/15 border-destructive/40 text-destructive" : "bg-warning/15 border-warning/40 text-warning"}`}>
                    ⚠ {p.name} — {p.score}%
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </>
  );
}
