const fs = require('fs');
const path = require('path');

const targetStr = `  const [showComplaints, setShowComplaints] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const heatLayer = useRef<L.Layer | null>(null);
  const markerLayer = useRef<L.LayerGroup | null>(null);`;

const repStr = `  const [viewMode, setViewMode] = useState<"sales" | "complaints" | "both">("both");
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const heatLayerSales = useRef<L.Layer | null>(null);
  const heatLayerComp = useRef<L.Layer | null>(null);
  const markerLayer = useRef<L.LayerGroup | null>(null);`;

const targetHookStr = `    if (heatLayer.current) {
      map.removeLayer(heatLayer.current);
      heatLayer.current = null;
    }

    const heatData = filtered.map((p) => [
      p.lat,
      p.lng,
      showComplaints ? p.complaint : p.intensity,
    ]) as [number, number, number][];

    const heatFn = (L as unknown as { heatLayer?: (data: unknown, opts: unknown) => L.Layer }).heatLayer;
    if (!heatFn) {
      console.error("[Heatmap] L.heatLayer is undefined — leaflet.heat plugin not loaded");
      return;
    }
    heatLayer.current = heatFn(heatData, {
      radius: 50,
      blur: 35,
      maxZoom: 10,
      max: 1.0,
      minOpacity: 0.4,
      gradient: showComplaints ? COMPLAINT_GRADIENT : SALES_GRADIENT,
    }).addTo(map);

    // Tooltips
    markerLayer.current?.clearLayers();
    filtered.forEach((p) => {
      const marker = L.circleMarker([p.lat, p.lng], {
        radius: 6,
        color: showComplaints ? "#ff5577" : "#1AFFD5",
        fillColor: showComplaints ? "#ff5577" : "#2EC4B6",
        fillOpacity: 0.0,
        opacity: 0.0,
        weight: 1,
      }).bindTooltip(
        \`<div style="font-family: 'JetBrains Mono', monospace; font-size: 11px;">
          <strong style="font-family: 'Syne', sans-serif; font-size: 13px;">\${p.city}</strong><br/>
          \${showComplaints ? "Complaints" : "Sales"}: \${Math.round((showComplaints ? p.complaint : p.intensity) * 100)}%<br/>
          Category: \${p.category}
        </div>\`,
        { direction: "top", offset: [0, -4] }
      );
      markerLayer.current?.addLayer(marker);
    });`;

const repHookStr = `    if (heatLayerSales.current) { map.removeLayer(heatLayerSales.current); heatLayerSales.current = null; }
    if (heatLayerComp.current) { map.removeLayer(heatLayerComp.current); heatLayerComp.current = null; }
    markerLayer.current?.clearLayers();

    const isBoth = viewMode === "both";
    const jLat = isBoth ? 0.3 : 0;
    const jLng = isBoth ? -0.3 : 0;

    const heatFn = (L as unknown as { heatLayer?: (data: unknown, opts: unknown) => L.Layer }).heatLayer;
    if (!heatFn) return;

    if (viewMode === "sales" || isBoth) {
      const sData = filtered.map(p => [p.lat + jLat, p.lng + jLng, p.intensity]) as [number, number, number][];
      heatLayerSales.current = heatFn(sData, {
        radius: 50, blur: 35, maxZoom: 10, max: 1.0, minOpacity: 0.4, gradient: SALES_GRADIENT,
      }).addTo(map);
    }

    if (viewMode === "complaints" || isBoth) {
      const cData = filtered.map(p => [p.lat - jLat, p.lng - jLng, p.complaint]) as [number, number, number][];
      heatLayerComp.current = heatFn(cData, {
        radius: 50, blur: 35, maxZoom: 10, max: 1.0, minOpacity: 0.4, gradient: COMPLAINT_GRADIENT,
      }).addTo(map);
    }

    filtered.forEach((p) => {
      if (viewMode === "sales" || isBoth) {
        const markerS = L.circleMarker([p.lat + jLat, p.lng + jLng], {
          radius: 6, color: "#1AFFD5", fillOpacity: 0.0, opacity: 0.0, weight: 1,
        }).bindTooltip(
          \`<div style="font-family: 'JetBrains Mono', monospace; font-size: 11px;">
            <strong style="font-family: 'Syne', sans-serif; font-size: 13px;">\${p.city}</strong><br/>
            Sales: \${Math.round(p.intensity * 100)}%<br/>
            Category: \${p.category}
          </div>\`,
          { direction: "top", offset: [0, -4] }
        );
        markerLayer.current?.addLayer(markerS);
      }
      if (viewMode === "complaints" || isBoth) {
        const markerC = L.circleMarker([p.lat - jLat, p.lng - jLng], {
          radius: 6, color: "#ff5577", fillOpacity: 0.0, opacity: 0.0, weight: 1,
        }).bindTooltip(
          \`<div style="font-family: 'JetBrains Mono', monospace; font-size: 11px;">
            <strong style="font-family: 'Syne', sans-serif; font-size: 13px;">\${p.city}</strong><br/>
            Complaints: \${Math.round(p.complaint * 100)}%<br/>
            Category: \${p.category}
          </div>\`,
          { direction: "top", offset: [0, -4] }
        );
        markerLayer.current?.addLayer(markerC);
      }
    });`;

