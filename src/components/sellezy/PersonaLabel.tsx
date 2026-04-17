export const PersonaLabel = ({ type }: { type: string }) => (
  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-accent/15 border border-accent/40 text-accent font-mono">
    {type}
  </span>
);
