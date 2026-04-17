import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AppHeader } from "@/components/sellezy/AppHeader";
import { PageWrapper } from "@/components/sellezy/PageWrapper";
import { GlassCard } from "@/components/sellezy/GlassCard";
import { Globe, AlertTriangle } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

type Category = "All" | "Electronics" | "FMCG" | "Apparel";

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

const SALES_GRADIENT = { 0.0: "#0F2040", 0.4: "#1A6B61", 0.7: "#2EC4B6", 1.0: "#1AFFD5" };
const COMPLAINT_GRADIENT = { 0.0: "#2a0a14", 0.4: "#7a1f2b", 0.7: "#d83a4a", 1.0: "#ff5577" };

export default function GeoSalesHeatmap() {
  const { role } = useAuth();
  const [cat, setCat] = useState<Category>("All");
  const [showComplaints, setShowComplaints] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const heatLayer = useRef<L.Layer | null>(null);
  const markerLayer = useRef<L.LayerGroup | null>(null);

  // Init map once
  useEffect(() => {
    console.log("[Heatmap] init effect, mapRef:", !!mapRef.current, "instance:", !!mapInstance.current, "L:", typeof L);
    if (!mapRef.current || mapInstance.current) return;
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
    markerLayer.current = L.layerGroup().addTo(map);

    // Fix tiles not rendering when container size changes (framer-motion transitions)
    const t1 = setTimeout(() => map.invalidateSize(), 100);
    const t2 = setTimeout(() => map.invalidateSize(), 500);
    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(mapRef.current);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      ro.disconnect();
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  // Update heat + markers when filter / mode changes
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    const filtered = cat === "All" ? POINTS : POINTS.filter((p) => p.category === cat);

    if (heatLayer.current) {
      map.removeLayer(heatLayer.current);
      heatLayer.current = null;
    }

    const heatData = filtered.map((p) => [
      p.lat,
      p.lng,
      showComplaints ? p.complaint : p.intensity,
    ]) as [number, number, number][];

    // @ts-expect-error - leaflet.heat augments L at runtime
    heatLayer.current = L.heatLayer(heatData, {
      radius: 35,
      blur: 25,
      maxZoom: 10,
      max: 1.0,
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
        `<div style="font-family: 'JetBrains Mono', monospace; font-size: 11px;">
          <strong style="font-family: 'Syne', sans-serif; font-size: 13px;">${p.city}</strong><br/>
          ${showComplaints ? "Complaints" : "Sales"}: ${Math.round((showComplaints ? p.complaint : p.intensity) * 100)}%<br/>
          Category: ${p.category}
        </div>`,
        { direction: "top", offset: [0, -4] }
      );
      markerLayer.current?.addLayer(marker);
    });
  }, [cat, showComplaints]);

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

          <GlassCard hoverable={false} className="relative !p-2 overflow-hidden">
            {/* Top filter bar */}
            <div className="absolute top-3 left-3 z-[500] flex gap-1.5 flex-wrap">
              {CATS.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-mono border transition-all ${
                    cat === c
                      ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/30"
                      : "bg-background/70 backdrop-blur border-primary/30 hover:border-primary text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Complaint toggle */}
            <button
              onClick={() => setShowComplaints((v) => !v)}
              className={`absolute top-3 right-3 z-[500] px-3 py-1.5 rounded-full text-xs font-mono border transition-all flex items-center gap-1.5 ${
                showComplaints
                  ? "bg-destructive text-destructive-foreground border-destructive"
                  : "bg-background/70 backdrop-blur border-primary/30 hover:border-primary text-foreground"
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              {showComplaints ? "Showing complaints" : "Show complaints"}
            </button>

            <div
              ref={mapRef}
              className="w-full rounded-md overflow-hidden"
              style={{ height: 560, background: "#0d1b2a" }}
            />

            {/* Legend */}
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
            </div>
          </GlassCard>
        </main>
      </PageWrapper>
    </>
  );
}
