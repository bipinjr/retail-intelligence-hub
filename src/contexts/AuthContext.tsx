import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Role = "producer" | "consumer" | null;

interface AuthCtx {
  role: Role;
  login: (role: Exclude<Role, null>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthCtx>({ role: null, login: () => {}, logout: () => {} });

const STORAGE_KEY = "sellezy.role";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Role>(null);

  useEffect(() => {
    const r = localStorage.getItem(STORAGE_KEY) as Role;
    if (r === "producer" || r === "consumer") setRole(r);
  }, []);

  const login = (r: Exclude<Role, null>) => {
    localStorage.setItem(STORAGE_KEY, r);
    setRole(r);
  };
  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setRole(null);
  };

  return <AuthContext.Provider value={{ role, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
