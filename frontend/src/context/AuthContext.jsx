import React, { createContext, useContext, useState } from 'react';
import { authApi } from '../services/api.js';

const AuthContext = createContext(null);
const normalizeRole = role => ['providers', 'provider', 'service_provider'].includes(role) ? 'service_provider' : 'admin' === role ? 'admin' : 'customer';
const storedUser = JSON.parse(sessionStorage.getItem('careconnect_user') || 'null');
export function AuthProvider({ children }) { const [user, setUser] = useState(() => storedUser && { ...storedUser, role: normalizeRole(storedUser.role) }); const saveSession = result => { const normalizedUser = { ...result.user, role: normalizeRole(result.user.role) }; sessionStorage.setItem('careconnect_token', result.token); sessionStorage.setItem('careconnect_user', JSON.stringify(normalizedUser)); setUser(normalizedUser); return normalizedUser; }; const signIn = async credentials => saveSession(await authApi.login(credentials)); const register = async details => saveSession(await authApi.register(details)); const signOut = () => { sessionStorage.removeItem('careconnect_token'); sessionStorage.removeItem('careconnect_user'); setUser(null); }; React.useEffect(() => { const expire = () => setUser(null); window.addEventListener('careconnect:session-expired', expire); return () => window.removeEventListener('careconnect:session-expired', expire); }, []); return <AuthContext.Provider value={{ user, signIn, register, signOut }}>{children}</AuthContext.Provider>; }
export function useAuth() { return useContext(AuthContext); }
