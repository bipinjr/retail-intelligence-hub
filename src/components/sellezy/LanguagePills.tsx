import { LANGUAGES } from "@/lib/mockData";
import { useLang } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

export const LanguagePills = ({ compact }: { compact?: boolean }) => {
  const { lang, setLang } = useLang();
  return (
    <div className={`flex flex-wrap gap-2 ${compact ? "" : "justify-center"}`}>
      {LANGUAGES.map((l, i) => (
        <motion.button
          key={l.code}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          onClick={() => setLang(l.code as any)}
          className={`lang-pill ${lang === l.code ? "active" : ""}`}
          aria-label={`Switch language to ${l.name}`}
        >
          {l.label}
        </motion.button>
      ))}
    </div>
  );
};
