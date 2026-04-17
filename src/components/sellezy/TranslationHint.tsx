import { Globe } from "lucide-react";

export const TranslationHint = ({ lang }: { lang?: string }) => (
  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 border border-primary/30 text-xs text-primary-glow font-mono">
    <Globe className="w-3 h-3" />
    Translated from {lang ?? "हिन्दी"} — AI normalisation layer applied
  </div>
);
