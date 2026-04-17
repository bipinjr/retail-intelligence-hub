import { useMemo, useState, useEffect } from "react";
import { Navigate, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

import { GlassCard } from "@/components/sellezy/GlassCard";
import { FeatureChip } from "@/components/sellezy/FeatureChip";
import { ReviewCard } from "@/components/sellezy/ReviewCard";
import { ReviewSubmissionForm } from "@/components/sellezy/ReviewSubmissionForm";
import { REVIEWS_BY_CATEGORY, LANGUAGES, ReviewMock } from "@/lib/mockData";
import { Review } from "@/lib/reviews";
import { useReviews } from "@/hooks/useReviews";

const mapDbReviewToMock = (dbReview: Review): ReviewMock => {
  const sentimentScore = dbReview.sentiment === "Positive" ? 90 : dbReview.sentiment === "Negative" ? 20 : 50;
  
  return {
    id: dbReview.id,
    text: dbReview.review_text || "No review text provided.",
    badges: ["Verified", "Recent"], 
    langOriginal: null,
    highlights: ["good", "great", "bad", "terrible", "excellent", "poor", "fast", "slow", "quality"], 
    personas: dbReview.label_tags || [],
    rating: dbReview.rating || 5,
    features: [{ name: dbReview.sentiment || "General Sentiment", score: sentimentScore }],
    before: 0,
    after: 0,
    helpful: Math.floor(Math.random() * 20),
    category: dbReview.product_name || "Product", 
    date: new Date(dbReview.created_at).toLocaleDateString(),
    lang: "en",
  };
};

const FEATURES = ["Delivery", "Quality", "Durability", "Taste", "Packaging", "Support", "Value", "Battery", "Camera", "Fit"];
const SENTIMENTS = ["All", "Positive", "Neutral", "Negative"];
const CATS = ["electronics", "fmcg", "apparel"] as const;

const sentimentOf = (avg: number): string =>
  avg >= 70 ? "Positive" : avg >= 45 ? "Neutral" : "Negative";

export default function ReviewExplorer() {
  const { role } = useAuth();
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const cat = (CATS as readonly string[]).includes(category ?? "") ? (category as string) : "electronics";
  const [activeFeatures, setActiveFeatures] = useState<string[]>([]);
  const [sentiment, setSentiment] = useState("All");
  const [lang, setLang] = useState("All");
  const [showShift, setShowShift] = useState(false);
  const { reviews: dbReviewsRaw, isLoading } = useReviews();

  const dbReviews = useMemo(() => dbReviewsRaw.map(mapDbReviewToMock), [dbReviewsRaw]);
  const mockReviews = REVIEWS_BY_CATEGORY[cat] ?? [];
  const reviews = useMemo(() => [...dbReviews, ...mockReviews], [dbReviews, mockReviews]);
  const filtered = useMemo(() => reviews.filter((r) => {
    if (lang !== "All" && r.lang !== lang) return false;
    if (sentiment !== "All") {
      const avg = r.features.length ? r.features.reduce((s, f) => s + f.score, 0) / r.features.length : 50;
      if (sentimentOf(avg) !== sentiment) return false;
    }
    return true;
  }), [reviews, lang, sentiment]);

  if (role !== "consumer") return <Navigate to="/home" replace />;

  const toggleFeat = (f: string) =>
    setActiveFeatures((a) => a.includes(f) ? a.filter((x) => x !== f) : [...a, f]);

  return (
    <>
        <main className="container py-10 space-y-6">
          <div>
            <h1 className="font-display font-extrabold text-3xl md:text-5xl">Review Explorer</h1>
            <p className="text-muted-foreground mt-1">Smart, filtered, verified reviews — across 6 languages.</p>
          </div>

          <div className="flex gap-2 flex-wrap">
            {CATS.map((c) => (
              <button key={c} onClick={() => navigate(`/consumer/reviews/${c}`)}
                className={`px-4 py-2 rounded-full text-sm font-mono uppercase border transition-all ${cat === c ? "bg-primary text-primary-foreground border-primary" : "border-primary/30 hover:border-primary"}`}>
                {c}
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-[260px_1fr] gap-6">
            {/* Sidebar */}
            <aside className="space-y-5">
              <GlassCard hoverable={false} className="space-y-5">
                <div>
                  <div className="text-xs font-mono text-muted-foreground uppercase mb-2">Features</div>
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
                      <FeatureChip key={s} label={s} active={sentiment === s} onClick={() => setSentiment(s)} />
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-mono text-muted-foreground uppercase mb-2">Language</div>
                  <div className="flex flex-wrap gap-1.5">
                    <FeatureChip label="All" active={lang === "All"} onClick={() => setLang("All")} />
                    {LANGUAGES.map((l) => (
                      <FeatureChip key={l.code} label={l.label} active={lang === l.code} onClick={() => setLang(l.code)} />
                    ))}
                  </div>
                </div>
                <label className="flex items-center justify-between text-sm cursor-pointer pt-2 border-t border-primary/15">
                  <span>Show sentiment shift</span>
                  <input type="checkbox" checked={showShift} onChange={(e) => setShowShift(e.target.checked)} className="accent-primary" />
                </label>
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
                    <ReviewCard key={r.id} review={r} showShift={showShift} highlightFeatures={activeFeatures} />
                  ))}
                  {filtered.length === 0 && (
                    <GlassCard hoverable={false} className="md:col-span-2 text-center text-muted-foreground py-12">
                      No reviews match these filters.
                    </GlassCard>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </>
  );
}
