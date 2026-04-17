import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { PageWrapper } from "@/components/sellezy/PageWrapper";
import { GlassCard } from "@/components/sellezy/GlassCard";
import { Logo } from "@/components/sellezy/Logo";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{type: "error" | "success", text: string} | null>(null);

  const auth = useAuth();
  const navigate = useNavigate();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    try {
      if (password !== confirmPassword) throw new Error("Passwords do not match");
      if (auth?.consumerUpdatePassword) {
        await auth.consumerUpdatePassword(password);
        setMessage({ type: "success", text: "Password successfully updated! Redirecting..." });
        setTimeout(() => navigate("/home"), 2000);
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Failed to update password" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageWrapper>
      <div className="min-h-screen flex items-center justify-center p-6 bg-bg-secondary">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent pointer-events-none" />
        
        <div className="w-full max-w-md space-y-6 relative z-10 flex flex-col items-center">
          <Logo size={32} />
          <GlassCard hoverable={false} className="p-8 w-full space-y-5">
            <div>
              <h1 className="font-display font-bold text-2xl">Create new password</h1>
              <p className="text-muted-foreground mt-1 text-sm">Please secure your account with a strong password.</p>
            </div>

            {message && (
              <div className={`p-3 rounded-md text-sm border ${message.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-green-500/10 border-green-500/20 text-green-400'}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleReset} className="space-y-4">
              <label className="block">
                <span className="text-xs font-mono text-muted-foreground">New Password</span>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    value={password} onChange={(e) => setPassword(e.target.value)} type={showPass ? "text" : "password"}
                    required minLength={6} className="w-full bg-input/60 border border-primary/20 rounded-md pl-10 pr-10 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </label>

              <label className="block">
                <span className="text-xs font-mono text-muted-foreground">Confirm New Password</span>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type={showPass ? "text" : "password"}
                    required minLength={6} className="w-full bg-input/60 border border-primary/20 rounded-md pl-10 pr-3 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
              </label>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="btn-glow-amber w-full inline-flex items-center justify-center py-3 rounded-md font-mono disabled:opacity-50 mt-2"
              >
                {isSubmitting ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : "Reset Password"}
              </button>
            </form>
          </GlassCard>
        </div>
      </div>
    </PageWrapper>
  );
}
