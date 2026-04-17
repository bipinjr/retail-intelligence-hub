import { useState, useRef, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

import { ChatBubble } from "@/components/sellezy/ChatBubble";
import { GlassCard } from "@/components/sellezy/GlassCard";
import { Send, Mic, Lightbulb, ChevronDown } from "lucide-react";
import { LANGUAGES } from "@/lib/mockData";
import { motion, AnimatePresence } from "framer-motion";

type Msg = { role: "user" | "bot"; text: string; timestamp: string };

const NEG_KEYWORDS = ["bad", "worst", "problem", "complaint", "angry", "disappointed", "terrible", "horrible"];

const respond = (input: string): string => {
  const t = input.toLowerCase();
  if (NEG_KEYWORDS.some((w) => t.includes(w))) {
    return "I'm sorry to hear that! 😞 For SELLEZY producers, our system flags repeated complaints like this automatically. As a consumer, you can report this issue and it feeds directly into our quality pipeline — helping brands improve. Would you like to file a formal review? 📝";
  }
  if (t.includes("iphone") || t.includes("best time")) {
    return "Based on review patterns, iPhones typically see best deals during Diwali (Oct) and Republic Day (Jan) sales. Sentiment on battery life is currently 84% positive — a great time to buy! 📱";
  }
  if (t.includes("fmcg") || t.includes("food")) {
    return "Top FMCG this week: 1. Amul products (92% quality sentiment) 2. Tata Sampann (88%) 3. MTR Foods (85%). Delivery sentiment is 79% positive nationwide. 🛒";
  }
  if (t.includes("delivery")) {
    return "Delivery sentiment trends: Tier-1 cities at 84% positive, Tier-2 at 71%. Tamil Nadu showing 8% drop this month — flagged. ⏱️";
  }
  if (t.includes("phone") && t.includes("20")) {
    return "Top picks under ₹20,000 this week: Redmi Note 13 (87% positive), Realme Narzo 70 (82%), Samsung M15 (79%). Battery & camera sentiment leading the picks. 📱";
  }
  return "That's a great question! Let me check the latest review patterns for you... Based on 3,940 verified reviews, sentiment skews positive (78%) with packaging being the most-mentioned improvement area. Want me to drill down by category?";
};

const QUICK = [
  "Best phone under ₹20,000",
  "Is this a good time to buy an iPhone?",
  "Top rated FMCG products",
  "Show me review trends",
];

const ts = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export default function ConsumerChatbot() {
  const { role } = useAuth();
  const [messages, setMessages] = useState<Msg[]>([
    { role: "bot", text: "Hey! 👋 I'm your SELLEZY Assistant. I can help you find the best products, understand reviews, and discover deals. What are you looking for today?", timestamp: ts() },
    { role: "bot", text: "Or pick a quick question 👇", timestamp: ts() },
  ]);
  const [input, setInput] = useState("");
  const [distress, setDistress] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [chatLang, setChatLang] = useState("EN");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setDistress(NEG_KEYWORDS.some((w) => input.toLowerCase().includes(w)));
  }, [input]);

  if (role !== "consumer") return <Navigate to="/home" replace />;

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Msg = { role: "user", text, timestamp: ts() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [...m, { role: "bot", text: respond(text), timestamp: ts() }]);
    }, 600);
  };

  return (
    <>
        <main className="container py-6 max-w-3xl">
          <GlassCard hoverable={false} className="!p-0 flex flex-col h-[calc(100vh-160px)]">
            {/* header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-primary/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-xs font-display font-bold text-primary-foreground">S</div>
                <div>
                  <div className="font-display font-bold text-sm">SELLEZY Assistant</div>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-success pulse-dot" /> Online
                  </div>
                </div>
              </div>
              <div className="relative">
                <button onClick={() => setLangOpen((o) => !o)} className="lang-pill inline-flex items-center gap-1">
                  {chatLang} <ChevronDown className="w-3 h-3" />
                </button>
                {langOpen && (
                  <div className="absolute right-0 mt-2 glass-card p-1 z-20 min-w-[120px]">
                    {LANGUAGES.map((l) => (
                      <button key={l.code} onClick={() => { setChatLang(l.code); setLangOpen(false); }}
                        className="block w-full text-left px-3 py-1.5 text-xs rounded font-mono hover:bg-primary/15">
                        {l.label} · {l.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-3">
              <AnimatePresence initial={false}>
                {messages.map((m, i) => <ChatBubble key={i} {...m} />)}
              </AnimatePresence>
              {messages.length <= 2 && (
                <div className="flex flex-wrap gap-2 pt-2 ml-9">
                  {QUICK.map((q) => (
                    <button key={q} onClick={() => send(q)} className="px-3 py-1.5 rounded-full text-xs border border-primary/40 hover:bg-primary/15 hover:border-primary transition-all">
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* distress hint */}
            <AnimatePresence>
              {distress && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                  className="mx-5 mb-2 border-l-4 border-accent bg-accent/10 rounded-md p-3 text-sm"
                >
                  <div className="flex items-center gap-2 text-accent mb-1.5"><Lightbulb className="w-4 h-4" /> <span className="font-display font-bold text-xs">Sounds frustrating</span></div>
                  <ul className="text-xs text-foreground/85 space-y-0.5 list-disc list-inside">
                    <li>Brands often respond within 48h to flagged reviews</li>
                    <li>Similar complaints help our pipeline cluster issues</li>
                    <li>You can request replacement or refund via the seller</li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>

            {/* input */}
            <div className="p-3 border-t border-primary/20">
              <div className="flex items-center gap-2 bg-input/60 border border-primary/20 rounded-full pr-2 pl-4">
                <input
                  value={input} onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send(input)}
                  placeholder="Ask about products, reviews, deals..."
                  className="flex-1 bg-transparent py-2.5 text-sm focus:outline-none"
                />
                <button disabled className="text-muted-foreground/50 p-1.5" aria-label="Voice input"><Mic className="w-4 h-4" /></button>
                <button onClick={() => send(input)} className="btn-glow w-9 h-9 rounded-full flex items-center justify-center" aria-label="Send">
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <div className="text-[10px] text-muted-foreground text-center mt-2 font-mono">
                Powered by SELLEZY AI · Reviews in हिन्दी, தமிழ் translated automatically
              </div>
            </div>
          </GlassCard>
        </main>
      </>
  );
}
