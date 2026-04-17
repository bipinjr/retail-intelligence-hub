import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AppHeader } from "@/components/sellezy/AppHeader";
import { PageWrapper } from "@/components/sellezy/PageWrapper";
import { GlassCard } from "@/components/sellezy/GlassCard";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { motion, AnimatePresence } from "framer-motion";
import { STATE_INTENSITY } from "@/lib/mockData";
import { Globe, TrendingUp, Trophy, Flame } from "lucide-react";

// Public CDN India topojson (states)
const INDIA_TOPO = "https://cdn.jsdelivr.net/gh/deldersveld/topojson/countries/india/india-states.json";

const colorScale = (v: number) => {
  const max = 1500;
  const t = Math.min(v / max, 1);
  // interpolate from #0F2040 (low) to #2EC4B6 (high)
  const r = Math.round(15 + (46 - 15) * t);
  const g = Math.round(32 + (196 - 32) * t);
  const b = Math.round(64 + (182 - 64) * t);
  return `rgb(${r}, ${g}, ${b})`;
};

const TOP_STATES = Object.entries(STATE_INTENSITY)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5);

const CATS = ["All", "Electronics", "FMCG", "Apparel"];

export default function GeoSalesHeatmap() {
  const { role } = useAuth();
  const [hover, setHover] = useState<{ name: string; value: number } | null>(null);
  const [cat, setCat] = useState("All");
  if (role !== "producer") return <Navigate to="/home" replace />;

  return (
    <>
      <AppHeader />
      <PageWrapper>
        <main className="container py-10 space-y-6">
          <div>
            <h1 className="font-display font-extrabold text-3xl md:text-5xl">Geo Sales Heatmap</h1>
            <p className="text-muted-foreground mt-1">Where products are loved most across India.</p>
          </div>

          <GlassCard hoverable={false} className="bg-primary/10 !border-primary/30 flex items-start gap-3 text-sm">
            <Globe className="w-4 h-4 text-primary-glow shrink-0 mt-0.5" />
            <div>Showing translated data from हिन्दी, தமிழ் & Hinglish reviews — AI normalisation layer applied.</div>
          </GlassCard>

          <div className="grid lg:grid-cols-[1fr_320px] gap-6">
            <GlassCard hoverable={false} className="relative min-h-[500px] !p-2">
              <div className="absolute top-3 left-3 z-10 flex gap-1.5 flex-wrap">
                {CATS.map((c) => (
                  <button key={c} onClick={() => setCat(c)}
                    className={`px-3 py-1.5 rounded-full text-xs font-mono border transition-all ${cat === c ? "bg-primary text-primary-foreground border-primary" : "bg-bg-card/70 border-primary/30 hover:border-primary"}`}>
                    {c}
                  </button>
                ))}
              </div>
              <ComposableMap projection="geoMercator" projectionConfig={{ scale: 900, center: [82, 22] }} style={{ width: "100%", height: 500 }}>
                <Geographies geography={INDIA_TOPO}>
                  {({ geographies }) =>
                    geographies.map((geo, i) => {
                      const name = geo.properties.NAME_1 || geo.properties.name || "";
                      const value = STATE_INTENSITY[name] ?? 80;
                      return (
                        <motion.g key={geo.rsmKey} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}>
                          <Geography
                            geography={geo}
                            onMouseEnter={() => setHover({ name, value })}
                            onMouseLeave={() => setHover(null)}
                            style={{
                              default: { fill: colorScale(value), stroke: "hsl(174 62% 47% / 0.4)", strokeWidth: 0.5, outline: "none" },
                              hover: { fill: "hsl(169 100% 55%)", stroke: "hsl(174 62% 47%)", strokeWidth: 1, outline: "none", cursor: "pointer" },
                              pressed: { fill: "hsl(169 100% 55%)", outline: "none" },
                            }}
                          />
                        </motion.g>
                      );
                    })
                  }
                </Geographies>
              </ComposableMap>

              <AnimatePresence>
                {hover && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-4 left-4 glass-card p-3 max-w-xs"
                  >
                    <div className="font-display font-bold text-sm">{hover.name}</div>
                    <div className="text-xs text-muted-foreground mt-1 font-mono">{hover.value} purchases · top: {cat === "All" ? "Electronics" : cat}</div>
                    <div className="text-xs text-primary-glow mt-1 font-mono">Sentiment: {Math.min(95, 60 + Math.round(hover.value / 50))}%</div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="absolute bottom-3 right-3 flex items-center gap-2 text-xs font-mono text-muted-foreground bg-background/70 backdrop-blur px-3 py-1.5 rounded">
                Low <span className="w-16 h-2 rounded" style={{ background: "linear-gradient(90deg, rgb(15,32,64), rgb(46,196,182))" }} /> High
              </div>
            </GlassCard>

            <aside className="space-y-4">
              <GlassCard hoverable={false}>
                <h3 className="font-display font-bold text-lg mb-3">Purchase Hotspots</h3>
                <ul className="space-y-3">
                  {TOP_STATES.map(([name, val], i) => (
                    <li key={name} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-mono text-muted-foreground w-5">#{i + 1}</span>
                        <span className="flex-1 truncate">{name}</span>
                        <span className="text-primary-glow font-mono text-xs">{val}</span>
                      </div>
                      <div className="h-1.5 bg-input/50 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${(val / 1500) * 100}%` }} transition={{ duration: 1, delay: i * 0.1 }} className="h-full bg-gradient-to-r from-primary to-primary-glow" />
                      </div>
                    </li>
                  ))}
                </ul>
              </GlassCard>

              <GlassCard hoverable={false} className="space-y-2">
                <div className="flex items-center gap-2 text-sm"><Flame className="w-4 h-4 text-destructive" /> <span className="font-mono text-muted-foreground">Highest Demand:</span> <span className="font-display font-bold">Delhi</span></div>
                <div className="flex items-center gap-2 text-sm"><Trophy className="w-4 h-4 text-accent" /> <span className="font-mono text-muted-foreground">Most Reviews:</span> <span className="font-display font-bold">Maharashtra</span></div>
                <div className="flex items-center gap-2 text-sm"><TrendingUp className="w-4 h-4 text-primary-glow" /> <span className="font-mono text-muted-foreground">Fastest Growing:</span> <span className="font-display font-bold">Karnataka</span></div>
              </GlassCard>
            </aside>
          </div>
        </main>
      </PageWrapper>
    </>
  );
}
