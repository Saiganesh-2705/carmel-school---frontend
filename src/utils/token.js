// "Remember me" ticked -> localStorage (survives browser restart). Unticked -> sessionStorage (cleared when the tab closes).
const KEY = 'sms_token';
export const getToken = () => localStorage.getItem(KEY) || sessionStorage.getItem(KEY);
export const clearToken = () => { localStorage.removeItem(KEY); sessionStorage.removeItem(KEY); };
export const setToken = (token, remember = true) => { clearToken(); (remember ? localStorage : sessionStorage).setItem(KEY, token); };
export const isRemembered = () => !!localStorage.getItem(KEY);
