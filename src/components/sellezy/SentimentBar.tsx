export const SentimentBar = ({ label, score }: { label: string; score: number }) => {
  const blocks = Math.round((score / 100) * 5);
  return (
    <div className="flex items-center gap-2 text-xs font-mono">
      <span className="w-20 text-muted-foreground">{label}</span>
      <span className="tracking-widest text-primary-glow">
        {"█".repeat(blocks)}
        <span className="text-muted-foreground/40">{"░".repeat(5 - blocks)}</span>
      </span>
      <span className="text-foreground/80">{score}%</span>
    </div>
  );
};
