import { Download } from "lucide-react";

export const DownloadButton = ({
  format,
  onClick,
}: {
  format: "CSV" | "JSON" | "PDF";
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono border border-primary/40 text-primary-glow hover:bg-primary/15 hover:border-primary transition-all"
  >
    <Download className="w-3.5 h-3.5" />
    Download {format}
  </button>
);
