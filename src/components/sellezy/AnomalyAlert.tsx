import { AlertTriangle } from "lucide-react";

export const AnomalyAlert = ({ title, detail }: { title: string; detail: string }) => (
  <div className="border-l-4 border-destructive bg-destructive/10 rounded-md p-3 flex gap-3">
    <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
    <div>
      <div className="font-display font-bold text-sm text-destructive">{title}</div>
      <div className="text-xs text-foreground/80 mt-1">{detail}</div>
    </div>
  </div>
);
