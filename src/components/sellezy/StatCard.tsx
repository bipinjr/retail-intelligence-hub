import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";
import { GlassCard } from "./GlassCard";
import { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  count: number;
  suffix?: string;
  icon?: LucideIcon;
}

export const StatCard = ({ label, count, suffix = "", icon: Icon }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 60, damping: 18 });
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (inView) mv.set(count);
  }, [inView, count, mv]);

  useEffect(() => {
    return spring.on("change", (v) => {
      if (numRef.current) numRef.current.textContent = Math.round(v).toLocaleString();
    });
  }, [spring]);

  return (
    <GlassCard topAccent className="text-center">
      <div ref={ref}>
        {Icon && <Icon className="w-6 h-6 mx-auto mb-3 text-primary" />}
        <div className="font-display font-bold text-3xl md:text-4xl text-primary-glow">
          <span ref={numRef}>0</span>
          <span>{suffix}</span>
        </div>
        <div className="text-sm text-muted-foreground mt-1 font-body">{label}</div>
      </div>
    </GlassCard>
  );
};
