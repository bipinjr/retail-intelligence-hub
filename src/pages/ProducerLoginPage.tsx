import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Lock, Eye, EyeOff, ArrowRight, Factory, BarChart3 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { PageWrapper } from "@/components/sellezy/PageWrapper";
import { GlassCard } from "@/components/sellezy/GlassCard";
import { Logo } from "@/components/sellezy/Logo";
import { useEffect } from "react";

const QUOTES = [
  "Early defect signals before the market notices.",
  "Supply chain insights from 200K+ reviews.",
  "Quality incidents flagged in near real-time.",
];

export default function ProducerLoginPage() {
  const [email, setEmail] = useState("demo@producer.in");
  const [password, setPassword] = useState("demo1234");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [qIdx, setQIdx] = useState(0);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const t = setInterval(() => setQIdx((i) => (i + 1) % QUOTES.length), 4000);
    return () => clearInterval(t);
  }, []);

  const onLogin = () => {
    login("producer");
    setTimeout(() => navigate("/home"), 100);
  };

  return (
    <PageWrapper>
      <div className="min-h-screen grid md:grid-cols-[55%_45%]">
        {/* LEFT */}
        <div className="hidden md:flex relative bg-bg-secondary p-10 items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
          <div className="relative z-10 max-w-md text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative w-48 h-48 mx-auto mb-10"
            >
              <Factory className="absolute inset-0 m-auto w-32 h-32 text-primary/40" />
              <motion.svg viewBox="0 0 100 100" className="absolute inset-0">
                <motion.path
                  d="M10,80 L30,55 L50,65 L70,30 L90,40"
                  stroke="hsl(174 62% 47%)" strokeWidth="3" fill="none" strokeLinecap="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
              </motion.svg>
              <BarChart3 className="absolute bottom-0 right-0 w-12 h-12 text-primary-glow" />
            </motion.div>
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={qIdx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="italic font-body text-lg text-foreground/80"
              >
                <span className="text-primary-glow text-3xl mr-1">"</span>
                {QUOTES[qIdx]}
                <span className="text-primary-glow text-3xl ml-1">"</span>
              </motion.blockquote>
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-md space-y-6">
            <Logo size={28} />
            <GlassCard hoverable={false} className="p-8 space-y-5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-primary/15 text-primary-glow border border-primary/40">
                <Factory className="w-3 h-3" /> Producer · Manufacturer
              </span>
              <div>
                <h1 className="font-display font-bold text-3xl md:text-4xl">Welcome back,</h1>
                <p className="text-muted-foreground mt-1">Your product intelligence dashboard awaits.</p>
              </div>

              <div className="space-y-3">
                <label className="block">
                  <span className="text-xs font-mono text-muted-foreground">Email</span>
                  <div className="relative mt-1">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      value={email} onChange={(e) => setEmail(e.target.value)} type="email"
                      className="w-full bg-input/60 border border-primary/20 rounded-md pl-10 pr-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </label>
                <label className="block">
                  <span className="text-xs font-mono text-muted-foreground">Password</span>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      value={password} onChange={(e) => setPassword(e.target.value)} type={show ? "text" : "password"}
                      className="w-full bg-input/60 border border-primary/20 rounded-md pl-10 pr-10 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <button onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary-glow" aria-label="Toggle password">
                      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </label>
                <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                  <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="accent-primary" />
                  Remember this device
                </label>
              </div>

              <button onClick={onLogin} className="btn-glow w-full inline-flex items-center justify-center gap-2 py-3 rounded-md font-mono">
                Access Dashboard <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="h-px bg-primary/20 flex-1" /> or <div className="h-px bg-primary/20 flex-1" />
              </div>

              <Link to="/login/consumer" className="block text-center text-sm text-primary-glow hover:underline font-mono">
                I'm a Consumer →
              </Link>
            </GlassCard>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
