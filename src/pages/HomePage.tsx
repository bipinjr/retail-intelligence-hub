import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LanguageContext";
import { Navigate, Link } from "react-router-dom";
import { PageWrapper, stagger } from "@/components/sellezy/PageWrapper";
import { AppHeader } from "@/components/sellezy/AppHeader";
import { ProducerLayout } from "@/components/sellezy/ProducerLayout";
import { ConsumerLayout } from "@/components/sellezy/ConsumerLayout";
import { GlassCard } from "@/components/sellezy/GlassCard";
import { StatCard } from "@/components/sellezy/StatCard";
import { motion } from "framer-motion";
import {
  Inbox, FileBarChart, Languages, Activity, GitCompare, BellRing,
  Map, Bot, Trophy, SearchCheck, Tag, TrendingUp, ArrowRight,
} from "lucide-react";
import { PRODUCER_TICKER, CONSUMER_TICKER } from "@/lib/mockData";

const greetingTime = (t: any) => {
  const h = new Date().getHours();
  if (h < 12) return t("goodMorning");
  if (h < 17) return t("goodAfternoon");
  return t("goodEvening");
};

export default function HomePage() {
  const { role } = useAuth();
  const { t } = useLang();
  if (!role) return <Navigate to="/" replace />;

  const isProducer = role === "producer";

  const PRODUCER_FEATURES = [
    { icon: Inbox, title: t("f_pipeline"), desc: t("f_pipeline_desc"), to: "/producer/sentiment" },
    { icon: FileBarChart, title: t("f_reports"), desc: t("f_reports_desc"), to: "/producer/reports" },
    { icon: Languages, title: t("f_multi"), desc: t("f_multi_desc"), to: "/producer/multilingual" },
    { icon: Activity, title: t("f_health"), desc: t("f_health_desc"), to: "/producer/health" },
    { icon: GitCompare, title: t("f_category"), desc: t("f_category_desc"), to: "/producer/category" },
    { icon: BellRing, title: t("f_anomaly"), desc: t("f_anomaly_desc"), to: "/producer/anomaly" },
    { icon: Map, title: t("f_heatmap"), desc: t("f_heatmap_desc"), to: "/producer/heatmap" },
    { icon: Trophy, title: t("f_community"), desc: t("f_community_desc"), to: "/producer/community" },
  ];

  const CONSUMER_FEATURES = [
    { icon: Bot, title: t("f_chatbot"), desc: t("f_chatbot_desc"), to: "/consumer/chatbot" },
    { icon: SearchCheck, title: t("f_reviews"), desc: t("f_reviews_desc"), to: "/consumer/reviews/electronics" },
    { icon: Tag, title: t("f_labels"), desc: t("f_labels_desc"), to: "/consumer/labels" },
    { icon: TrendingUp, title: t("f_trends"), desc: t("f_trends_desc"), to: "/consumer/trends" },
  ];

  const features = isProducer ? PRODUCER_FEATURES : CONSUMER_FEATURES;
  const ticker = isProducer ? PRODUCER_TICKER : CONSUMER_TICKER;

  const stats = isProducer
    ? [
        { label: t("s_products"), count: 1284 },
        { label: t("s_alerts"), count: 17 },
        { label: t("s_avg"), count: 78, suffix: "%" },
        { label: t("s_processed"), count: 3940 },
      ]
    : [
        { label: t("s_browsed"), count: 42 },
        { label: t("s_submitted"), count: 7 },
        { label: t("s_recs"), count: 23 },
        { label: t("s_offers"), count: 11 },
      ];

  const Content = (
    <main className="container py-10 space-y-12">
      <motion.section variants={stagger.container} initial="hidden" animate="visible">
        <motion.h1 variants={stagger.item} className="font-display font-extrabold text-4xl md:text-6xl">
          {greetingTime(t)}, <span className="text-gradient-teal">{isProducer ? t("producerTitle") : t("consumerTitle")}</span>.
        </motion.h1>
        <motion.p variants={stagger.item} className="text-muted-foreground mt-2 text-lg">
          {t("homeSubline")}
        </motion.p>
      </motion.section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </section>

      <section>
        <h2 className="font-display font-bold text-2xl md:text-3xl mb-6">
          {isProducer ? t("producerToolkit") : t("consumerToolkit")}
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
  );

  if (isProducer) {
    return <ProducerLayout>{Content}</ProducerLayout>;
  }

  return <ConsumerLayout>{Content}</ConsumerLayout>;
}
