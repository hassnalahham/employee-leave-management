import { createContext, useEffect, useState } from "react";
import { api, getToken } from "../api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => Boolean(getToken()));

  // Restore the session from a stored token on first load.
  useEffect(() => {
    if (!getToken()) return;

    let active = true;
    api
      .me()
      .then((me) => active && setUser(me))
      .catch(() => localStorage.removeItem("token"))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, []);

  async function login(email, password) {
    const { token, user } = await api.login(email, password);
    localStorage.setItem("token", token);
    setUser(user);
    return user;
  }

  async function register(payload) {
    const { token, user } = await api.register(payload);
    localStorage.setItem("token", token);
    setUser(user);
    return user;
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
