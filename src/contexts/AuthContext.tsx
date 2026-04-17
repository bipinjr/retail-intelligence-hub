import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export type Role = "producer" | "consumer" | null;

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string | null;
  avatar_url: string | null;
}

interface AuthCtx {
  role: Role;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  login: (role: Exclude<Role, null>) => void;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  consumerSignUp: (email: string, pass: string, name: string) => Promise<void>;
  consumerSignIn: (email: string, pass: string) => Promise<void>;
  consumerForgotPassword: (email: string) => Promise<void>;
  consumerUpdatePassword: (pass: string) => Promise<void>;
}

const AuthContext = createContext<AuthCtx>({
  role: null,
  user: null,
  profile: null,
  loading: true,
  login: () => {},
  logout: async () => {},
  signInWithGoogle: async () => {},
  consumerSignUp: async () => {},
  consumerSignIn: async () => {},
  consumerForgotPassword: async () => {},
  consumerUpdatePassword: async () => {},
});

const STORAGE_KEY = "sellezy.role";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Role>(() => {
    if (typeof window === "undefined") return null;
    const r = localStorage.getItem(STORAGE_KEY) as Role;
    return r === "producer" || r === "consumer" ? r : null;
  });
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loginLocal = (r: Exclude<Role, null>) => {
    localStorage.setItem(STORAGE_KEY, r);
    setRole(r);
  };

  const logoutLocal = () => {
    localStorage.removeItem(STORAGE_KEY);
    setRole(null);
  };

  const login = (r: Exclude<Role, null>) => {
    loginLocal(r);
  };

  const logout = async () => {
    logoutLocal();
    await supabase.auth.signOut();
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + "/auth/callback",
        },
      });
      if (error) throw error;
    } catch (err: any) {
      console.error("Error signing in with Google:", err.message);
      throw err;
    }
  };

  const consumerSignUp = async (email: string, pass: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: { full_name: name, role: "consumer" },
      },
    });
    if (error) throw error;
  };

  const consumerSignIn = async (email: string, pass: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });
    if (error) throw error;
  };

  const consumerForgotPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/auth/reset-password",
    });
    if (error) throw error;
  };

  const consumerUpdatePassword = async (pass: string) => {
    const { error } = await supabase.auth.updateUser({
      password: pass,
    });
    if (error) throw error;
  };

  const fetchOrEnsureProfile = async (sessionUser: User) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", sessionUser.id)
        .maybeSingle();

      if (data) {
        setProfile(data as Profile);
        return;
      }

      const newProfile = {
        id: sessionUser.id,
        email: sessionUser.email || null,
        full_name:
          sessionUser.user_metadata?.full_name ||
          sessionUser.user_metadata?.name ||
          null,
        avatar_url: sessionUser.user_metadata?.avatar_url || null,
        role: "consumer",
      };

      const { data: inserted, error: insertErr } = await supabase
        .from("profiles")
        .upsert([newProfile])
        .select()
        .single();

      if (!insertErr && inserted) {
        setProfile(inserted as Profile);
      } else {
        console.error("Failed to insert missing profile:", insertErr);
      }
    } catch (err) {
      console.error("Profile fetch crashed gracefully:", err);
    }
  };

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!mounted) return;
      if (error) console.error("Session error:", error);
      
      if (session) {
        const currentRole = localStorage.getItem(STORAGE_KEY);
        if (currentRole !== "producer") {
          loginLocal("consumer");
        }
        setUser(session.user);
        
        fetchOrEnsureProfile(session.user).finally(() => {
          if (mounted) setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
        setProfile(null);
      }

      if (event === "SIGNED_IN" && session) {
        const currentRole = localStorage.getItem(STORAGE_KEY);
        if (currentRole !== "producer") {
          loginLocal("consumer");
        }
        fetchOrEnsureProfile(session.user);
      } else if (event === "SIGNED_OUT") {
        const currentRole = localStorage.getItem(STORAGE_KEY);
        if (currentRole === "consumer") {
          logoutLocal();
        }
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ 
      role, user, profile, loading, login, logout, 
      signInWithGoogle, consumerSignUp, consumerSignIn, 
      consumerForgotPassword, consumerUpdatePassword 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
