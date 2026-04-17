import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LanguageContext";
import { Navigate, Link } from "react-router-dom";
import { PageWrapper, stagger } from "@/components/sellezy/PageWrapper";
import { AppHeader } from "@/components/sellezy/AppHeader";
import { GlassCard } from "@/components/sellezy/GlassCard";
import { StatCard } from "@/components/sellezy/StatCard";
import { motion } from "framer-motion";
import {
  Inbox, FileBarChart, Languages, Activity, GitCompare, BellRing,
  Map, Bot, Trophy, SearchCheck, Tag, TrendingUp, ArrowRight,
} from "lucide-react";
import { PRODUCER_TICKER, CONSUMER_TICKER } from "@/lib/mockData";

const PRODUCER_FEATURES = [
  { icon: Inbox, title: "Sentiment Pipeline", desc: "4-stage AI pipeline status and insights", to: "/producer/sentiment" },
  { icon: FileBarChart, title: "Downloadable Reports", desc: "Export CSV, PDF or JSON reports by category", to: "/producer/reports" },
  { icon: Languages, title: "Multilingual Overview", desc: "Coverage across EN, हिन्दी, தமிழ், বাংলা, मराठी, Hinglish", to: "/producer/sentiment" },
  { icon: Activity, title: "Product Health Scores", desc: "Per-product quality and defect tracking", to: "/producer/sentiment" },
  { icon: GitCompare, title: "Category Comparison", desc: "Electronics vs FMCG vs Apparel sentiment cross-view", to: "/producer/sentiment" },
  { icon: BellRing, title: "Anomaly Alerts", desc: "Recent sentiment drops and spike detection", to: "/producer/sentiment" },
];

const CONSUMER_FEATURES = [
  { icon: Map, title: "Geo Sales Heatmap", desc: "Where products are loved most across India", to: "/consumer/heatmap" },
  { icon: Bot, title: "AI Assistant", desc: "Ask anything about products, reviews, and deals", to: "/consumer/chatbot" },
  { icon: Trophy, title: "Community & Opportunities", desc: "Affiliate links, expert tips, young entrepreneur hub", to: "/consumer/community" },
  { icon: SearchCheck, title: "Review Explorer", desc: "Browse smart, filtered, verified reviews", to: "/consumer/reviews/electronics" },
  { icon: Tag, title: "Personalized Labels", desc: "Products matched to your lifestyle", to: "/consumer/community" },
  { icon: TrendingUp, title: "Sentiment Trends", desc: "See how brands improved over time", to: "/consumer/heatmap" },
];

const greetingTime = () => {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
};

export default function HomePage() {
  const { role } = useAuth();
  const { t } = useLang();
  if (!role) return <Navigate to="/" replace />;

  const isProducer = role === "producer";
  const features = isProducer ? PRODUCER_FEATURES : CONSUMER_FEATURES;
  const ticker = isProducer ? PRODUCER_TICKER : CONSUMER_TICKER;

  const stats = isProducer
    ? [
        { label: "Products Monitored", count: 1284 },
        { label: "Alerts Today", count: 17 },
        { label: "Avg. Sentiment Score", count: 78, suffix: "%" },
        { label: "Reviews Processed", count: 3940 },
      ]
    : [
        { label: "Products Browsed", count: 42 },
        { label: "Reviews Submitted", count: 7 },
        { label: "Recommendations", count: 23 },
        { label: "Offers Available", count: 11 },
      ];

  return (
    <>
      <AppHeader />
      <PageWrapper>
        <main className="container py-10 space-y-12">
          <motion.section variants={stagger.container} initial="hidden" animate="visible">
            <motion.h1 variants={stagger.item} className="font-display font-extrabold text-4xl md:text-6xl">
              Good {greetingTime()}, <span className="text-gradient-teal">{isProducer ? "Producer" : "Shopper"}</span>.
            </motion.h1>
            <motion.p variants={stagger.item} className="text-muted-foreground mt-2 text-lg">
              {t("greeting")} — here's what's happening across your product ecosystem.
            </motion.p>
          </motion.section>

          <section className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {stats.map((s) => <StatCard key={s.label} {...s} />)}
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl md:text-3xl mb-6">
              {isProducer ? "Your Producer Toolkit" : "Smart Shopper Toolkit"}
            </h2>
            <motion.div
              variants={stagger.container}
              initial="hidden" animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {features.map((f) => (
                <motion.div key={f.title} variants={stagger.item}>
                  <Link to={f.to}>
                    <GlassCard className="h-full group">
                      <f.icon className="w-8 h-8 text-primary mb-3" />
                      <h3 className="font-display font-bold text-lg mb-1">{f.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{f.desc}</p>
                      <span className="inline-flex items-center gap-1 text-xs font-mono text-primary-glow group-hover:gap-2 transition-all">
                        {t("explore")} <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </GlassCard>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </section>

          <section className="overflow-hidden border-y border-primary/20 py-3 -mx-4">
            <div className="ticker text-sm text-muted-foreground font-mono">
              {[...ticker, ...ticker].map((line, i) => (
                <span key={i} className="inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-glow" />
                  {line}
                </span>
              ))}
            </div>
          </section>
        </main>
      </PageWrapper>
    </>
  );
}
