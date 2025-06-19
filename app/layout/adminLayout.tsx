import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAdminAuth } from "~/contexts/AdminAuthContext"; // ✅ 추가
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faHome, faBox, faUsers, faStar, faQuestionCircle,
    faFlag, faBullhorn, faCartShopping, faChevronRight,
    faChevronLeft, faRightFromBracket, faRightToBracket
} from '@fortawesome/free-solid-svg-icons'

export default function AdminLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { isLoggedIn, logout } = useAdminAuth(); // ✅ 변경

    const handleLogout = () => {
        logout(); // ✅ AuthContext 사용
        navigate("/admin/logout");
    };

    const handleLogin = () => {
        navigate("/admin/login");
    };

    const [currentTime, setCurrentTime] = useState(
        new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        })
    );

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(
                new Date().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                })
            );
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const menuItems = [
        { to: "/admin/dashboard", icon: faHome, label: "대시보드" },
        { to: "/admin/products/list", icon: faBox, label: "상품" },
        { to: "/admin/users/list", icon: faUsers, label: "사용자" },
        { to: "/admin/reviews/list", icon: faStar, label: "리뷰" },
        { to: "/admin/inquiries/list", icon: faQuestionCircle, label: "문의" },
        { to: "/admin/reports/list", icon: faFlag, label: "신고" },
        { to: "/admin/notices/list", icon: faBullhorn, label: "공지" },
        { to: "/admin/points/list", icon: faCartShopping, label: "포인트 상점" },
    ];

    const pageTitleMap: { [key: string]: string } = {
        "/admin/dashboard": "DashBoard",
        "/admin/products/list": "Products List",
        "/admin/users/list": "Users List",
        "/admin/reviews/list": "Reviews List",
        "/admin/inquiries/list": "Inquiries List",
        "/admin/reports/list": "Reports List",
        "/admin/notices/list": "Notice List",
        "/admin/points/list": "Point Products List"
    };

    const [dynamicTitle, setDynamicTitle] = useState<string>("");

    useEffect(() => {
        if (pageTitleMap[location.pathname]) {
            setDynamicTitle("");
        }
    }, [location.pathname]);

    const pageTitle = dynamicTitle || pageTitleMap[location.pathname] || "";

    return (
        <div className="flex min-h-screen">
            {/* 사이드바 */}
            <aside className={`flex flex-col bg-gradient-to-br from-[#1a1c2e] to-[#16181f] text-white transition-all duration-300 fixed top-0 left-0 h-screen z-20 ${collapsed ? "w-20" : "w-72"}`}>
                <div className="flex items-center relative h-16 px-4">
                    <button onClick={() => setCollapsed(!collapsed)}
                            className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-700 text-white shadow-md hover:bg-gray-600 transition-colors duration-200">
                        <FontAwesomeIcon icon={collapsed ? faChevronRight : faChevronLeft} className="w-4 h-4" />
                    </button>
                    {!collapsed && (
                        <p className="text-sm text-gray-400 ml-3 transition-opacity duration-300">Dashboard</p>
                    )}
                </div>

                <nav className="flex flex-col mt-2 space-y-1 px-2">
                    {menuItems.map(({ to, icon, label }) => (
                        <NavLink key={to} to={to}
                                 className={({ isActive }) =>
                                     `flex items-center gap-3 py-2 rounded transition-all duration-200 ${
                                         isActive ? "bg-white/10 text-white font-semibold" : "text-gray-400 hover:text-white hover:translate-x-1"
                                     } ${collapsed ? "justify-center px-2 gap-0" : "px-4"}`}
                        >
                            <FontAwesomeIcon icon={icon} style={{ width: '18px', height: '18px' }} />
                            <span className={`transition-all duration-300 whitespace-nowrap ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"}`}>
                                {label}
                            </span>
                        </NavLink>
                    ))}
                </nav>

                <div className="mt-auto p-4 border-t border-white/10">
                    <div className="flex items-center">
                        <img src="https://randomuser.me/api/portraits/women/70.jpg" alt="Profile" className="h-10 w-10 rounded-full" />
                        {!collapsed && (
                            <div className="ml-3">
                                <h6 className="text-white mb-0 text-sm">이근황</h6>
                                <small className="text-gray-400">Admin</small>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* 메인 콘텐츠 */}
            <div className={`flex-1 min-h-screen transition-all duration-300 ${collapsed ? "ml-20" : "ml-72"}`}>
                <header className="bg-white shadow fixed top-0 z-30 right-0 transition-all duration-300 flex items-center justify-between px-6 py-3"
                        style={{
                            left: collapsed ? "5rem" : "18rem",
                            width: collapsed ? "calc(100% - 5rem)" : "calc(100% - 18rem)",
                        }}>
                    <div className="flex items-center gap-3">
                        <span className="text-xl font-bold text-gray-800">{pageTitle}</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <span>{currentTime}</span>

                        {isLoggedIn ? (
                            <button onClick={handleLogout}
                                    aria-label="Logout"
                                    className="flex items-center gap-1 text-gray-600 hover:text-red-600 leading-none">
                                <FontAwesomeIcon icon={faRightFromBracket} size="lg" />
                                <span className="hidden sm:inline font-medium">Logout</span>
                            </button>
                        ) : (
                            <button onClick={handleLogin}
                                    aria-label="Login"
                                    className="flex items-center gap-1 text-gray-600 hover:text-blue-600 leading-none">
                                <FontAwesomeIcon icon={faRightToBracket} size="lg" />
                                <span className="hidden sm:inline font-medium">Login</span>
                            </button>
                        )}
                    </div>
                </header>

                <main className="pt-20 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}