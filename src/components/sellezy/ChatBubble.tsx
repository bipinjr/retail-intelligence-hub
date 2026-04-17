import { motion } from "framer-motion";

export const ChatBubble = ({ role, text, timestamp }: { role: "user" | "bot"; text: string; timestamp: string }) => {
  const isUser = role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col ${isUser ? "items-end" : "items-start"} gap-1`}
    >
      <div className={`flex items-end gap-2 max-w-[85%] ${isUser ? "flex-row-reverse" : ""}`}>
        {!isUser && (
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-[10px] font-display font-bold text-primary-foreground shrink-0">
            S
          </div>
        )}
        <div
          className={`px-4 py-2.5 text-sm leading-relaxed ${
            isUser
              ? "bg-primary text-primary-foreground rounded-3xl rounded-br-md"
              : "glass-card rounded-2xl rounded-bl-md text-foreground"
          }`}
        >
          {text}
        </div>
      </div>
      <span className={`text-[10px] text-muted-foreground font-mono ${isUser ? "mr-9" : "ml-9"}`}>{timestamp}</span>
    </motion.div>
  );
};
