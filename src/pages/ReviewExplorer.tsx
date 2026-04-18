import { useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useReviews } from "@/hooks/useReviews";

import { GlassCard } from "@/components/sellezy/GlassCard";
import { FeatureChip } from "@/components/sellezy/FeatureChip";
import { ReviewCard } from "@/components/sellezy/ReviewCard";
import { ReviewSubmissionForm } from "@/components/sellezy/ReviewSubmissionForm";
import { insertReview } from "@/lib/reviews";
import { Zap, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Centralized normalized structure that the entire UI trusts blindly.
export interface NormalizedReview {
  id: string;
  productName: string;
  reviewerName: string;
  reviewText: string;
  rating: number;
  sentiment: string;
  labels: string[];
  city: string;
  source: string;
  platform: string;
  createdAt: string | null;
  verified: boolean;
  language: string;
  features: string[];
  sentimentShift: null;
}

// Strictly converts a potentially broken raw row into standard UI shape
const normalizeReviewRow = (row: any): NormalizedReview => {
  return {
    id: row?.id || crypto.randomUUID(),
    productName: row?.product_name || "Unknown Product",
    reviewerName: row?.reviewer_name || "Anonymous Shopper",
    reviewText: row?.review_text || "",
    rating: Number(row?.rating ?? 0) || 5, // fallback to positive standard if corrupt
    sentiment: row?.sentiment || "pending",
    labels: Array.isArray(row?.label_tags) ? row.label_tags : [],
    city: row?.city || "Unknown City",
    source: row?.source || "consumer_app",
    platform: row?.platform || "Unknown",
    createdAt: row?.created_at ? new Date(row.created_at).toLocaleDateString() : null,
    verified: false,
    language: "EN",
    features: Array.isArray(row?.label_tags) ? row.label_tags : [],
    sentimentShift: null,
  };
};

const FEATURES = ["Delivery", "Quality", "Durability", "Taste", "Packaging", "Support", "Value", "Battery", "Camera", "Fit"];
const SENTIMENTS = ["All", "Positive", "Neutral", "Negative"];

const DEMO_CITIES = ["Bangalore", "Mumbai", "Delhi", "Hyderabad", "Pune", "Chennai", "Kolkata"];
const DEMO_PRODUCTS = ["Sellezy Pro Max", "Eco-Sense Cleaner", "Luxe Cotton Tee", "Swift Brew Coffee", "Glow-Up Serum", "HydraBottle 2.0", "SmartDesk Pro"];
const DEMO_NAMES = ["Rahul S.", "Priya K.", "Ankit M.", "Sneha P.", "Vikram R.", "Aisha G.", "Amit B.", "Deepak L.", "Megha J."];
const DEMO_TEMPLATES = {
  Positive: ["Amazing quality, really impressed with the speed of delivery!", "Exactly what I was looking for. 5 stars!", "The best purchase I've made this year. So elegant."],
  Neutral: ["It's decent for the price, but the color was slightly different.", "Good product but packaging could be better.", "Satisfied but took a bit long to arrive."],
  Negative: ["Not happy with the build quality. Returning it.", "Doesn't work as expected. Disappointed.", "The size is way off from the charts."]
};

export default function ReviewExplorer() {
  const { role } = useAuth();
  const [activeFeatures, setActiveFeatures] = useState<string[]>([]);
  const [sentimentFilter, setSentimentFilter] = useState("All");
  const [isSimulating, setIsSimulating] = useState(false);

  // Hook specifically guards undefined behavior internally now.
  const { reviews: dbRows, isLoading } = useReviews();

  const handleSimulate = async () => {
    if (isSimulating) return;
    setIsSimulating(true);
    
    const count = Math.floor(Math.random() * 4) + 5; // 5-8 reviews
    toast.info(`🚀 Starting simulation: Injecting ${count} live reviews...`);

    for (let i = 0; i < count; i++) {
      const sentiment = ["Positive", "Positive", "Neutral", "Negative"][Math.floor(Math.random() * 4)];
      const rating = sentiment === "Positive" ? 5 : sentiment === "Neutral" ? 3 : 2;
      const product = DEMO_PRODUCTS[Math.floor(Math.random() * DEMO_PRODUCTS.length)];
      const city = DEMO_CITIES[Math.floor(Math.random() * DEMO_CITIES.length)];
      const name = DEMO_NAMES[Math.floor(Math.random() * DEMO_NAMES.length)];
      const templates = DEMO_TEMPLATES[sentiment as keyof typeof DEMO_TEMPLATES];
      const text = templates[Math.floor(Math.random() * templates.length)];

      await insertReview({
        product_id: product.toLowerCase().replace(/\s+/g, '-'),
        product_name: product,
        reviewer_name: name,
        review_text: text,
        rating: rating,
        city: city,
        sentiment: sentiment,
        label_tags: [FEATURES[Math.floor(Math.random() * FEATURES.length)]],
        latitude: null,
        longitude: null,
        source: "Sellezy Simulator",
      });

      // Randomized delay between 800ms and 2000ms
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
    }

    setIsSimulating(false);
    toast.success("✅ Simulation complete! Dashboard updated via Realtime.");
  };

  // 1. Secure Execution Layer
  // Raw rows are pushed immediately through normalizing sanitization.
  const normalizedReviews = useMemo(() => {
    if (!Array.isArray(dbRows)) return [];
    return dbRows.map(normalizeReviewRow);
  }, [dbRows]);

  // 2. Filter computation runs ONLY on normalized safe objects natively!
  const filtered = useMemo(() => {
    return normalizedReviews.filter((r) => {
      // Because we normalized, r cannot be undefined, but we safe-guard globally.
      if (!r) return false;
      
      if (sentimentFilter !== "All") {
         if (r.sentiment !== sentimentFilter) return false;
      }
      return true;
    });
  }, [normalizedReviews, sentimentFilter]);

  if (role !== "consumer") return <Navigate to="/home" replace />;

  const toggleFeat = (f: string) =>
    setActiveFeatures((a) => a.includes(f) ? a.filter((x) => x !== f) : [...a, f]);

  return (
    <main className="container py-10 space-y-6">
      <div>
        <h1 className="font-display font-extrabold text-3xl md:text-5xl">Live Review Dash</h1>
        <p className="text-muted-foreground mt-1">Direct from the Supabase public.reviews intelligence network.</p>
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="space-y-5">
          <GlassCard hoverable={false} className="space-y-5">
            <div>
              <div className="text-xs font-mono text-muted-foreground uppercase mb-2">Labels</div>
              <div className="flex flex-wrap gap-1.5">
                {FEATURES.map((f) => (
                  <FeatureChip key={f} label={f} active={activeFeatures.includes(f)} onClick={() => toggleFeat(f)} />
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-mono text-muted-foreground uppercase mb-2">Sentiment</div>
              <div className="flex flex-wrap gap-1.5">
                {SENTIMENTS.map((s) => (
                  <FeatureChip key={s} label={s} active={sentimentFilter === s} onClick={() => setSentimentFilter(s)} />
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-primary/20">
              <button
                onClick={handleSimulate}
                disabled={isSimulating}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-mono text-xs uppercase tracking-tight transition-all active:scale-95 ${
                  isSimulating 
                    ? "bg-primary/10 text-muted-foreground cursor-not-allowed" 
                    : "bg-primary/20 text-primary-glow border border-primary/30 hover:bg-primary/30 hover:border-primary/50 shadow-lg shadow-primary/10"
                }`}
              >
                {isSimulating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4 fill-primary" />
                )}
                {isSimulating ? "Simulating..." : "Simulate Live Reviews"}
              </button>
              <p className="text-[10px] text-muted-foreground mt-2 text-center leading-tight">
                Instantly inject 5–10 random reviews into the live database.
              </p>
            </div>
          </GlassCard>
        </aside>

        {/* Grid Area */}
        <div className="flex flex-col gap-6">
          <ReviewSubmissionForm />
          
          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-4 animate-pulse">
              {[1, 2].map((i) => (
                <GlassCard key={i} className="h-48 border-primary/20 bg-primary/5" hoverable={false} />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {filtered.map((r) => (
                <ReviewCard key={r.id} review={r} />
              ))}
              
              {filtered.length === 0 && (
                <GlassCard hoverable={false} className="md:col-span-2 text-center py-12 flex flex-col items-center justify-center space-y-3">
                   <div className="text-4xl">🗂️</div>
                   <h3 className="font-display font-bold text-lg text-foreground/90">No reviews found</h3>
                   <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                     The database returned empty or our filters hid the results. Submit the first review to see live insights directly!
                   </p>
                </GlassCard>
              )}
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
