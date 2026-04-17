import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShoppingBag, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { PageWrapper } from "@/components/sellezy/PageWrapper";
import { GlassCard } from "@/components/sellezy/GlassCard";
import { LanguagePills } from "@/components/sellezy/LanguagePills";
import { Logo } from "@/components/sellezy/Logo";

const FLOATING_REVIEWS = [
  { rating: 5, text: "बहुत अच्छा फोन है!", lang: "hi" },
  { rating: 4, text: "Great delivery experience.", lang: "en" },
  { rating: 5, text: "சுவை அருமை, மீண்டும் வாங்குவேன்!", lang: "ta" },
  { rating: 4, text: "Packaging could be better.", lang: "en" },
  { rating: 5, text: "Paisa vasool product, top class!", lang: "hinglish" },
  { rating: 4, text: "ভাল মানের কাপড়।", lang: "bn" },
  { rating: 5, text: "स्वाद बहुत अच्छा है!", lang: "hi" },
];

export default function ConsumerLoginPage() {
  const [email, setEmail] = useState("demo@shopper.in");
  const [password, setPassword] = useState("demo1234");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onLogin = () => {
    login("consumer");
    setTimeout(() => navigate("/home"), 100);
  };

  return (
    <PageWrapper>
      <div className="min-h-screen grid md:grid-cols-[55%_45%]">
        {/* LEFT */}
        <div className="hidden md:flex relative bg-bg-secondary p-10 items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent" />
          <div className="relative w-full h-full">
            {FLOATING_REVIEWS.map((r, i) => (
              <motion.div
                key={i}
                initial={{ y: "100vh", opacity: 0, x: 0 }}
                animate={{ y: "-20vh", opacity: [0, 0.85, 0.85, 0], x: ((i % 3) - 1) * 30 }}
                transition={{ duration: 12, delay: i * 1.6, repeat: Infinity, ease: "linear" }}
                className="absolute glass-card p-3 max-w-[200px]"
                style={{ left: `${10 + (i * 12) % 70}%` }}
              >
                <div className="flex items-center gap-0.5 mb-1">
                  {Array.from({ length: r.rating }).map((_, j) => (
                    <Star key={j} className="w-3 h-3 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-xs text-foreground/85">{r.text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-md space-y-6">
            <Logo size={28} />
            <GlassCard hoverable={false} className="p-8 space-y-5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-accent/15 text-accent border border-accent/40">
                <ShoppingBag className="w-3 h-3" /> Consumer · Shopper
              </span>
              <div>
                <h1 className="font-display font-bold text-3xl md:text-4xl">Discover smarter.</h1>
                <p className="text-muted-foreground mt-1">Find products real reviewers actually love.</p>
              </div>

              <div className="space-y-3">
                <label className="block">
                  <span className="text-xs font-mono text-muted-foreground">Email</span>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      value={email} onChange={(e) => setEmail(e.target.value)} type="email"
                      className="w-full bg-input/60 border border-primary/20 rounded-md pl-10 pr-3 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>
                </label>
                <label className="block">
                  <span className="text-xs font-mono text-muted-foreground">Password</span>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      value={password} onChange={(e) => setPassword(e.target.value)} type={show ? "text" : "password"}
                      className="w-full bg-input/60 border border-primary/20 rounded-md pl-10 pr-10 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                    <button onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent" aria-label="Toggle password">
                      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </label>
                <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                  <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="accent-accent" />
                  Remember this device
                </label>
              </div>

              <button onClick={onLogin} className="btn-glow-amber w-full inline-flex items-center justify-center gap-2 py-3 rounded-md font-mono">
                Explore Products <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="h-px bg-primary/20 flex-1" /> or <div className="h-px bg-primary/20 flex-1" />
              </div>

              <Link to="/login/producer" className="block text-center text-sm text-primary-glow hover:underline font-mono">
                I'm a Producer →
              </Link>
            </GlassCard>
            <LanguagePills />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
