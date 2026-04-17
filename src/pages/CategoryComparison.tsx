import { useState, useMemo } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LanguageContext";
import { AppHeader } from "@/components/sellezy/AppHeader";
import { PageWrapper } from "@/components/sellezy/PageWrapper";
import { GlassCard } from "@/components/sellezy/GlassCard";
import {
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line,
} from "recharts";
import { RADAR_CATEGORY_COMPARE, SENTIMENT_FEATURE_DATA, QUALITY_TIMESERIES } from "@/lib/mockData";

const ALL = ["Electronics", "FMCG", "Apparel"] as const;
type Cat = typeof ALL[number];

const COLORS: Record<Cat, string> = {
  Electronics: "hsl(174 62% 47%)",
  FMCG: "hsl(27 87% 67%)",
  Apparel: "hsl(280 50% 60%)",
};

export default function CategoryComparison() {
  const { role } = useAuth();
  const { t } = useLang();
  const [count, setCount] = useState<2 | 3>(3);
  const [selected, setSelected] = useState<Cat[]>([...ALL]);

  if (role !== "producer") return <Navigate to="/home" replace />;

  const toggle = (c: Cat) => {
    setSelected((s) =>
      s.includes(c) ? (s.length > 2 ? s.filter((x) => x !== c) : s) : (s.length < count ? [...s, c] : [...s.slice(1), c])
    );
  };

  const grouped = useMemo(() => {
    const features = SENTIMENT_FEATURE_DATA.Electronics.map((e, i) => {
      const row: any = { feature: e.feature };
      selected.forEach((c) => { row[c] = SENTIMENT_FEATURE_DATA[c][i].positive; });
      return row;
    });
    return features;
  }, [selected]);

  return (
    <>
      <AppHeader />
      <PageWrapper>
        <main className="container py-10 space-y-6">
          <div>
            <h1 className="font-display font-extrabold text-3xl md:text-5xl">{t("pt_category")}</h1>
            <p className="text-muted-foreground mt-1">{t("pt_category_sub")}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex rounded-full border border-primary/30 p-1 text-xs font-mono">
              {[2, 3].map((n) => (
                <button key={n} onClick={() => { setCount(n as 2 | 3); setSelected([...ALL].slice(0, n) as Cat[]); }}
                  className={`px-4 py-1.5 rounded-full ${count === n ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                  Compare {n}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {ALL.map((c) => (
                <button key={c} onClick={() => toggle(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-mono border transition-all ${selected.includes(c) ? "bg-primary/20 border-primary text-primary-glow" : "border-primary/30 text-muted-foreground"}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <GlassCard hoverable={false}>
              <h2 className="font-display font-bold text-xl mb-4">Multi-axis Comparison</h2>
              <div className="h-80">
                <ResponsiveContainer>
                  <RadarChart data={RADAR_CATEGORY_COMPARE}>
                    <PolarGrid stroke="hsl(174 62% 47% / 0.2)" />
                    <PolarAngleAxis dataKey="axis" tick={{ fill: "hsl(203 33% 62%)", fontSize: 11 }} />
                    <PolarRadiusAxis tick={{ fill: "hsl(203 33% 62%)", fontSize: 10 }} angle={45} />
                    {selected.map((c) => (
                      <Radar key={c} name={c} dataKey={c} stroke={COLORS[c]} fill={COLORS[c]} fillOpacity={0.25} />
                    ))}
                    <Tooltip contentStyle={{ background: "hsl(218 60% 15%)", border: "1px solid hsl(174 62% 47% / 0.4)", borderRadius: 8 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            <GlassCard hoverable={false}>
              <h2 className="font-display font-bold text-xl mb-4">Feature-by-Feature</h2>
              <div className="h-80">
                <ResponsiveContainer>
                  <BarChart data={grouped}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(174 62% 47% / 0.15)" />
                    <XAxis dataKey="feature" stroke="hsl(203 33% 62%)" fontSize={11} />
                    <YAxis stroke="hsl(203 33% 62%)" fontSize={11} />
                    <Tooltip contentStyle={{ background: "hsl(218 60% 15%)", border: "1px solid hsl(174 62% 47% / 0.4)", borderRadius: 8 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    {selected.map((c) => <Bar key={c} dataKey={c} fill={COLORS[c]} radius={[4, 4, 0, 0]} />)}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { c: "Electronics", strong: "Delivery (87%)", weak: "Support (58%)" },
              { c: "FMCG", strong: "Quality (91%)", weak: "Packaging (62%)" },
              { c: "Apparel", strong: "Value (84%)", weak: "Durability (61%)" },
            ].map((s) => (
              <GlassCard key={s.c}>
                <div className="font-display font-bold text-lg mb-2">{s.c}</div>
                <div className="text-xs text-muted-foreground"><span className="text-success">Strongest:</span> {s.strong}</div>
                <div className="text-xs text-muted-foreground"><span className="text-destructive">Weakest:</span> {s.weak}</div>
              </GlassCard>
            ))}
          </div>

          <GlassCard hoverable={false}>
            <h2 className="font-display font-bold text-xl mb-4">12-Week Trend</h2>
            <div className="h-72">
              <ResponsiveContainer>
                <LineChart data={QUALITY_TIMESERIES}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(174 62% 47% / 0.15)" />
                  <XAxis dataKey="week" stroke="hsl(203 33% 62%)" fontSize={11} />
                  <YAxis stroke="hsl(203 33% 62%)" fontSize={11} domain={[50, 100]} />
                  <Tooltip contentStyle={{ background: "hsl(218 60% 15%)", border: "1px solid hsl(174 62% 47% / 0.4)", borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  {selected.map((c) => <Line key={c} type="monotone" dataKey={c} stroke={COLORS[c]} strokeWidth={2} />)}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </main>
      </PageWrapper>
    </>
  );
}
