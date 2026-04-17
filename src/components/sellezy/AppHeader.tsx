import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LanguageContext";
import { Logo } from "./Logo";
import { RoleBadge } from "./RoleBadge";
import { Bell, LogOut, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LANGUAGES } from "@/lib/mockData";
import { useState } from "react";

export const AppHeader = () => {
  const { role, logout } = useAuth();
  const { lang, setLang, t } = useLang();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  if (!role) return null;
  const initials = role === "producer" ? "PR" : "CN";

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/70 border-b border-primary/20">
      <div className="container flex items-center justify-between py-3 gap-4">
        <div className="flex items-center gap-4">
          <Logo size={26} />
        </div>
        <div className="hidden md:block"><RoleBadge role={role} /></div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setOpen((o) => !o)}
              className="lang-pill inline-flex items-center gap-1"
              aria-label="Switch language"
            >
              {LANGUAGES.find((l) => l.code === lang)?.label} <ChevronDown className="w-3 h-3" />
            </button>
            {open && (
              <div className="absolute right-0 mt-2 glass-card p-1 min-w-[140px] z-50">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => { setLang(l.code as any); setOpen(false); }}
                    className={`block w-full text-left px-3 py-1.5 text-xs rounded font-mono hover:bg-primary/15 ${lang === l.code ? "text-primary-glow" : ""}`}
                  >
                    {l.label} · {l.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="text-muted-foreground hover:text-primary-glow transition" aria-label="Notifications">
            <Bell className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-xs font-display font-bold text-primary-foreground">
            {initials}
          </div>
          <button
            onClick={() => { logout(); navigate("/"); }}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition font-mono"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" /> {t("logout")}
          </button>
        </div>
      </div>
    </header>
  );
};
