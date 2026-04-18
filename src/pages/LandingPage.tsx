import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Logo } from "@/components/sellezy/Logo";
import { GlassCard } from "@/components/sellezy/GlassCard";
import { StatCard } from "@/components/sellezy/StatCard";
import { PageWrapper, stagger } from "@/components/sellezy/PageWrapper";
import { ArrowRight, VolumeX, MessageSquareQuote, Search, BarChart3, Smartphone, ShoppingCart, Shirt } from "lucide-react";
import { BarChart, Bar, ResponsiveContainer } from "recharts";

// Legacy FloatingDots removed in favor of InteractiveNeuralVortex

const headlineWords = ["Turn", "Noise", "Into", "Intelligence."];

const PIPELINE = [
  { icon: VolumeX, title: "Noise Reduction", desc: "Deduplication, spam filter, emoji & Hinglish normalisation" },
  { icon: MessageSquareQuote, title: "Sentiment Analysis", desc: "Feature-level: battery, taste, packaging, delivery, durability, support" },
  { icon: Search, title: "Quality Inference", desc: "Time-series anomaly detection, batch-window trend analysis" },
  { icon: BarChart3, title: "Business Solutions", desc: "Ranked recommendations, supply chain signals, role-specific output" },
];

const CATEGORIES = [
  { icon: Smartphone, label: "Electronics", grad: "from-primary/20 to-primary-glow/10", data: [{ v: 60 }, { v: 80 }, { v: 45 }] },
  { icon: ShoppingCart, label: "FMCG", grad: "from-accent/20 to-amber-300/10", data: [{ v: 50 }, { v: 75 }, { v: 90 }] },
  { icon: Shirt, label: "Apparel", grad: "from-purple-500/20 to-pink-400/10", data: [{ v: 70 }, { v: 55 }, { v: 85 }] },
];

const Pipeline = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <section className="container py-20" ref={ref}>
      <h2 className="font-display font-bold text-3xl md:text-5xl text-center mb-3">Four Stages. One Clear Picture.</h2>
      <p className="text-center text-muted-foreground mb-12">From raw multilingual chaos to actionable intelligence in seconds.</p>
      <div className="relative grid grid-cols-1 md:grid-cols-4 gap-5">
        <svg className="hidden md:block absolute top-1/2 left-0 right-0 -translate-y-1/2 w-full h-2 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 1">
          <motion.line
            x1="0" y1="0.5" x2="100" y2="0.5"
            stroke="hsl(174 62% 47%)" strokeWidth="0.3" strokeDasharray="1 1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: inView ? 1 : 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </svg>
        {PIPELINE.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
            className="relative z-10"
          >
            <GlassCard topAccent className="h-full text-center group">
              <motion.div className="inline-flex" whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                <p.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
              </motion.div>
              <div className="font-mono text-[10px] text-muted-foreground mb-1">STAGE {i + 1}</div>
              <h3 className="font-display font-bold text-lg mb-2">{p.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default function LandingPage() {
  return (
    <PageWrapper>
      {/* HERO */}
      <section className="relative min-h-screen flex flex-col">
        <nav className="container flex items-center justify-between py-6 relative z-10">
          <Logo size={32} />
          <div className="hidden md:flex items-center gap-6">
            <a href="#how" className="text-sm text-muted-foreground hover:text-primary-glow transition">How it Works</a>
            <a href="#pipeline" className="text-sm text-muted-foreground hover:text-primary-glow transition">For Producers</a>
            <a href="#categories" className="text-sm text-muted-foreground hover:text-primary-glow transition">For Consumers</a>
            <Link to="/login/consumer" className="btn-glow inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-mono font-medium">
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </nav>

        <div className="container flex-1 flex flex-col items-center justify-center text-center relative z-10 py-20 backdrop-blur-[2px]">
          <motion.h1
            variants={stagger.container}
            initial="hidden"
            animate="visible"
            className="font-display font-extrabold text-5xl md:text-7xl lg:text-8xl leading-[1.05] mb-6"
          >
            {headlineWords.map((w, i) => (
              <motion.span
                key={i}
                variants={stagger.item}
                className={`inline-block mr-3 ${i === 3 ? "text-gradient-teal" : "text-foreground"}`}
              >
                {w}
              </motion.span>
            ))}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-base md:text-lg text-muted-foreground max-w-2xl mb-10"
          >
            SELLEZY processes multilingual Indian e-commerce reviews — Hindi, Tamil, Hinglish and more — and delivers role-specific business intelligence in seconds.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 mb-10"
          >
            <Link to="/login/producer" className="btn-glow inline-flex items-center gap-2 px-6 py-3 rounded-full font-mono">
              Producer Login <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login/consumer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-mono border border-primary text-primary-glow hover:bg-primary/15 transition-all"
            >
              Consumer Login <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="container py-20" id="how">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <StatCard label="Reviews Processed" count={200000} suffix="+" />
          <StatCard label="Indian Languages" count={6} />
          <StatCard label="AI Pipeline Stages" count={4} />
          <StatCard label="Stakeholder Roles" count={3} />
        </div>
      </section>

      {/* PIPELINE */}
      <div id="pipeline"><Pipeline /></div>

      {/* CATEGORIES */}
      <section className="container py-20" id="categories">
        <h2 className="font-display font-bold text-3xl md:text-5xl text-center mb-3">Cross-category sentiment, built in.</h2>
        <p className="text-center text-muted-foreground mb-12">Compare three core retail verticals at a glance.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {CATEGORIES.map((c) => (
            <GlassCard key={c.label} className={`overflow-hidden bg-gradient-to-br ${c.grad}`}>
              <c.icon className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-display font-bold text-2xl mb-2">{c.label}</h3>
              <div className="h-12 w-20 mt-3">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={c.data}>
                    <Bar dataKey="v" fill="hsl(174 62% 47%)" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      <footer className="container py-12 border-t border-primary/15 text-center">
        <Logo size={24} />
        <p className="text-sm text-muted-foreground mt-3">Turn noise into intelligence.</p>
        <p className="text-xs text-muted-foreground/70 mt-2 font-mono">
          Hack Malenadu '26 · Consumer & Retail Track · Team: Bipin A · Manoj Bharadwaj · Darshan HS · Lohith L
        </p>
      </footer>
    </PageWrapper>
  );
}
