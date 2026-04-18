import { GlassCard } from "./GlassCard";
import { QualityBadge } from "./QualityBadge";
import { PersonaLabel } from "./PersonaLabel";
import { SentimentBar } from "./SentimentBar";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { NormalizedReview } from "@/pages/ReviewExplorer";

interface Props {
  review: NormalizedReview;
}

export const ReviewCard = ({ review }: Props) => {
  // Gracefully skip render blocks if somehow the object itself is physically missing
  if (!review) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <GlassCard
        hoverable={false}
        className="p-4 space-y-3"
      >
        <div className="flex flex-wrap gap-1.5">
          {review.verified && <QualityBadge type="verified" />}
          <QualityBadge type="detailed" />
          {review.platform && review.platform !== "Unknown" && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono border border-accent/30 bg-accent/10 text-accent">
              {review.platform}
            </span>
          )}
        </div>
        
        <p className="text-sm text-foreground/90 leading-relaxed font-medium">
          {review.productName}
        </p>

        <p className="text-sm text-foreground/80 leading-relaxed border-l-2 border-primary/20 pl-3">
          "{review.reviewText}"
        </p>
        
        {review.labels.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {review.labels.map((p, idx) => <PersonaLabel key={`${p}-${idx}`} type={p} />)}
          </div>
        )}
        
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? "fill-accent text-accent" : "text-muted-foreground/40"}`} />
          ))}
        </div>
        
        <div className="space-y-1">
          <SentimentBar label="General Sentiment" score={review.sentiment === 'Positive' ? 90 : review.sentiment === 'Negative' ? 20 : 50} />
          {review.features.map((f, idx) => (
             <SentimentBar key={`${f}-${idx}`} label={f} score={50} /> 
          ))}
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-primary/10">
          <span className="font-mono">{review.reviewerName}</span>
          <span>{review.createdAt || "Recent"}</span>
        </div>
      </GlassCard>
    </motion.div>
  );
};
