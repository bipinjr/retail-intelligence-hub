import { CheckCircle2, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

export const Logo = ({ size = 28 }: { size?: number }) => (
  <Link to="/" className="inline-flex items-center gap-2 group" aria-label="SELLEZY home">
    <div className="relative" style={{ width: size, height: size }}>
      <BarChart3 className="absolute inset-0 text-primary" style={{ width: size, height: size }} />
      <CheckCircle2
        className="absolute -bottom-0.5 -right-0.5 text-primary-glow bg-background rounded-full"
        style={{ width: size * 0.55, height: size * 0.55 }}
      />
    </div>
    <span className="font-display font-extrabold text-xl tracking-tight text-gradient-teal">SELLEZY</span>
  </Link>
);
