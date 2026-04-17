import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { LANG_LABELS } from "@/lib/mockData";

type LangCode = keyof typeof LANG_LABELS;

interface LangCtx {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  t: (key: keyof (typeof LANG_LABELS)["EN"]) => string;
}

const LanguageContext = createContext<LangCtx>({ lang: "EN", setLang: () => {}, t: (k) => LANG_LABELS.EN[k] });

const KEY = "sellezy.lang";

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<LangCode>("EN");
  useEffect(() => {
    const v = localStorage.getItem(KEY);
    if (v && v in LANG_LABELS) setLangState(v as LangCode);
  }, []);
  const setLang = (l: LangCode) => {
    localStorage.setItem(KEY, l);
    setLangState(l);
  };
  const t = (k: keyof (typeof LANG_LABELS)["EN"]) => LANG_LABELS[lang]?.[k] ?? LANG_LABELS.EN[k];
  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>;
};

export const useLang = () => useContext(LanguageContext);
