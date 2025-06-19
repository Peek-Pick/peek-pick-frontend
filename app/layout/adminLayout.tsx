import {NavLink, Outlet, useLocation, useNavigate} from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faHome,
    faBox,
    faUsers,
    faStar,
    faQuestionCircle,
    faFlag,
    faBullhorn,
    faCartShopping,
    faChevronRight,
    faChevronLeft, faRightFromBracket, faRightToBracket,
} from '@fortawesome/free-solid-svg-icons'

export default function AdminLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const location = useLocation();
    const navigate = useNavigate();

    // 로그아웃 핸들러
    const handleLogout = () => {
        navigate("/admin/login");
    };

    // 로그인 핸들러
    const handleLogin = () => {
        navigate("/admin/login");
    };

    //실시간 시간 처리
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

    // 페이지 이름 매핑 (정적 경로에 대한 매핑)
    const pageTitleMap: { [key: string]: string } = {
        "/admin/dashboard": "DashBoard",
        "/admin/products/list": "Products List",
        "/admin/users/list": "Users List",
        "/admin/reviews/list": "Reviews List",
        "/admin/inquiries/list": "Inquiries List",
        "/admin/reports/list": "Reports List",
        "/admin/notices/list": "Notice List",
        "/admin/points/list": "Point Products List"

        // 다른 정적 경로가 필요하다면 여기에 추가
    };

    // ② 상품명을 담을 로컬 상태
    const [dynamicTitle, setDynamicTitle] = useState<string>("");

    // ③ location.pathname이 변경될 때마다 실행
    useEffect(() => {
        // 우선 정적 매핑 가능한 경로인지 확인
        if (pageTitleMap[location.pathname]) {
            // 정적 매핑이 있으면 dynamicTitle을 비워두고(또는 초기화) 종료
            setDynamicTitle("");
            return;
        }
    }, [location.pathname]);
    // dynamicTitle이 있으면 그것을, 아니면 정적 맵핑을 사용
   
    const pageTitle =
        dynamicTitle || pageTitleMap[location.pathname] || "";
    
    return (
        <div className="flex min-h-screen">
            {/* 사이드바 */}
            <aside
                className={`flex flex-col bg-gradient-to-br from-[#1a1c2e] to-[#16181f] text-white transition-all duration-300 fixed top-0 left-0 h-screen z-20 ${
                    collapsed ? "w-20" : "w-72"
                }`}
            >
                {/* 상단 영역 */}
                <div className="flex items-center relative h-16 px-4">
                    {/* 토글 버튼 - 항상 내부에 위치하도록 left로 설정 */}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="w-8 h-8 rounded-full flex items-center justify-center
                                 bg-gray-700 text-white shadow-md hover:bg-gray-600 transition-colors duration-200"
                    >
                        <FontAwesomeIcon icon={collapsed ? faChevronRight : faChevronLeft} className="w-4 h-4" />
                    </button>

                    {/* Dashboard 텍스트 */}
                    {!collapsed && (
                        <p className="text-sm text-gray-400 ml-3 transition-opacity duration-300">Dashboard</p>
                    )}
                </div>

                {/* 메뉴 영역 */}
                <nav className="flex flex-col mt-2 space-y-1 px-2">
                    {menuItems.map(({ to, icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `flex items-center gap-3 py-2 rounded transition-all duration-200 ${
                                    isActive
                                        ? "bg-white/10 text-white font-semibold"
                                        : "text-gray-400 hover:text-white hover:translate-x-1"
                                } ${collapsed ? "justify-center px-2 gap-0" : "px-4"}`
                            }
                        >
                            <FontAwesomeIcon
                                icon={icon}
                                style={{ width: '18px', height: '18px' }}
                                className="text-gray-400"
                            />

                            {/* 항상 렌더링하고 숨김처리 */}
                            <span
                                className={`transition-all duration-300 whitespace-nowrap ${
                                    collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"
                                }`}
                            >
                                {label}
                            </span>
                        </NavLink>
                    ))}
                </nav>

                {/* 프로필 */}
                <div className="mt-auto p-4 border-t border-white/10">
                    <div className="flex items-center">
                        <img
                            src="https://randomuser.me/api/portraits/women/70.jpg"
                            alt="Profile"
                            className="h-10 w-10 rounded-full"
                        />
                        {!collapsed && (
                            <div className="ml-3">
                                <h6 className="text-white mb-0 text-sm">이근황</h6>
                                <small className="text-gray-400">Admin</small>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* 메인 영역 */}
            <div
                className={`flex-1 min-h-screen transition-all duration-300 ${
                    collapsed ? "ml-20" : "ml-72"
                }`}
            >
                {/* 상단바 */}
                <header
                    className="bg-white shadow fixed top-0 z-30 right-0 transition-all duration-300 flex items-center justify-between px-6 py-3"
                    style={{
                        left: collapsed ? "5rem" : "18rem",
                        width: collapsed ? "calc(100% - 5rem)" : "calc(100% - 18rem)",
                    }}
                >
                    {/* 좌측 타이틀 */}
                    <div className="flex items-center gap-3">
                        <span className="text-xl font-bold text-gray-800">{pageTitle}</span>
                    </div>

                    {/* 우측 메뉴: 시간, 알림, 계정 */}
                    <div className="flex items-center gap-6">
                        {/* 시간 */}
                        <span>{currentTime}</span>

                        {/* 관리자 로그인/로그아웃 버튼 */}
                        {isLoggedIn ? (
                            <button
                                onClick={handleLogout}
                                aria-label="Logout"
                                className="flex items-center gap-1 text-gray-600 hover:text-red-600 leading-none"
                            >
                                <FontAwesomeIcon icon={faRightFromBracket} size="lg" className="align-middle" />
                                <span className="hidden sm:inline font-medium">Logout</span>
                            </button>
                        ) : (
                            <button
                                onClick={handleLogin}
                                aria-label="Login"
                                className="flex items-center gap-1 text-gray-600 hover:text-blue-600 leading-none"
                            >
                                <FontAwesomeIcon icon={faRightToBracket} size="lg" className="align-middle" />
                                <span className="hidden sm:inline font-medium">Login</span>
                            </button>
                        )}
                    </div>
                </header>

                {/* 콘텐츠 */}
                <main className="pt-20 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}