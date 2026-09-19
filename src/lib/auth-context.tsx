"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, clearToken, getToken, login as apiLogin, register as apiRegister, setToken } from "@/lib/api";

type User = {
  id: string;
  email: string;
  full_name: string;
  preferred_locale: string;
  is_admin: boolean;
  email_verified: boolean;
  trial_ends_at: string;
  trial_expired: boolean;
  can_use_first_partner: boolean;
  can_use_second_partner: boolean;
  can_upload_signature_stamp: boolean;
};

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  async function refreshUser() {
    if (!getToken()) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      const me = await api.get<User>("/auth/me");
      setUser(me);
    } catch {
      clearToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    refreshUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login(email: string, password: string) {
    const { access_token } = await apiLogin(email, password);
    setToken(access_token);
    await refreshUser();
    router.push("/bid");
  }

  async function register(email: string, password: string, fullName: string) {
    const { access_token } = await apiRegister(email, password, fullName);
    setToken(access_token);
    await refreshUser();
    router.push("/bid");
  }

  function logout() {
    clearToken();
    setUser(null);
    router.push("/login");
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
