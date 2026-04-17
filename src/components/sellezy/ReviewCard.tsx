import { ReviewMock } from "@/lib/mockData";
import { GlassCard } from "./GlassCard";
import { QualityBadge } from "./QualityBadge";
import { TranslationHint } from "./TranslationHint";
import { PersonaLabel } from "./PersonaLabel";
import { SentimentBar } from "./SentimentBar";
import { Star, ThumbsUp } from "lucide-react";
import { motion } from "framer-motion";

const highlight = (text: string, words: string[]) => {
  if (!words.length) return text;
  const re = new RegExp(`(${words.join("|")})`, "gi");
  return text.split(re).map((p, i) =>
    words.some((w) => w.toLowerCase() === p.toLowerCase()) ? (
      <strong key={i} className="text-primary-glow font-bold">{p}</strong>
    ) : (
      <span key={i}>{p}</span>
    )
  );
};

interface Props {
  review: ReviewMock;
  showShift?: boolean;
  highlightFeatures?: string[];
}

export const ReviewCard = ({ review, showShift, highlightFeatures = [] }: Props) => {
  const isHighlighted = highlightFeatures.length > 0 && review.features.some((f) => highlightFeatures.includes(f.name));
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <GlassCard
        hoverable={false}
        className={`p-4 space-y-3 ${isHighlighted ? "border-l-4 !border-l-primary" : ""}`}
      >
        <div className="flex flex-wrap gap-1.5">
          {review.badges.map((b) => <QualityBadge key={b} type={b} />)}
        </div>
        {review.langOriginal && <TranslationHint lang={review.langOriginal} />}
        <p className="text-sm text-foreground/90 leading-relaxed">{highlight(review.text, review.highlights)}</p>
        {review.personas.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {review.personas.map((p) => <PersonaLabel key={p} type={p} />)}
          </div>
        )}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? "fill-accent text-accent" : "text-muted-foreground/40"}`} />
          ))}
        </div>
        <div className="space-y-1">
          {review.features.map((f) => <SentimentBar key={f.name} label={f.name} score={f.score} />)}
        </div>
        {showShift && review.before > 0 && (
          <div className="space-y-1 pt-2 border-t border-primary/20">
            <SentimentBar label="Older" score={review.before} />
            <SentimentBar label="Recent" score={review.after} />
            {review.after > review.before && (
              <div className="text-xs text-primary-glow font-mono">▲ Brand improved by {review.after - review.before}%</div>
            )}
          </div>
        )}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-primary/10">
          <span className="inline-flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {review.helpful}</span>
          <span>{review.date}</span>
          <span className="text-primary-glow">{review.category}</span>
        </div>
      </GlassCard>
    </motion.div>
  );
};
