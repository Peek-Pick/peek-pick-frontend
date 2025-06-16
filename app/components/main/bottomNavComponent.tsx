// src/components/BottomNav.tsx
import { Home, Search, ScanBarcode } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const navItems = [
    { label: "HOME", icon: Home, path: "/main" },
    { label: "BARCODE", icon: ScanBarcode, path: "/barcode/scan" },
    { label: "SEARCH", icon: Search, path: "/products/search" },
];

export default function BottomNavComponent() {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    return (
        <>
            <div className="h-20" />
            <nav className="fixed bottom-0 left-0 w-full h-14 bg-transparent backdrop-blur-md shadow-2xl flex justify-around items-center z-50"
                 style={{
                     boxShadow: "0 -4px 12px rgba(0, 0, 0, 0.1)",
                 }}
            >
                {navItems.map(({ label, icon: Icon, path }) => {
                    const isActive = pathname === path;

                    return (
                        <button
                            key={path}
                            onClick={() => navigate(path)}
                            className="flex flex-col items-center justify-center gap-[2px] text-[10px]"
                        >
                            <Icon className={`w-6 h-6 ${isActive ? "text-yellow-500" : "text-gray-500"}`} />
                            <span className={isActive ? "text-yellow-500" : "text-gray-500"}>{label}</span>
                        </button>
                    );
                })}
            </nav>
        </>
    );
}
