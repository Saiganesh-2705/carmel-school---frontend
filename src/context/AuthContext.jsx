import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import { clearToken, getToken, isRemembered, setToken } from '../utils/token';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!getToken());

  useEffect(() => {
    if (!getToken()) return;
    api.get('/auth/me')
      .then((r) => setUser(r.data.user))
      // Only a real 401 signs you out. A network blip or a sleeping server must not delete a valid session.
      .catch((e) => { if (e.response?.status === 401) clearToken(); })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password, remember = true) => {
    const { data } = await api.post('/auth/login', { email: email.trim(), password, remember });
    setToken(data.token, remember); setUser(data.user); return data.user;
  }, []);
  const logout = useCallback(() => { clearToken(); setUser(null); }, []);
  const adopt = useCallback((data) => { if (data.token) setToken(data.token, isRemembered()); setUser(data.user); }, []);

  return <Ctx.Provider value={{ user, setUser, loading, login, logout, adopt }}>{children}</Ctx.Provider>;
}
