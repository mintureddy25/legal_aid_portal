"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const KEY = "la_admin_token";

interface AuthCtx {
  token: string | null;
  ready: boolean;
  setToken: (t: string | null) => void;
  logout: () => void;
}

const Ctx = createContext<AuthCtx>({
  token: null,
  ready: false,
  setToken: () => {},
  logout: () => {},
});

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setTokenState(localStorage.getItem(KEY));
    setReady(true);
  }, []);

  const setToken = (t: string | null) => {
    setTokenState(t);
    if (t) localStorage.setItem(KEY, t);
    else localStorage.removeItem(KEY);
  };

  return (
    <Ctx.Provider value={{ token, ready, setToken, logout: () => setToken(null) }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAdminAuth = () => useContext(Ctx);
