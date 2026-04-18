import { CheckCircle2, FileText, Camera, AlertTriangle } from "lucide-react";

const map = {
  verified: { icon: CheckCircle2, label: "Verified Buyer", cls: "text-primary border-primary/40 bg-primary/10" },
  detailed: { icon: FileText, label: "Detailed Review", cls: "text-primary-glow border-primary-glow/40 bg-primary-glow/10" },
  photo: { icon: Camera, label: "Photo Review", cls: "text-accent border-accent/40 bg-accent/10" },
  flagged: { icon: AlertTriangle, label: "Flagged: Duplicate", cls: "text-destructive border-destructive/40 bg-destructive/10" },
} as const;

export const QualityBadge = ({ type }: { type: keyof typeof map | string }) => {
  const badgeConfig = (map as Record<string, any>)[type?.toLowerCase()] || map.verified;
  const { icon: Icon, label, cls } = badgeConfig;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono border ${cls}`}>
      <Icon className="w-3 h-3" /> {type === "Recent" ? "Recent" : label}
    </span>
  );
};
