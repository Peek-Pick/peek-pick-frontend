import { createContext, useContext, useState, useEffect } from 'react';

interface AdminAuthContextProps {
    isLoggedIn: boolean;
    login: () => void;
    logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextProps | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem("isAdminLoggedIn") === "true";
        }
        return false;
    });

    const login = () => {
        localStorage.setItem("isAdminLoggedIn", "true");
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.removeItem("isAdminLoggedIn");
        setIsLoggedIn(false);
    };

    useEffect(() => {
        const syncState = () => {
            const status = localStorage.getItem("isAdminLoggedIn") === "true";
            setIsLoggedIn(status);
        };
        window.addEventListener("storage", syncState);
        return () => window.removeEventListener("storage", syncState);
    }, []);

    return (
        <AdminAuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AdminAuthContext.Provider>
    );
}

export function useAdminAuth() {
    const context = useContext(AdminAuthContext);
    if (!context) throw new Error("useAdminAuth must be used within AdminAuthProvider");
    return context;
}