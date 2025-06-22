import { createContext, useContext, useState, useEffect } from 'react';

interface AdminAuthContextProps {
    isLoggedIn: boolean;
    login: () => void;
    logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextProps | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
    // SSR과 클라이언트 일치 위해 초기값은 false로 고정
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    // 클라이언트에서만 localStorage 상태 동기화
    useEffect(() => {
        const storedStatus = localStorage.getItem("isAdminLoggedIn") === "true";
        setIsLoggedIn(storedStatus);

        // storage 이벤트 리스너 (다른 탭 로그인 상태 변경 동기화)
        const syncState = () => {
            const status = localStorage.getItem("isAdminLoggedIn") === "true";
            setIsLoggedIn(status);
        };
        window.addEventListener("storage", syncState);

        return () => window.removeEventListener("storage", syncState);
    }, []);

    const login = () => {
        localStorage.setItem("isAdminLoggedIn", "true");
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.removeItem("isAdminLoggedIn");
        setIsLoggedIn(false);
    };

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