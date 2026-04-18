import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Star, Mail, Lock, Eye, EyeOff, User as UserIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { PageWrapper } from "@/components/sellezy/PageWrapper";
import { GlassCard } from "@/components/sellezy/GlassCard";
import { Logo } from "@/components/sellezy/Logo";

type ViewState = "signin" | "signup" | "forgot";

const FLOATING_REVIEWS = [
  { rating: 5, text: "बहुत अच्छा फोन है!", lang: "hi" },
  { rating: 4, text: "Great delivery experience.", lang: "en" },
  { rating: 5, text: "சுவை அருமை, மீண்டும் வாங்குவேன்!", lang: "ta" },
  { rating: 4, text: "Packaging could be better.", lang: "en" },
  { rating: 5, text: "Paisa vasool product, top class!", lang: "hinglish" },
  { rating: 4, text: "ভাল মানের কাপড়।", lang: "bn" },
  { rating: 5, text: "स्वाद बहुत अच्छा है!", lang: "hi" },
];

export default function ConsumerLoginPage() {
  const [view, setView] = useState<ViewState>("signin");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<{type: "error" | "success", text: string} | null>(null);

  const auth = useAuth();
  const navigate = useNavigate();

  const loading = auth?.loading || false;

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    setMessage(null);
    try {
      if (auth?.signInWithGoogle) await auth.signInWithGoogle("consumer");
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Failed to log in with Google" });
      setIsSubmitting(false);
    }
  };

  const handleManualAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    try {
      if (view === "signup") {
        if (password !== confirmPassword) throw new Error("Passwords do not match");
        if (auth?.consumerSignUp) await auth.consumerSignUp(email, password, name);
        setMessage({ type: "success", text: "Successfully signed up! Please check your email to verify." });
      } else if (view === "signin") {
        if (auth?.consumerSignIn) {
          await auth.consumerSignIn(email, password);
          navigate("/home");
        }
      } else if (view === "forgot") {
        if (auth?.consumerForgotPassword) {
          await auth.consumerForgotPassword(email);
          setMessage({ type: "success", text: "Password reset link sent! Check your email." });
        }
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Authentication failed" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="min-h-screen grid md:grid-cols-[55%_45%]">
        {/* LEFT */}
        <div className="hidden md:flex relative bg-bg-secondary p-10 items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent" />
          <div className="relative w-full h-full">
            {FLOATING_REVIEWS.map((r, i) => (
              <motion.div
                key={i}
                initial={{ y: "100vh", opacity: 0, x: 0 }}
                animate={{ y: "-20vh", opacity: [0, 0.85, 0.85, 0], x: ((i % 3) - 1) * 30 }}
                transition={{ duration: 12, delay: i * 1.6, repeat: Infinity, ease: "linear" }}
                className="absolute glass-card p-3 max-w-[200px]"
                style={{ left: `${10 + (i * 12) % 70}%` }}
              >
                <div className="flex items-center gap-0.5 mb-1">
                  {Array.from({ length: r.rating }).map((_, j) => (
                    <Star key={j} className="w-3 h-3 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-xs text-foreground/85">{r.text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-md space-y-4 flex flex-col h-full max-h-screen justify-center">
             <div className="flex-shrink-0">
               <Logo size={28} />
             </div>
             
             <GlassCard hoverable={false} className="p-6 md:p-8 space-y-5 lg:overflow-visible overflow-y-auto custom-scrollbar">
               <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 mb-4 rounded-full text-[10px] font-mono uppercase tracking-wider bg-accent/15 text-accent border border-accent/40">
                    <ShoppingBag className="w-3 h-3" /> Consumer · Shopper
                  </span>
                  <h1 className="font-display font-bold text-2xl md:text-3xl">Discover smarter.</h1>
               </div>

               {/* TABS */}
               {view !== "forgot" && (
                 <div className="flex rounded-md p-1 bg-input/40 border border-primary/10">
                   <button 
                     onClick={() => { setView("signin"); setMessage(null); }}
                     className={`flex-1 py-1.5 text-sm font-mono rounded-sm transition-colors ${view === "signin" ? "bg-primary/20 text-primary-glow shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                   >
                     Sign In
                   </button>
                   <button 
                     onClick={() => { setView("signup"); setMessage(null); }}
                     className={`flex-1 py-1.5 text-sm font-mono rounded-sm transition-colors ${view === "signup" ? "bg-primary/20 text-primary-glow shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                   >
                     Sign Up
                   </button>
                 </div>
               )}

               {view === "forgot" && (
                 <div>
                   <h2 className="font-display font-medium text-lg text-primary-glow">Reset Password</h2>
                   <p className="text-xs text-muted-foreground mt-1">Enter your email and we'll send you a link to reset your password.</p>
                 </div>
               )}

               {message && (
                 <div className={`p-3 rounded-md text-sm border ${message.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-green-500/10 border-green-500/20 text-green-400'}`}>
                   {message.text}
                 </div>
               )}

               {/* FORMS */}
               <form onSubmit={handleManualAuth} className="space-y-4">
                 {view === "signup" && (
                   <label className="block">
                     <span className="text-xs font-mono text-muted-foreground">Full Name</span>
                     <div className="relative mt-1">
                       <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                       <input
                         value={name} onChange={(e) => setName(e.target.value)} type="text"
                         required className="w-full bg-input/60 border border-primary/20 rounded-md pl-10 pr-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                       />
                     </div>
                   </label>
                 )}
                 <label className="block">
                   <span className="text-xs font-mono text-muted-foreground">Email</span>
                   <div className="relative mt-1">
                     <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                     <input
                       value={email} onChange={(e) => setEmail(e.target.value)} type="email"
                       required className="w-full bg-input/60 border border-primary/20 rounded-md pl-10 pr-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                     />
                   </div>
                 </label>
                 {view !== "forgot" && (
                   <>
                     <label className="block">
                       <span className="text-xs font-mono text-muted-foreground">Password</span>
                       <div className="relative mt-1">
                         <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                         <input
                           value={password} onChange={(e) => setPassword(e.target.value)} type={showPass ? "text" : "password"}
                           required minLength={6} className="w-full bg-input/60 border border-primary/20 rounded-md pl-10 pr-10 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                         />
                         <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent">
                           {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                         </button>
                       </div>
                     </label>
                     {view === "signup" && (
                       <label className="block">
                         <span className="text-xs font-mono text-muted-foreground">Confirm Password</span>
                         <div className="relative mt-1">
                           <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                           <input
                             value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type={showPass ? "text" : "password"}
                             required minLength={6} className="w-full bg-input/60 border border-primary/20 rounded-md pl-10 pr-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                           />
                         </div>
                       </label>
                     )}
                     {view === "signin" && (
                       <div className="flex justify-end pt-1">
                         <button type="button" onClick={() => { setView("forgot"); setMessage(null); }} className="text-xs font-mono text-muted-foreground hover:text-accent transition-colors">
                           Forgot password?
                         </button>
                       </div>
                     )}
                   </>
                 )}

                 <button 
                   type="submit" 
                   disabled={isSubmitting}
                   className="btn-glow-amber w-full inline-flex items-center justify-center py-2.5 rounded-md font-mono disabled:opacity-50 mt-2 text-sm"
                 >
                   {isSubmitting ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : (view === "signin" ? "Sign In" : view === "signup" ? "Create Account" : "Send Reset Link")}
                 </button>
               </form>

               {view === "forgot" ? (
                 <div className="text-center mt-4">
                   <button type="button" onClick={() => { setView("signin"); setMessage(null); }} className="text-sm font-mono text-muted-foreground hover:text-primary transition-colors">
                     ← Back to login
                   </button>
                 </div>
               ) : (
                 <>
                   <div className="flex items-center gap-3 text-xs text-muted-foreground mt-4 mb-2">
                     <div className="h-px bg-primary/20 flex-1" /> or <div className="h-px bg-primary/20 flex-1" />
                   </div>

                   <button 
                     type="button"
                     onClick={handleGoogleLogin} 
                     disabled={isSubmitting}
                     className="w-full inline-flex items-center justify-center gap-3 py-2 text-sm rounded-md font-mono border border-primary/20 bg-input/60 hover:bg-primary/10 transition-colors disabled:opacity-50"
                   >
                     <svg className="w-4 h-4" viewBox="0 0 24 24">
                       <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                       <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                       <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                       <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                     </svg>
                     Continue with Google
                   </button>
                 </>
               )}

               <div className="pt-2">
                 <Link to="/login/producer" className="block text-center text-xs text-primary-glow hover:underline font-mono">
                   I'm a Producer →
                 </Link>
               </div>
             </GlassCard>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