const targetToggleStr = `            {/* Complaint toggle */}
            <button
              onClick={() => setShowComplaints((v) => !v)}
              className={\`absolute top-3 right-3 z-[500] px-3 py-1.5 rounded-full text-xs font-mono border transition-all flex items-center gap-1.5 \${
                showComplaints
                  ? "bg-destructive text-destructive-foreground border-destructive"
                  : "bg-background/70 backdrop-blur border-primary/30 hover:border-primary text-foreground"
              }\`}
            >
              <AlertTriangle className="w-3 h-3" />
              {showComplaints ? "Showing complaints" : "Show complaints"}
            </button>`;

const repToggleStr = `            {/* Segmented controls replacing the complaint toggle */}
            <div className="absolute top-3 right-3 z-[500] flex gap-1 p-1 bg-background/80 backdrop-blur rounded-full border border-primary/20 shadow-lg">
              {(["sales", "complaints", "both"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setViewMode(m)}
                  className={\`px-3 py-1.5 rounded-full text-xs font-mono capitalize transition-all \${
                    viewMode === m
                      ? m === "sales"
                        ? "bg-[#1A6B61] text-white shadow"
                        : m === "complaints"
                        ? "bg-destructive text-destructive-foreground shadow"
                        : "bg-primary text-primary-foreground shadow"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }\`}
                >
                  {m}
                </button>
              ))}
            </div>`;

const targetLegendStr = `            {/* Legend */}
            <div className="absolute bottom-4 right-4 z-[500] flex items-center gap-2 text-xs font-mono text-muted-foreground bg-background/80 backdrop-blur px-3 py-1.5 rounded">
              Low
              <span
                className="w-24 h-2 rounded"
                style={{
                  background: showComplaints
                    ? "linear-gradient(90deg, #2a0a14, #7a1f2b, #d83a4a, #ff5577)"
                    : "linear-gradient(90deg, #0F2040, #1A6B61, #2EC4B6, #1AFFD5)",
                }}
              />
              High
            </div>`;

const repLegendStr = `            {/* Stacked Legend */}
            <div className="absolute bottom-4 right-4 z-[500] flex flex-col gap-2 text-xs font-mono text-muted-foreground bg-background/80 backdrop-blur px-3 py-2 rounded border border-primary/20">
              {(viewMode === "sales" || viewMode === "both") && (
                <div className="flex items-center gap-2">
                  <span className="w-[70px]">Sales</span>
                  <span>Low</span>
                  <span className="w-20 h-2 rounded" style={{ background: "linear-gradient(90deg, #0F2040, #1A6B61, #2EC4B6, #1AFFD5)" }} />
                  <span>High</span>
                </div>
              )}
              {(viewMode === "complaints" || viewMode === "both") && (
                <div className="flex items-center gap-2">
                  <span className="w-[70px]">Complaints</span>
                  <span>Low</span>
                  <span className="w-20 h-2 rounded" style={{ background: "linear-gradient(90deg, #2a0a14, #7a1f2b, #d83a4a, #ff5577)" }} />
                  <span>High</span>
                </div>
              )}
            </div>`;

const fp = path.join(__dirname, 'src/pages/GeoSalesHeatmap.tsx');
let c = fs.readFileSync(fp, 'utf8');

c = c.replace(targetStr, repStr);
c = c.replace(targetHookStr, repHookStr);
c = c.replace(targetToggleStr, repToggleStr);
c = c.replace(targetLegendStr, repLegendStr);

// To fix dependencies array
c = c.replace('}, [cat, showComplaints]);', '}, [cat, viewMode]);');

fs.writeFileSync(fp, c);
console.log('GeoSalesHeatmap successfully rebuilt!');
