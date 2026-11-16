import { createContext, useContext, useEffect, useState } from 'react';
const Ctx = createContext(null);
export const useTheme = () => useContext(Ctx);
export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => localStorage.getItem('sms_theme') === 'dark');
  useEffect(() => { document.documentElement.classList.toggle('dark', dark); localStorage.setItem('sms_theme', dark ? 'dark' : 'light'); }, [dark]);
  return <Ctx.Provider value={{ dark, toggle: () => setDark((d) => !d) }}>{children}</Ctx.Provider>;
}
