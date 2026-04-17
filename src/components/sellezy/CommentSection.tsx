import { useState, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";

export type Comment = { user: string; initials: string; text: string };

export const CommentSection = ({ open, seed }: { open: boolean; seed: Comment[] }) => {
  const [comments, setComments] = useState<Comment[]>(seed);
  const [draft, setDraft] = useState("");

  const submit = () => {
    const text = draft.trim();
    if (!text) return;
    setComments((c) => [...c, { user: "You", initials: "YO", text }]);
    setDraft("");
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") submit();
  };

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden border-t border-primary/10 mt-2"
        >
          <div className="space-y-2 pt-3">
            <AnimatePresence initial={false}>
              {comments.map((c, i) => (
                <motion.div
                  key={`${c.user}-${i}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-2"
                >
                  <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-[10px] font-display font-bold text-primary-glow shrink-0">
                    {c.initials}
                  </div>
                  <div className="flex-1 bg-input/40 rounded-lg px-3 py-2">
                    <div className="text-[11px] font-mono text-primary-glow">{c.user}</div>
                    <div className="text-xs text-foreground/85">{c.text}</div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div className="flex items-center gap-2 pt-1">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onKey}
                placeholder="Write a comment…"
                className="flex-1 bg-input/60 border border-primary/20 rounded-md px-3 py-1.5 text-xs focus:border-primary focus:outline-none"
              />
              <button
                onClick={submit}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-mono bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Send className="w-3 h-3" /> Post
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
