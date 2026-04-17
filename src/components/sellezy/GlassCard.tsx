import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode, forwardRef } from "react";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  topAccent?: boolean;
  hoverable?: boolean;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, className, topAccent, hoverable = true, ...props }, ref) => (
    <motion.div
      ref={ref}
      whileHover={hoverable ? { scale: 1.025, y: -4 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn("glass-card p-5", topAccent && "glass-card-top-accent", className)}
      {...props}
    >
      {children}
    </motion.div>
  )
);
GlassCard.displayName = "GlassCard";
