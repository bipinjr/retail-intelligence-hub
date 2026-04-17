import { useState, useMemo } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LanguageContext";
import { AppHeader } from "@/components/sellezy/AppHeader";
import { PageWrapper } from "@/components/sellezy/PageWrapper";
import { GlassCard } from "@/components/sellezy/GlassCard";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, BarChart, Bar } from "recharts";
import { TRENDS_BRANDS } from "@/lib/mockData";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const CATS = ["Electronics", "FMCG", "Apparel"] as const;
const LINE_COLORS = ["hsl(174 62% 47%)", "hsl(169 100% 55%)", "hsl(27 87% 67%)", "hsl(280 50% 60%)"];

export default function SentimentTrends() {
  const { role } = useAuth();
  const { t } = useLang();
  const [cat, setCat] = useState<typeof CATS[number]>("Electronics");
  const [search, setSearch] = useState("");
  const [activeBrand, setActiveBrand] = useState<string>("");

  if (role !== "consumer") return <Navigate to="/home" replace />;

  const brands = TRENDS_BRANDS[cat];
  const filtered = useMemo(
    () => brands.filter((b) => b.name.toLowerCase().includes(search.toLowerCase())),
    [brands, search]
  );
  const focus = brands.find((b) => b.name === activeBrand) ?? brands[2]; // default boAt-like

  const trendData = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const row: any = { week: `W${i + 1}` };
      brands.forEach((b) => { row[b.name] = b.data[i]; });
      return row;
    });
  }, [brands]);

  const featureCompare = [
    { feature: "Quality", "3 mo ago": focus.start - 6, "Now": focus.end - 2 },
    { feature: "Delivery", "3 mo ago": focus.start - 10, "Now": focus.end + 2 },
    { feature: "Packaging", "3 mo ago": focus.start - 12, "Now": focus.end - 6 },
    { feature: "Value", "3 mo ago": focus.start - 4, "Now": focus.end },
    { feature: "Support", "3 mo ago": focus.start - 18, "Now": focus.end - 12 },
  ];

  return (
    <>
      <AppHeader />
      <PageWrapper>
        <main className="container py-10 space-y-6">
          <div>
            <h1 className="font-display font-extrabold text-3xl md:text-5xl">{t("pt_trends")}</h1>
            <p className="text-muted-foreground mt-1">{t("pt_trends_sub")}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex gap-2">
              {CATS.map((c) => (
                <button key={c} onClick={() => { setCat(c); setActiveBrand(""); }}
                  className={`px-4 py-2 rounded-full text-sm font-mono border transition-all ${cat === c ? "bg-primary text-primary-foreground border-primary" : "border-primary/30 hover:border-primary"}`}>
                  {c}
                </button>
              ))}
            </div>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Filter brand…"
              className="ml-auto bg-input/60 border border-primary/20 rounded-md px-3 py-2 text-sm focus:border-primary focus:outline-none w-56" />
          </div>

          <GlassCard hoverable={false}>
            <h2 className="font-display font-bold text-xl mb-4">12-Week Trend — {cat}</h2>
            <div className="h-80">
              <ResponsiveContainer>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(174 62% 47% / 0.15)" />
                  <XAxis dataKey="week" stroke="hsl(203 33% 62%)" fontSize={11} />
                  <YAxis stroke="hsl(203 33% 62%)" fontSize={11} domain={[40, 100]} />
                  <Tooltip contentStyle={{ background: "hsl(218 60% 15%)", border: "1px solid hsl(174 62% 47% / 0.4)", borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  {brands.map((b, i) => (
                    <Line key={b.name} type="monotone" dataKey={b.name} stroke={LINE_COLORS[i]} strokeWidth={2} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map((b) => {
              const delta = b.end - b.start;
              const TrendIcon = delta > 2 ? TrendingUp : delta < -2 ? TrendingDown : Minus;
              return (
                <GlassCard key={b.name} hoverable className={activeBrand === b.name ? "!border-primary" : ""}>
                  <button className="w-full text-left" onClick={() => setActiveBrand(b.name)}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-display font-bold">{b.name}</div>
                      <span className="text-[10px] font-mono text-muted-foreground">{cat}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <TrendIcon className={`w-4 h-4 ${delta > 0 ? "text-success" : delta < 0 ? "text-destructive" : "text-muted-foreground"}`} />
                      <span className="font-mono text-sm">{b.start}% → {b.end}%</span>
                      <span className={`text-xs font-mono ${delta > 0 ? "text-success" : "text-destructive"}`}>
                        {delta > 0 ? "▲" : "▼"}{Math.abs(delta)}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground"><span className="text-success">Best:</span> {b.best}</div>
                    <div className="text-xs text-muted-foreground"><span className="text-warning">Worst:</span> {b.worst}</div>
                    <span className={`mt-2 inline-block px-2 py-0.5 rounded-full text-[10px] font-mono ${b.status === "Improving!" ? "bg-success/15 text-success border border-success/40" : b.status === "Watch out" ? "bg-destructive/15 text-destructive border border-destructive/40" : "bg-muted/15 text-muted-foreground border border-muted/40"}`}>
                      {b.status}
                    </span>
                  </button>
                </GlassCard>
              );
            })}
          </div>

          <GlassCard hoverable={false}>
            <h2 className="font-display font-bold text-xl mb-4">Feature Breakdown — {focus.name}</h2>
            <div className="h-72">
              <ResponsiveContainer>
                <BarChart data={featureCompare}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(174 62% 47% / 0.15)" />
                  <XAxis dataKey="feature" stroke="hsl(203 33% 62%)" fontSize={11} />
                  <YAxis stroke="hsl(203 33% 62%)" fontSize={11} />
                  <Tooltip contentStyle={{ background: "hsl(218 60% 15%)", border: "1px solid hsl(174 62% 47% / 0.4)", borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="3 mo ago" fill="hsl(203 33% 62%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Now" fill="hsl(174 62% 47%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard hoverable={false} className="bg-primary/10 !border-primary/30">
            <div className="text-sm">📈 <strong className="text-primary-glow">boAt</strong> improved most in Delivery sentiment (+28 pts) — consistent with expanded logistics partnerships seen in reviews.</div>
          </GlassCard>
        </main>
      </PageWrapper>
    </>
  );
}
