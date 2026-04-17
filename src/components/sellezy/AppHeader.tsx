import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LanguageContext";
import { Logo } from "./Logo";
import { RoleBadge } from "./RoleBadge";
import { Bell, LogOut, ChevronDown, User as UserIcon, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LANGUAGES } from "@/lib/mockData";
import { useState, useRef, useEffect } from "react";
import { Menu } from "lucide-react";

export const AppHeader = ({ 
  onMenuClick, 
  isSidebarLayout 
}: { 
  onMenuClick?: () => void; 
  isSidebarLayout?: boolean; 
}) => {
  const { role, user, profile, logout } = useAuth();
  const { lang, setLang, t } = useLang();
  const navigate = useNavigate();
  const [langOpen, setLangOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!role) return null;

  // Identity extraction logic
  let displayName = "Consumer";
  let displayEmail = "";
  let initials = "CN";

  if (role === "producer") {
    initials = "PR";
  } else {
    // Priority: profile -> metadata -> email -> fallback
    displayName = profile?.full_name || user?.user_metadata?.full_name || user?.user_metadata?.name || "Consumer User";
    displayEmail = profile?.email || user?.email || "";

    if (displayName && displayName !== "Consumer User") {
      const parts = displayName.trim().split(" ");
      if (parts.length > 1) {
        initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      } else {
        initials = parts[0].substring(0, 2).toUpperCase();
      }
    } else if (displayEmail) {
      initials = displayEmail.substring(0, 2).toUpperCase();
    }
  }

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/70 border-b border-primary/20">
      <div className="container flex items-center justify-between py-3 gap-4">
        <div className="flex items-center gap-4">
          {onMenuClick && (
            <button 
              onClick={onMenuClick} 
              className={`p-1 -ml-2 text-muted-foreground hover:text-primary transition-colors ${isSidebarLayout ? "" : "lg:hidden"}`}
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <div className={isSidebarLayout ? "hidden lg:block lg:opacity-0" : ""}>
            <Logo size={26} />
          </div>
        </div>
        <div className="hidden md:block"><RoleBadge role={role} /></div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setLangOpen((o) => !o)}
              className="lang-pill inline-flex items-center gap-1"
              aria-label="Switch language"
            >
              {LANGUAGES.find((l) => l.code === lang)?.label} <ChevronDown className="w-3 h-3" />
            </button>
            {langOpen && (
              <div className="absolute right-0 mt-2 glass-card p-1 min-w-[140px] z-50">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => { setLang(l.code as any); setLangOpen(false); }}
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
          
          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-xs font-display font-bold text-primary-foreground hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {initials}
            </button>

            {profileOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 glass-card rounded-md shadow-lg overflow-hidden border border-primary/20 z-50 p-2 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                {role === "consumer" ? (
                  <>
                    <div className="p-3 border-b border-primary/10 mb-2">
                       <span className="inline-flex items-center gap-1.5 px-2 py-0.5 mb-2 rounded-full text-[9px] font-mono uppercase tracking-wider bg-accent/15 text-accent border border-accent/40">
                          {role}
                       </span>
                       <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                         <UserIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                         <span className="truncate">{displayName}</span>
                       </div>
                       {displayEmail && (
                         <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1.5">
                           <Mail className="w-4 h-4 shrink-0" />
                           <span className="truncate">{displayEmail}</span>
                         </div>
                       )}
                    </div>
                  </>
                ) : (
                  <div className="p-3 border-b border-primary/10 mb-2">
                     <span className="inline-flex items-center gap-1.5 px-2 py-0.5 mb-2 rounded-full text-[9px] font-mono uppercase tracking-wider bg-accent/15 text-accent border border-accent/40">
                        {role}
                     </span>
                     <p className="text-xs text-muted-foreground">Producer Session</p>
                  </div>
                )}
                
                <button
                  onClick={() => { logout(); navigate("/"); setProfileOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded font-mono transition-colors"
                >
                  <LogOut className="w-4 h-4" /> {t("logout")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
