import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp } from "lucide-react";

export const LikeButton = ({ initial = 24 }: { initial?: number }) => {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initial);
  const [particles, setParticles] = useState<number[]>([]);

  const toggle = () => {
    if (liked) {
      setLiked(false);
      setCount((c) => c - 1);
    } else {
      setLiked(true);
      setCount((c) => c + 1);
      const id = Date.now();
      setParticles((p) => [...p, id]);
      setTimeout(() => setParticles((p) => p.filter((x) => x !== id)), 700);
    }
  };

  return (
    <button onClick={toggle} className="relative inline-flex items-center gap-1 text-xs">
      <motion.span
        whileTap={{ scale: 0.85 }}
        animate={{ scale: liked ? [1, 1.4, 1] : 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className="inline-flex"
      >
        <ThumbsUp className={`w-3.5 h-3.5 transition-colors ${liked ? "fill-primary-glow text-primary-glow" : "text-muted-foreground"}`} />
      </motion.span>
      <span className={liked ? "text-primary-glow" : "text-muted-foreground"}>{count}</span>
      <AnimatePresence>
        {particles.map((id) => (
          <motion.span
            key={id}
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -28 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="absolute left-2 -top-1 text-[10px] font-mono text-primary-glow pointer-events-none"
          >
            +1
          </motion.span>
        ))}
      </AnimatePresence>
    </button>
  );
};
