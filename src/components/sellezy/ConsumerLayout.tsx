import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LanguageContext";
import { AppHeader } from "@/components/sellezy/AppHeader";
import { PageWrapper } from "@/components/sellezy/PageWrapper";
import { Logo } from "@/components/sellezy/Logo";
import { RoleBadge } from "@/components/sellezy/RoleBadge";
import { Home, Bot, SearchCheck, Tag, TrendingUp, LogOut } from "lucide-react";

export const CONSUMER_NAV_ITEMS = [
  { icon: Home, title: "Dashboard", to: "/home" },
  { icon: Bot, title: "AI Assistant", to: "/consumer/chatbot" },
  { icon: SearchCheck, title: "Review Explorer", to: "/consumer/reviews/electronics" },
  { icon: Tag, title: "Personalized Labels", to: "/consumer/labels" },
  { icon: TrendingUp, title: "Sentiment Trends", to: "/consumer/trends" },
];

export const ConsumerLayout = ({ children }: { children?: ReactNode }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, logout } = useAuth();
  const { t } = useLang();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleMenuClick = () => {
    if (window.innerWidth < 1024) {
      setMobileOpen(true);
    } else {
       setIsCollapsed(prev => !prev);
    }
  };

  // Identity Extraction Logic
  let displayName = "Consumer User";
  let displayEmail = "";
  let initials = "CN";

  const extractedName = profile?.full_name || user?.user_metadata?.full_name || user?.user_metadata?.name;
  if (extractedName) displayName = extractedName;
  
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

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const SidebarContent = ({ collapsed = false }: { collapsed?: boolean }) => (
    <div className={`flex flex-col h-full bg-bg-secondary/40 backdrop-blur-xl border-r border-primary/20 ${collapsed ? "items-center" : ""}`}>
      <div className="flex items-center gap-3 p-5 border-b border-primary/10">
        <Logo size={24} />
      </div>
      
      <div className="flex-1 overflow-y-auto py-5 px-3 space-y-1 custom-scrollbar">
        <div className={`flex items-center mb-4 px-3 ${collapsed ? "justify-center" : "justify-between"}`}>
           {!collapsed && <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Workspace</div>}
           <RoleBadge role="consumer" />
        </div>
        
        {CONSUMER_NAV_ITEMS.map((item) => {
          const isReviewRoute = location.pathname.startsWith("/consumer/reviews") && item.to.includes("/consumer/reviews");
          const isActive = location.pathname === item.to || isReviewRoute || (location.pathname.startsWith(item.to) && item.to !== "/home" && !item.to.includes("/consumer/reviews"));

          return (
            <Link
              key={item.to}
              to={item.to}
              title={collapsed ? item.title : undefined}
              className={`flex items-center px-3 py-2 rounded-md font-mono text-sm transition-colors ${collapsed ? "justify-center" : "gap-3"} ${
                isActive 
                  ? "bg-primary/20 text-primary-glow shadow-sm border border-primary/10" 
                  : "text-muted-foreground hover:bg-input/50 hover:text-foreground"
              }`}
            >
              <item.icon className={`w-4 h-4 shrink-0 ${isActive ? "text-primary" : ""}`} />
              {!collapsed && <span className="truncate">{item.title}</span>}
            </Link>
          );
        })}
      </div>
      
      <div className={`p-4 border-t border-primary/10 bg-black/10 flex flex-col ${collapsed ? "items-center" : ""}`}>
         <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3 mb-4"}`}>
            <div title={collapsed ? displayName : undefined} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/80 to-primary-glow flex items-center justify-center text-xs font-display font-bold text-primary-foreground shadow-sm shadow-primary/20 shrink-0">
               {initials}
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                 <p className="text-xs font-display font-bold truncate tracking-wide text-foreground/90">{displayName}</p>
                 {displayEmail && <p className="text-[10px] text-muted-foreground font-mono truncate">{displayEmail}</p>}
              </div>
            )}
         </div>
         <button
            title={collapsed ? t("logout") || "Logout" : undefined}
            onClick={handleLogout}
            className={`w-full flex items-center px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-md font-mono border border-transparent hover:border-red-500/20 transition-colors ${collapsed ? "justify-center mt-4 !p-2" : "gap-2"}`}
         >
            <LogOut className="w-4 h-4 shrink-0" /> {!collapsed && (t("logout") || "Logout")}
         </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:block flex-shrink-0 z-20 transition-[width] duration-300 ease-in-out ${isCollapsed ? "w-20" : "w-64"}`}>
        <SidebarContent collapsed={isCollapsed} />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 shadow-2xl animate-in slide-in-from-left-full">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        <AppHeader 
          onMenuClick={handleMenuClick} 
          isSidebarLayout 
        />
        
        <div className="flex-1 overflow-y-auto w-full relative custom-scrollbar">
           <PageWrapper className="min-h-full">
             {children || <Outlet />}
           </PageWrapper>
        </div>
      </div>
    </div>
  );
};
