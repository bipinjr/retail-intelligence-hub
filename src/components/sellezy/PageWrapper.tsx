import { motion } from "framer-motion";
import { forwardRef, ReactNode } from "react";

const variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
  exit: { opacity: 0, x: -40, transition: { duration: 0.3 } },
};

export const PageWrapper = forwardRef<HTMLDivElement, { children: ReactNode; className?: string }>(
  ({ children, className }, ref) => (
    <motion.div ref={ref} variants={variants} initial="hidden" animate="visible" exit="exit" className={className}>
      {children}
    </motion.div>
  )
);
PageWrapper.displayName = "PageWrapper";

export const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } },
  item: { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } } },
};
