const fs = require('fs');
const path = require('path');

const fp = path.join(__dirname, 'src/pages/GeoSalesHeatmap.tsx');
let c = fs.readFileSync(fp, 'utf8');

// 1. Fix the role loading check so it doesn't instantly redirect / blank out
const targetRole = `  if (role !== "producer") return <Navigate to="/home" replace />;`;
const repRole = `  if (!role) return (
    <div className="flex items-center justify-center p-20 text-muted-foreground w-full h-[600px] border border-dashed border-primary/20 rounded-xl bg-bg-card/40 mx-4 mt-10">
       <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="font-mono text-sm">Authenticating metrics...</p>
       </div>
    </div>
  );
  if (role !== "producer") return <Navigate to="/home" replace />;`;
c = c.replace(targetRole, repRole);

// 2. Add Empty Data Fallback
const targetContainerStart = `            {/* Segmented controls replacing the complaint toggle */}`;
const repContainerStart = `            {/* Data Fallback */}\n            {(!POINTS || POINTS.length === 0) && (
              <div className="absolute inset-0 z-[1000] flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm text-muted-foreground">
                <Globe className="w-8 h-8 mb-3 opacity-20" />
                <p className="font-mono text-sm">No geographic review data available yet.</p>
              </div>
            )}\n\n` + targetContainerStart;
c = c.replace(targetContainerStart, repContainerStart);

// 3. Null-safe filtered points in useEffect
const targetFilter = `    const filtered = cat === "All" ? POINTS : POINTS.filter((p) => p.category === cat);`;
const repFilter = `    const filtered = (cat === "All" ? POINTS : POINTS.filter((p) => p.category === cat)).filter(p => typeof p.lat === 'number' && typeof p.lng === 'number');`;
c = c.replace(targetFilter, repFilter);

// 4. Try/Catch leafleft instantiation and leaflet.heat
const targetMapInit = `    const map = L.map(mapRef.current, {
      center: [20.5937, 78.9629],
      zoom: 5,
      zoomControl: true,
      attributionControl: false,
    });`;
const repMapInit = `    let map;
    try {
      map = L.map(mapRef.current, {
        center: [20.5937, 78.9629],
        zoom: 5,
        zoomControl: true,
        attributionControl: false,
      });
    } catch (e) {
      console.error("Leaflet init failed", e);
      return;
    }`;
c = c.replace(targetMapInit, repMapInit);

const targetHeatLoad = `    const heatFn = (L as unknown as { heatLayer?: (data: unknown, opts: unknown) => L.Layer }).heatLayer;
    if (!heatFn) return;`;
const repHeatLoad = `    const heatFn = (L as unknown as { heatLayer?: (data: unknown, opts: unknown) => L.Layer }).heatLayer;
    if (!heatFn) {
      console.warn("L.heatLayer unavailable.");
      // Soft fallback: just render markers, don't return early and skip tooltips!
    }`;
c = c.replace(targetHeatLoad, repHeatLoad);

const targetHeatSales = `    if (viewMode === "sales" || isBoth) {
      const sData = filtered.map(p => [p.lat + jLat, p.lng + jLng, p.intensity]) as [number, number, number][];
      heatLayerSales.current = heatFn(sData, {
        radius: 50, blur: 35, maxZoom: 10, max: 1.0, minOpacity: 0.4, gradient: SALES_GRADIENT,
      }).addTo(map);
    }`;
const repHeatSales = `    if ((viewMode === "sales" || isBoth) && heatFn) {
      const sData = filtered.map(p => [p.lat + jLat, p.lng + jLng, p.intensity || 0]) as [number, number, number][];
      try {
        heatLayerSales.current = heatFn(sData, {
          radius: 50, blur: 35, maxZoom: 10, max: 1.0, minOpacity: 0.4, gradient: SALES_GRADIENT,
        }).addTo(map);
      } catch(e) {}
    }`;
c = c.replace(targetHeatSales, repHeatSales);

const targetHeatComp = `    if (viewMode === "complaints" || isBoth) {
      const cData = filtered.map(p => [p.lat - jLat, p.lng - jLng, p.complaint]) as [number, number, number][];
      heatLayerComp.current = heatFn(cData, {
        radius: 50, blur: 35, maxZoom: 10, max: 1.0, minOpacity: 0.4, gradient: COMPLAINT_GRADIENT,
      }).addTo(map);
    }`;
const repHeatComp = `    if ((viewMode === "complaints" || isBoth) && heatFn) {
      const cData = filtered.map(p => [p.lat - jLat, p.lng - jLng, p.complaint || 0]) as [number, number, number][];
      try {
        heatLayerComp.current = heatFn(cData, {
          radius: 50, blur: 35, maxZoom: 10, max: 1.0, minOpacity: 0.4, gradient: COMPLAINT_GRADIENT,
        }).addTo(map);
      } catch(e) {}
    }`;
c = c.replace(targetHeatComp, repHeatComp);

fs.writeFileSync(fp, c);
console.log('GeoSalesHeatmap successfully patched with null-safety and fallbacks!');
