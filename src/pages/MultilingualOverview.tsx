import { Navigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LanguageContext";
import { AppHeader } from "@/components/sellezy/AppHeader";
import { PageWrapper, stagger } from "@/components/sellezy/PageWrapper";
import { GlassCard } from "@/components/sellezy/GlassCard";
import { StatCard } from "@/components/sellezy/StatCard";
import { TranslationHint } from "@/components/sellezy/TranslationHint";
import { motion } from "framer-motion";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import { PIPELINE_LANG_BREAKDOWN } from "@/lib/mockData";
import { Sparkles, Wand2, Bot, Filter } from "lucide-react";

const SAMPLES: Record<string, Array<{ original: string; translated: string; lang: string; highlight: string[] }>> = {
  "हिन्दी": [
    { original: "बहुत अच्छा फोन है, बैटरी लाइफ बढ़िया है।", translated: "Great phone, battery life is excellent.", lang: "हिन्दी", highlight: ["battery"] },
    { original: "पैकेजिंग थोड़ी खराब थी लेकिन डिलीवरी जल्दी हुई।", translated: "Packaging was a bit poor but delivery was quick.", lang: "हिन्दी", highlight: ["packaging", "delivery"] },
  ],
  "தமிழ்": [
    { original: "மிகவும் நல்ல தயாரிப்பு, விரைவான டெலிவரி.", translated: "Very good product, quick delivery.", lang: "தமிழ்", highlight: ["delivery"] },
    { original: "சுவை அருமை, விலை மலிவு.", translated: "Taste is wonderful, value is great.", lang: "தமிழ்", highlight: ["taste", "value"] },
  ],
  "বাংলা": [
    { original: "ভাল মানের কাপড়, রঙ নষ্ট হয় না।", translated: "Good quality fabric, color doesn't fade.", lang: "বাংলা", highlight: ["quality"] },
    { original: "প্যাকেজিং উন্নত হয়েছে।", translated: "Packaging has improved.", lang: "বাংলা", highlight: ["packaging"] },
  ],
  "मराठी": [
    { original: "चव खूप छान आहे.", translated: "Taste is very good.", lang: "मराठी", highlight: ["taste"] },
    { original: "गुणवत्ता उत्तम आहे.", translated: "Quality is excellent.", lang: "मराठी", highlight: ["quality"] },
  ],
  "Hinglish": [
    { original: "Bahut accha hai bhai, paisa vasool.", translated: "Very good, totally worth the money.", lang: "Hinglish", highlight: ["value"] },
    { original: "Yaar ye toh top class hai.", translated: "Buddy this is top class.", lang: "Hinglish", highlight: [] },
  ],
};

const TABS = ["हिन्दी", "தமிழ்", "বাংলা", "मराठी", "Hinglish"];

const highlightText = (text: string, words: string[]) => {
  if (!words.length) return text;
  const re = new RegExp(`(${words.join("|")})`, "gi");
  return text.split(re).map((p, i) =>
    words.some((w) => w.toLowerCase() === p.toLowerCase())
      ? <strong key={i} className="text-primary-glow">{p}</strong>
      : <span key={i}>{p}</span>
  );
};

export default function MultilingualOverview() {
  const { role } = useAuth();
  const { t } = useLang();
  const [tab, setTab] = useState(TABS[0]);
  if (role !== "producer") return <Navigate to="/home" replace />;

  return (
    <>
      <AppHeader />
      <PageWrapper>
        <main className="container py-10 space-y-8">
          <div>
            <h1 className="font-display font-extrabold text-3xl md:text-5xl">{t("pt_multi")}</h1>
            <p className="text-muted-foreground mt-1">{t("pt_multi_sub")}</p>
          </div>

          <section className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <StatCard label="Languages Supported" count={6} />
            <StatCard label="Non-English Reviews" count={78} suffix="%" />
            <StatCard label="Translation Accuracy" count={99} suffix=".2%" />
            <StatCard label="Normalised Reviews" count={3940} />
          </section>

          <section className="grid lg:grid-cols-[1fr_1.2fr] gap-6">
            <GlassCard hoverable={false}>
              <h2 className="font-display font-bold text-xl mb-4">Language Breakdown</h2>
              <div className="h-72">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={PIPELINE_LANG_BREAKDOWN} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={2} label={(e) => `${e.value}%`}>
                      {PIPELINE_LANG_BREAKDOWN.map((e, i) => <Cell key={i} fill={e.fill} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: "hsl(218 60% 15%)", border: "1px solid hsl(174 62% 47% / 0.4)", borderRadius: 8 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            <GlassCard hoverable={false}>
              <h2 className="font-display font-bold text-xl mb-4">Sample Reviews</h2>
              <div className="flex gap-1.5 flex-wrap mb-4">
                {TABS.map((l) => (
                  <button key={l} onClick={() => setTab(l)}
                    className={`px-3 py-1.5 rounded-full text-xs font-mono border transition-all ${tab === l ? "bg-primary text-primary-foreground border-primary" : "border-primary/30 hover:border-primary"}`}>
                    {l}
                  </button>
                ))}
              </div>
              <motion.div key={tab} variants={stagger.container} initial="hidden" animate="visible" className="space-y-3">
                {SAMPLES[tab].map((s, i) => (
                  <motion.div key={i} variants={stagger.item} className="rounded-lg border border-primary/20 p-3 bg-bg-card/40 space-y-2">
                    <div className="text-sm text-foreground/85">{s.original}</div>
                    <TranslationHint lang={s.lang} />
                    <div className="text-xs text-muted-foreground italic">{highlightText(s.translated, s.highlight)}</div>
                  </motion.div>
                ))}
              </motion.div>
            </GlassCard>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl mb-4">AI Normalisation Layer</h2>
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { icon: Sparkles, title: "Emoji → Text", desc: "🔥 → 'great', 😡 → 'angry'" },
                { icon: Wand2, title: "Hinglish Mapping", desc: "Romanised Hindi ↔ Devanagari" },
                { icon: Filter, title: "Deduplication", desc: "Detects repeated review templates" },
                { icon: Bot, title: "Spam Filter", desc: "ML-flagged bot-generated content" },
              ].map((c) => (
                <GlassCard key={c.title}>
                  <c.icon className="w-7 h-7 text-primary mb-2" />
                  <div className="font-display font-bold mb-1">{c.title}</div>
                  <div className="text-xs text-muted-foreground">{c.desc}</div>
                </GlassCard>
              ))}
            </div>
          </section>
        </main>
      </PageWrapper>
    </>
  );
}
