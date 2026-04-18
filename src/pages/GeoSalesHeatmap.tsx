import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

import { GlassCard } from "@/components/sellezy/GlassCard";
import { Globe } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Restore shaded heatmap plugin
import "leaflet.heat";

type Category = "All" | "Electronics" | "FMCG" | "Apparel";

// Step 7/8/10: Null-safe data bindings
interface HeatPoint {
  lat: number;
  lng: number;
  intensity: number;
  complaint: number;
  category: Exclude<Category, "All">;
  city: string;
}

const POINTS: HeatPoint[] = [
  { city: "Mumbai", lat: 19.076, lng: 72.8777, intensity: 0.95, complaint: 0.4, category: "Electronics" },
  { city: "Delhi", lat: 28.6139, lng: 77.209, intensity: 1.0, complaint: 0.6, category: "Electronics" },
  { city: "Bangalore", lat: 12.9716, lng: 77.5946, intensity: 0.88, complaint: 0.25, category: "Electronics" },
  { city: "Chennai", lat: 13.0827, lng: 80.2707, intensity: 0.78, complaint: 0.5, category: "FMCG" },
  { city: "Hyderabad", lat: 17.385, lng: 78.4867, intensity: 0.82, complaint: 0.3, category: "Apparel" },
  { city: "Kolkata", lat: 22.5726, lng: 88.3639, intensity: 0.7, complaint: 0.55, category: "FMCG" },
  { city: "Pune", lat: 18.5204, lng: 73.8567, intensity: 0.74, complaint: 0.2, category: "Apparel" },
  { city: "Ahmedabad", lat: 23.0225, lng: 72.5714, intensity: 0.68, complaint: 0.35, category: "FMCG" },
  { city: "Jaipur", lat: 26.9124, lng: 75.7873, intensity: 0.55, complaint: 0.45, category: "Apparel" },
  { city: "Lucknow", lat: 26.8467, lng: 80.9462, intensity: 0.6, complaint: 0.5, category: "FMCG" },
  { city: "Surat", lat: 21.1702, lng: 72.8311, intensity: 0.5, complaint: 0.3, category: "Apparel" },
  { city: "Kanpur", lat: 26.4499, lng: 80.3319, intensity: 0.45, complaint: 0.4, category: "FMCG" },
  { city: "Nagpur", lat: 21.1458, lng: 79.0882, intensity: 0.48, complaint: 0.25, category: "Electronics" },
  { city: "Indore", lat: 22.7196, lng: 75.8577, intensity: 0.52, complaint: 0.3, category: "Apparel" },
  { city: "Bhopal", lat: 23.2599, lng: 77.4126, intensity: 0.42, complaint: 0.35, category: "FMCG" },
  { city: "Visakhapatnam", lat: 17.6868, lng: 83.2185, intensity: 0.4, complaint: 0.5, category: "Electronics" },
  { city: "Kochi", lat: 9.9312, lng: 76.2673, intensity: 0.46, complaint: 0.2, category: "Apparel" },
  { city: "Coimbatore", lat: 11.0168, lng: 76.9558, intensity: 0.44, complaint: 0.3, category: "FMCG" },
  { city: "Chandigarh", lat: 30.7333, lng: 76.7794, intensity: 0.5, complaint: 0.25, category: "Electronics" },
  { city: "Guwahati", lat: 26.1445, lng: 91.7362, intensity: 0.38, complaint: 0.4, category: "FMCG" },
];

const CATS: Category[] = ["All", "Electronics", "FMCG", "Apparel"];
type ViewMode = "sales" | "complaints" | "both";

const SALES_GRADIENT = { 0.0: "#0F2040", 0.4: "#1A6B61", 0.7: "#2EC4B6", 1.0: "#1AFFD5" };
const COMPLAINT_GRADIENT = { 0.0: "#2a0a14", 0.4: "#7a1f2b", 0.7: "#d83a4a", 1.0: "#ff5577" };

