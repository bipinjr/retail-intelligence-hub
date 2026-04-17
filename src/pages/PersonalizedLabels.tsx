import { stagger } from "@/components/sellezy/PageWrapper";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LanguageContext";

import { GlassCard } from "@/components/sellezy/GlassCard";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Users, Briefcase, Dumbbell, ChevronDown, ExternalLink, Sparkles } from "lucide-react";
import { PERSONA_PRODUCTS } from "@/lib/mockData";

const PERSONAS = [
  { key: "Student", icon: GraduationCap, label: "🎓 Student" },
  { key: "Family", icon: Users, label: "👨‍👩‍👧 Family" },
  { key: "Professional", icon: Briefcase, label: "💼 Professional" },
  { key: "Heavy User", icon: Dumbbell, label: "🏋️ Heavy User" },
] as const;

const personaLabel = (k: string) => k === "Student" ? "Best for Students" : k === "Family" ? "Good for Family Use" : k === "Professional" ? "Best for Office" : "Heavy Users Only";

export default function PersonalizedLabels() {
  const { role } = useAuth();
  const { t } = useLang();
  const [persona, setPersona] = useState<typeof PERSONAS[number]["key"]>("Student");
  const [openCard, setOpenCard] = useState<string | null>(null);

  if (role !== "consumer") return <Navigate to="/home" replace />;

  const products = PERSONA_PRODUCTS[persona] ?? [];

  return (
    <>
        <main className="container py-10 space-y-6">
          <div>
            <h1 className="font-display font-extrabold text-3xl md:text-5xl">{t("pt_labels")}</h1>
            <p className="text-muted-foreground mt-1">{t("pt_labels_sub")}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {PERSONAS.map((p) => (
              <button key={p.key} onClick={() => setPersona(p.key)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-mono border transition-all ${persona === p.key ? "bg-accent text-bg-primary border-accent" : "border-primary/30 hover:border-primary"}`}>
                {p.label}
              </button>
            ))}
          </div>

          <GlassCard hoverable={false} className="bg-primary/10 !border-primary/30 flex items-start gap-3 text-sm">
            <Sparkles className="w-4 h-4 text-primary-glow shrink-0 mt-0.5" />
            <div>💡 Based on 3,940 verified reviews, here are the top picks for <span className="text-primary-glow">{personaLabel(persona)}</span>.</div>
          </GlassCard>

          <motion.section key={persona} variants={stagger.container} initial="hidden" animate="visible" className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((p) => {
              const open = openCard === (p?.name || "Unknown");
              return (
                <motion.div key={(p?.name || "Unknown")} variants={stagger.item}>
                  <GlassCard hoverable={false} className="h-full space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-display font-bold">{(p?.name || "Unknown")}</div>
                        <span className="text-[10px] font-mono text-primary-glow border border-primary/40 rounded-full px-2 py-0.5 inline-block mt-1">{(p?.category || "General")}</span>
                      </div>
                      <span className="px-2 py-1 rounded-full text-xs bg-success/15 text-success border border-success/40 font-mono">
                        {(p?.score || 0)}% ✅
                      </span>
                    </div>
                    <span className="inline-block px-2 py-1 rounded-full text-[10px] font-mono bg-accent/15 text-accent border border-accent/30">
                      {personaLabel(persona)}
                    </span>
                    <div className="text-xs text-muted-foreground font-mono">{(p?.price || "Price unavailable")}</div>
                    <ul className="space-y-1">
                      {(p?.highlights || []).slice(0, 3).map((h) => (
                        <li key={h} className="text-xs text-foreground/85 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary-glow" /> {h}
                        </li>
                      ))}
                    </ul>
                    <a href="#" className="inline-flex items-center justify-center gap-1.5 w-full px-3 py-2 rounded-md text-xs font-mono border border-primary/40 text-primary-glow hover:bg-primary/15 transition-all">
                      View on {(p?.store || "Partner")} <ExternalLink className="w-3 h-3" />
                    </a>
                    <button onClick={() => setOpenCard(open ? null : (p?.name || "Unknown"))}
                      className="w-full inline-flex items-center justify-between text-xs font-mono text-muted-foreground hover:text-primary-glow pt-2 border-t border-primary/10">
                      Why this recommendation?
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {open && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden text-xs text-muted-foreground space-y-1">
                          {(p?.highlights || []).map((h) => (
                            <div key={h} className="flex items-center gap-2"><span className="text-success">✅</span> {h}</div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </GlassCard>
                </motion.div>
              );
            })}
          </motion.section>
        </main>
      </>
  );
}
