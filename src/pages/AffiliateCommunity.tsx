import { stagger } from "@/components/sellezy/PageWrapper";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LanguageContext";

import { GlassCard } from "@/components/sellezy/GlassCard";
import { TranslationHint } from "@/components/sellezy/TranslationHint";
import { PersonaLabel } from "@/components/sellezy/PersonaLabel";
import { LikeButton } from "@/components/sellezy/LikeButton";
import { CommentSection } from "@/components/sellezy/CommentSection";
import { COMMUNITY_POSTS, AFFILIATE_PRODUCTS } from "@/lib/mockData";
import { GraduationCap, Handshake, Coins, MessageCircle, Share2, ExternalLink, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function AffiliateCommunity() {
  const { role } = useAuth();
  const { t } = useLang();
  const [openComments, setOpenComments] = useState<Record<number, boolean>>({});

  if (role !== "producer") return <Navigate to="/home" replace />;

  const HUB = [
    {
      icon: GraduationCap, title: "Learn",
      desc: "Research-backed data collections for business insights.",
      cta: t("exploreResearch"),
      href: "https://www.sciencedirect.com/science/article/pii/S2210539526000301",
      badge: "📄 Research-backed data collections",
    },
    { icon: Handshake, title: "Connect", desc: "Join sellers, analysts and retail entrepreneurs in your city.", cta: t("learnMore") },
    { icon: Coins, title: "Earn", desc: "Surface high-performing products as affiliate opportunities on Amazon & Flipkart.", cta: t("learnMore") },
  ];

  const share = () => {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
    toast.success("Link copied!");
  };

  return (
    <>
        <main className="container py-10 space-y-12">
          <section>
            <h1 className="font-display font-extrabold text-3xl md:text-5xl mb-2">{t("pt_community")}</h1>
            <p className="text-muted-foreground mb-8">{t("pt_community_sub")}</p>
            <motion.div variants={stagger.container} initial="hidden" animate="visible" className="grid md:grid-cols-3 gap-5">
              {HUB.map((h) => (
                <motion.div key={h.title} variants={stagger.item}>
                  <GlassCard className="h-full">
                    <h.icon className="w-8 h-8 text-primary mb-3" />
                    <h3 className="font-display font-bold text-xl mb-2">{h.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{h.desc}</p>
                    {h.href ? (
                      <a href={h.href} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-xs font-mono border border-primary text-primary-glow hover:bg-primary/15 transition-all">
                        {h.cta} <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <button className="px-4 py-2 rounded-full text-xs font-mono border border-primary text-primary-glow hover:bg-primary/15 transition-all">
                        {h.cta}
                      </button>
                    )}
                    {h.badge && (
                      <div className="mt-3 inline-block text-[10px] font-mono px-2 py-1 rounded-full bg-primary/10 text-primary-glow border border-primary/30">
                        {h.badge}
                      </div>
                    )}
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl md:text-3xl mb-6">Community Feed</h2>
            <div className="grid md:grid-cols-2 gap-5">
              {COMMUNITY_POSTS.map((p) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                  <GlassCard hoverable={false} className="!p-0 overflow-hidden">
                    {p.affiliate && (
                      <div className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground text-[10px] font-mono uppercase tracking-wider px-4 py-1.5 flex items-center gap-1.5 animate-pulse">
                        <Sparkles className="w-3 h-3" /> Affiliate Opportunity
                      </div>
                    )}
                    <div className="p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${p.color} flex items-center justify-center text-xs font-display font-bold text-white`}>
                          {p.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-display font-bold text-sm truncate">{p.name}</div>
                          <div className="text-xs text-muted-foreground font-mono">{p.city} · 2h ago</div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] border border-primary/40 text-primary-glow font-mono">
                          {p.category}
                        </span>
                      </div>
                      {(p as any).original && <TranslationHint lang={p.lang === "TA" ? "தமிழ்" : p.lang === "BN" ? "বাংলা" : p.lang === "HI" ? "हिन्दी" : "Hinglish"} />}
                      <p className="text-sm text-foreground/90">{p.text}</p>
                      {(p as any).original && <p className="text-xs text-muted-foreground italic">Original: {(p as any).original}</p>}
                      <div className="flex items-center gap-5 pt-2 border-t border-primary/10 text-xs text-muted-foreground">
                        <LikeButton initial={20 + p.id * 3} />
                        <button onClick={() => setOpenComments((s) => ({ ...s, [p.id]: !s[p.id] }))}
                          className="inline-flex items-center gap-1 hover:text-primary-glow">
                          <MessageCircle className="w-3.5 h-3.5" /> {p.seedComments?.length ?? 0}
                        </button>
                        <button onClick={share} className="inline-flex items-center gap-1 hover:text-primary-glow ml-auto">
                          <Share2 className="w-3.5 h-3.5" /> Share
                        </button>
                      </div>
                      <CommentSection open={!!openComments[p.id]} seed={p.seedComments ?? []} />
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display font-bold text-2xl md:text-3xl mb-6">Affiliate Products</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x">
              {AFFILIATE_PRODUCTS.map((p) => (
                <GlassCard key={p.name} hoverable={false} className="min-w-[260px] snap-start space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-display font-bold">{p.name}</div>
                      <span className="text-[10px] font-mono text-muted-foreground">{p.category}</span>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs bg-success/15 text-success border border-success/40 font-mono">
                      {p.score}% ✅
                    </span>
                  </div>
                  <PersonaLabel type={p.persona} />
                  <button className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md text-xs font-mono border border-primary/40 text-primary-glow hover:bg-primary/15 hover:border-primary transition-all">
                    View on {p.store} <ExternalLink className="w-3 h-3" />
                  </button>
                </GlassCard>
              ))}
            </div>
          </section>
        </main>
      </>
  );
}