export default function GeoSalesHeatmap() {
  const { role } = useAuth();
  
  const [cat, setCat] = useState<Category>("All");
  const [viewMode, setViewMode] = useState<ViewMode>("both");
  
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  
  const heatLayerSales = useRef<L.Layer | null>(null);
  const heatLayerComp = useRef<L.Layer | null>(null);
  const markerLayer = useRef<L.LayerGroup | null>(null);

  // Step 6: Map Initialization Try-Catch bounds
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    try {
      const map = L.map(mapRef.current, {
        center: [20.5937, 78.9629],
        zoom: 5,
        zoomControl: true,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
        subdomains: "abcd",
      }).addTo(map);

      mapInstance.current = map;
      markerLayer.current = L.featureGroup().addTo(map);

      // Timeout forces recalculation post-React-Animations preventing zero-height clipping
      const t1 = setTimeout(() => map.invalidateSize(), 300);
      const ro = new ResizeObserver(() => map.invalidateSize());
      ro.observe(mapRef.current);

      return () => {
        clearTimeout(t1);
        ro.disconnect();
        map.remove();
        mapInstance.current = null;
      };
    } catch (e) {
      console.error("Leaflet core map initialization failed safely", e);
    }
  }, []);

  // Step 7-9: Secure Rendering
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    // Secure layer purge before re-renders
    if (heatLayerSales.current) { map.removeLayer(heatLayerSales.current); heatLayerSales.current = null; }
    if (heatLayerComp.current) { map.removeLayer(heatLayerComp.current); heatLayerComp.current = null; }
    markerLayer.current?.clearLayers();

    const safePoints = Array.isArray(POINTS) ? POINTS : [];
    const validPoints = safePoints.filter(p => p && typeof p.lat === 'number' && typeof p.lng === 'number');
    const filteredItems = cat === "All" ? validPoints : validPoints.filter((p) => p.category === cat);

    const isBoth = viewMode === "both";
    const jitter = isBoth ? 0.3 : 0; 
    
    // @ts-ignore
    const heatFn = L.heatLayer;
    
    if (!heatFn) {
       console.warn("Leaflet heatmap plugin not globally attached. Tooltips will still work!");
    } else {
       if (viewMode === "sales" || isBoth) {
         try {
           const sData = filteredItems.map(p => [p.lat + jitter, p.lng - jitter, p.intensity || 0]);
           heatLayerSales.current = heatFn(sData, { radius: 50, blur: 35, maxZoom: 10, max: 1.0, minOpacity: 0.4, gradient: SALES_GRADIENT }).addTo(map);
         } catch(e) { console.error("Sales HeatLayer failed", e) }
       }

       if (viewMode === "complaints" || isBoth) {
         try {
           const cData = filteredItems.map(p => [p.lat - jitter, p.lng + jitter, p.complaint || 0]);
           heatLayerComp.current = heatFn(cData, { radius: 50, blur: 35, maxZoom: 10, max: 1.0, minOpacity: 0.4, gradient: COMPLAINT_GRADIENT }).addTo(map);
         } catch(e) { console.error("Complaint HeatLayer failed", e) }
       }
    }

    // Render underlying invisible markers purely for interactive Popups/Tooltips
    filteredItems.forEach((p) => {
      if (viewMode === "sales" || isBoth) {
        const val = typeof p.intensity === 'number' ? p.intensity : 0;
        const sMarker = L.circleMarker([p.lat + jitter, p.lng - jitter], {
          radius: 20, 
          color: "transparent",
          fillOpacity: 0.0,
        }).bindTooltip(
          `<div style="font-family: 'JetBrains Mono', monospace; font-size: 11px;">
            <strong style="font-family: 'Syne', sans-serif; font-size: 13px;">${p.city || 'Unknown'}</strong><br/>
            Sales Density: ${Math.round(val * 100)}%<br/>
            Category: ${p.category || 'N/A'}
          </div>`,
          { direction: "top", offset: [0, -4] }
        );
        markerLayer.current?.addLayer(sMarker);
      }
      
      if (viewMode === "complaints" || isBoth) {
        const val = typeof p.complaint === 'number' ? p.complaint : 0;
        const cMarker = L.circleMarker([p.lat - jitter, p.lng + jitter], {
          radius: 20,
          color: "transparent",
          fillOpacity: 0.0,
        }).bindTooltip(
          `<div style="font-family: 'JetBrains Mono', monospace; font-size: 11px;">
            <strong style="font-family: 'Syne', sans-serif; font-size: 13px;">${p.city || 'Unknown'}</strong><br/>
            Complaint Rate: ${Math.round(val * 100)}%<br/>
            Category: ${p.category || 'N/A'}
          </div>`,
          { direction: "top", offset: [0, -4] }
        );
        markerLayer.current?.addLayer(cMarker);
      }
    });
  }, [cat, viewMode]);

  // Step 4 & 10: Fail-Safes and Router Guards preserving Layout Height limits
  if (!role) {
    return (
      <div className="flex-1 flex flex-col min-w-0 h-full p-4 relative font-sans text-foreground">
        <div className="flex items-center justify-center p-20 text-muted-foreground w-full h-[600px] border border-dashed border-primary/20 rounded-xl bg-bg-card/40 mt-10">
           <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              <p className="font-mono text-sm">Authenticating metrics...</p>
           </div>
        </div>
      </div>
    );
  }

  if (role !== "producer") return <Navigate to="/home" replace />;

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full p-4 relative font-sans text-foreground">
        <main className="container py-10 space-y-6">
          <div>
            <h1 className="font-display font-extrabold text-3xl md:text-5xl">Geo Sales Scatter</h1>
            <p className="text-muted-foreground mt-1">High-density regional product interactions across India.</p>
          </div>

          <GlassCard hoverable={false} className="bg-primary/10 !border-primary/30 flex items-start gap-3 text-sm">
            <Globe className="w-4 h-4 text-primary-glow shrink-0 mt-0.5" />
            <div>Mapped native sales signals vs complaint severity scaling proportionately.</div>
          </GlassCard>

          <GlassCard hoverable={false} className="relative !p-2 overflow-hidden">
            {/* Step 2/5: Safe Map Container shell */}
            <div
              ref={mapRef}
              className="w-full rounded-md overflow-hidden bg-black/40"
              style={{ minHeight: "600px", height: "600px" }}
            />

            {/* Filter Toggle Overlay */}
            <div className="absolute top-3 left-3 z-[1500] flex gap-1.5 flex-wrap">
              {CATS.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-mono border transition-all ${
                    cat === c
                      ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/30"
                      : "bg-background/80 backdrop-blur border-primary/30 hover:border-primary text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Step 9/10 View Toggle Overlay */}
            <div className="absolute top-3 right-3 z-[1500] flex gap-1 p-1 bg-background/80 backdrop-blur rounded-full border border-primary/20 shadow-lg">
              {(["both"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setViewMode(m)}
                  className={`px-6 py-1.5 rounded-full text-xs font-mono capitalize transition-all bg-primary text-primary-foreground shadow`}
                >
                  {m}
                </button>
              ))}
            </div>

            {/* Empty State Fallback (Over Map Node) */}
            {(!POINTS || POINTS.length === 0) && (
              <div className="absolute inset-0 z-[1200] flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm text-muted-foreground">
                <Globe className="w-8 h-8 mb-3 opacity-20" />
                <p className="font-mono text-sm">No geographic review data available yet.</p>
              </div>
            )}
            
            {/* Legend Component */}
            <div className="absolute bottom-4 right-4 z-[1500] flex flex-col gap-2 text-xs font-mono text-muted-foreground bg-background/80 backdrop-blur px-3 py-2 rounded border border-primary/20">
              {(viewMode === "sales" || viewMode === "both") && (
                 <div className="flex items-center gap-2">
                    <span className="w-16">Sales</span>
                    <span>Low</span>
                    <span className="w-20 h-2 rounded" style={{ background: "linear-gradient(90deg, #0F2040, #1A6B61, #2EC4B6, #1AFFD5)" }} />
                    <span>High</span>
                 </div>
              )}
              {(viewMode === "complaints" || viewMode === "both") && (
                 <div className="flex items-center gap-2">
                    <span className="w-16">Complaints</span>
                    <span>Low</span>
                    <span className="w-20 h-2 rounded" style={{ background: "linear-gradient(90deg, #2a0a14, #7a1f2b, #d83a4a, #ff5577)" }} />
                    <span>High</span>
                 </div>
              )}
            </div>

          </GlassCard>
        </main>
    </div>
  );
}
