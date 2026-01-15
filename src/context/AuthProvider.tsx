import { useState } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./useAuth";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state directly from localStorage
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("accessToken")
  );

  const login = (newToken: string) => {
    localStorage.setItem("accessToken", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
