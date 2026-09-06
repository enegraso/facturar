import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [companyId, setCompanyId] = useState(localStorage.getItem("companyId"));

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
    if (companyId) localStorage.setItem("companyId", companyId);
    else localStorage.removeItem("companyId");
  }, [token, companyId]);

  const login = (token, companyId) => {
    setToken(token);
    setCompanyId(companyId);
  };

  const logout = () => {
    setToken(null);
    setCompanyId(null);
  };

  return (
    <AuthContext.Provider value={{ token, companyId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
