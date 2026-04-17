import { useState } from "react";
import { GlassCard } from "./GlassCard";
import { insertReview } from "@/lib/reviews";
import { Star, Send } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export function ReviewSubmissionForm({ onSuccess }: { onSuccess?: () => void }) {
  const { user, profile } = useAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productName, setProductName] = useState("");
  const [city, setCity] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName || !city || !reviewText || rating === 0) {
      toast.error("Please fill all required fields and select a rating.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: result, error } = await insertReview({
        product_id: productName.toLowerCase().replace(/\s+/g, '-'),
        product_name: productName,
        reviewer_name: profile?.full_name || user?.email || "Verified Consumer",
        review_text: reviewText,
        rating: rating,
        city: city,
        sentiment: "pending", // Default pending pipeline analysis
        label_tags: [],
        latitude: null, // Resolves server side typically or via native IP mappings
        longitude: null,
        source: "Sellezy Native Portal",
      });

      if (error) {
         toast.error(`Database Error: ${error}\nHave you executed the schema in Supabase yet?`);
         return;
      }

      if (result) {
        toast.success("Review successfully submitted!");
        setProductName("");
        setCity("");
        setRating(0);
        setReviewText("");
        onSuccess?.();
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GlassCard hoverable={false} className="p-5 border-primary/30 flex flex-col gap-4">
      <div className="flex items-center gap-2 border-b border-primary/20 pb-3">
        <Send className="w-5 h-5 text-primary-glow" />
        <h3 className="font-display font-semibold text-lg">Share Your Experience</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-mono text-muted-foreground uppercase">Product Name</label>
            <input
              type="text"
              required
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full bg-background/50 border border-primary/20 focus:border-primary rounded-md p-2 text-sm text-foreground outline-none transition-colors"
              placeholder="e.g. Smart Watch Pro"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-muted-foreground uppercase">City</label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-background/50 border border-primary/20 focus:border-primary rounded-md p-2 text-sm text-foreground outline-none transition-colors"
              placeholder="e.g. Bangalore"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-mono text-muted-foreground uppercase">Rating</label>
          <div className="flex items-center gap-1 group">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-6 h-6 cursor-pointer transition-colors ${
                  (hoveredRating || rating) >= star ? "fill-accent text-accent" : "text-muted-foreground/40 hover:text-accent/60"
                }`}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-mono text-muted-foreground uppercase">Your Review</label>
          <textarea
            required
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="w-full min-h-[100px] bg-background/50 border border-primary/20 focus:border-primary rounded-md p-3 text-sm text-foreground outline-none transition-colors resize-y"
            placeholder="Tell us what you loved (or hated) about the product..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full font-mono uppercase text-sm py-2.5 rounded-md transition-all ${
            isSubmitting
              ? "bg-primary/50 text-white/50 cursor-not-allowed"
              : "bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/30"
          }`}
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </GlassCard>
  );
}
