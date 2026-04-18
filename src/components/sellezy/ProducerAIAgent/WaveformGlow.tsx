import { motion } from "framer-motion";

interface WaveformGlowProps {
  isListening: boolean;
  isProcessing: boolean;
}

const WaveformGlow = ({ isListening, isProcessing }: WaveformGlowProps) => {
  if (!isListening && !isProcessing) return null;

  const bars = Array.from({ length: 8 });
  
  return (
    <div className="flex items-center gap-1 h-8 justify-center">
      {bars.map((_, i) => (
        <motion.div
          key={i}
          animate={{
            height: isProcessing 
              ? [8, 16, 8] 
              : isListening 
                ? [4, 24, 6, 20, 4] 
                : 4,
            opacity: [0.4, 1, 0.4]
          }}
          transition={{
            duration: isProcessing ? 0.6 : 0.8,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut"
          }}
          className="w-1 rounded-full bg-primary shadow-[0_0_10px_rgba(44,177,165,0.8)]"
        />
      ))}
    </div>
  );
};

export default WaveformGlow;
