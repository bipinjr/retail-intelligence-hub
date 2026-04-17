export const FeatureChip = ({ label, active, onClick }: { label: string; active?: boolean; onClick?: () => void }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-xs font-mono border transition-all ${
      active
        ? "bg-primary text-primary-foreground border-primary shadow-[0_0_16px_hsl(var(--primary)/0.4)]"
        : "bg-bg-card/50 text-foreground border-primary/30 hover:border-primary"
    }`}
  >
    {label}
  </button>
);
