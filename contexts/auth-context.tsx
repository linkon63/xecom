// contexts/auth-context.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  authSession: any | null;
  setAuthSession: (session: any | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authSession, setAuthSession] = useState<any | null>(null);

  const value = {
    authSession,
    setAuthSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}