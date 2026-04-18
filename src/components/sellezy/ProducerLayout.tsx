import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { AppHeader } from "@/components/sellezy/AppHeader";
import { PageWrapper } from "@/components/sellezy/PageWrapper";
import { Logo } from "@/components/sellezy/Logo";
import { RoleBadge } from "@/components/sellezy/RoleBadge";
import {
  Home, Inbox, FileBarChart, Languages, Activity, GitCompare, BellRing, Map, Trophy,
} from "lucide-react";
import { useReviews } from "@/hooks/useReviews";
import ProducerAIAgent from "./ProducerAIAgent/ProducerAIAgent";

export const PRODUCER_NAV_ITEMS = [
  { icon: Home, title: "Dashboard", to: "/home" },
  { icon: Inbox, title: "Sentiment Pipeline", to: "/producer/sentiment" },
  { icon: FileBarChart, title: "Data Reports", to: "/producer/reports" },
  { icon: Languages, title: "Multilingual", to: "/producer/multilingual" },
  { icon: Activity, title: "Health Scores", to: "/producer/health" },
  { icon: GitCompare, title: "Comparison", to: "/producer/category" },
  { icon: BellRing, title: "Anomaly Alerts", to: "/producer/anomaly" },
  { icon: Map, title: "Geo Heatmap", to: "/producer/heatmap" },
  { icon: Trophy, title: "Community Hub", to: "/producer/community" },
];

export const ProducerLayout = ({ children }: { children?: ReactNode }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  // Listen globally for new realtime ingestions safely inside the layout shell
  useReviews({ notify: true });

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

  const SidebarContent = ({ collapsed = false }: { collapsed?: boolean }) => (
    <div className={`flex flex-col h-full bg-black/10 backdrop-blur-3xl border-r border-primary/20 ${collapsed ? "items-center" : ""}`}>
      <div className="flex items-center gap-3 p-5 border-b border-primary/10">
        <Logo size={24} />
      </div>
      
      <div className="flex-1 overflow-y-auto py-5 px-3 space-y-1 custom-scrollbar">
        <div className={`flex items-center mb-4 px-3 ${collapsed ? "justify-center" : "justify-between"}`}>
           {!collapsed && <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Workspace</div>}
           <RoleBadge role="producer" />
        </div>
        
        {PRODUCER_NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.to || (location.pathname.startsWith(item.to) && item.to !== "/home");
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
      
      <div className={`p-4 border-t border-primary/10 bg-black/10 flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
          <div title={collapsed ? "Producer Admin" : undefined} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/80 to-primary-glow flex items-center justify-center text-xs font-display font-bold text-primary-foreground shadow-sm shadow-primary/20 shrink-0">
             PR
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
               <p className="text-xs font-display font-bold truncate tracking-wide text-foreground/90">Producer Admin</p>
               <p className="text-[10px] text-muted-foreground font-mono truncate">Authorized Operator</p>
            </div>
          )}
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
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative bg-transparent">
        <AppHeader 
          onMenuClick={handleMenuClick} 
          isSidebarLayout 
        />
        
        <div className="flex-1 overflow-y-auto w-full relative custom-scrollbar">
           <PageWrapper className="min-h-full">
             {children || <Outlet />}
           </PageWrapper>
        </div>

        {/* Floating Producer AI Assistant */}
        <ProducerAIAgent />
      </div>
    </div>
  );
};
