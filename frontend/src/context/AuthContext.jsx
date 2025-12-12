import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, login as loginApi, register as registerApi } from '../api/services/auth';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // Token varsa api header'a ekleyelim (axios interceptor yoksa garanti olsun)
                    // api.defaults.headers.common['Authorization'] = `Bearer ${token}`; 
                    // Not: Axios interceptor varsa yukarıdakine gerek yok ama check etmek lazım.
                    const userData = await getCurrentUser();
                    setUser(userData);
                } catch (error) {
                    console.error("Session restore failed", error);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (username, password) => {
        const data = await loginApi(username, password);
        localStorage.setItem('token', data.access_token);
        // Login sonrası hemen user bilgisini çekelim
        const userData = await getCurrentUser();
        setUser(userData);
        return userData;
    };

    const register = async (userData) => {
        return await registerApi(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
