import { Outlet, Link, useLocation } from "react-router";

export default function AdminPointsLayout() {
    const location = useLocation();

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            {/* 헤더 */}
            <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">👑 관리자 페이지</h1>
                <nav className="space-x-4">
                    <Link to="/" className="text-gray-600 hover:text-blue-500 transition">
                        홈으로
                    </Link>
                    <Link to="/admin/points/add" className="text-gray-600 hover:text-blue-500 transition">
                        상품 등록
                    </Link>
                </nav>
            </header>

            {/* 콘텐츠 */}
            <div className="flex flex-1">
                {/* 사이드바 */}
                <aside className="w-64 bg-white p-6 border-r hidden md:block">
                    <h2 className="text-xl font-semibold text-gray-700 mb-6">메뉴</h2>
                    <nav className="flex flex-col space-y-3">
                        <Link
                            to="/admin/points/list"
                            className={`px-4 py-2 rounded ${
                                location.pathname.includes("/admin/points/list")
                                    ? "bg-blue-100 text-blue-700 font-semibold"
                                    : "hover:bg-gray-100 text-gray-700"
                            }`}
                        >
                            📦 상품 목록
                        </Link>
                        <Link
                            to="/admin/points/add"
                            className={`px-4 py-2 rounded ${
                                location.pathname.includes("/admin/points/add")
                                    ? "bg-blue-100 text-blue-700 font-semibold"
                                    : "hover:bg-gray-100 text-gray-700"
                            }`}
                        >
                            ➕ 상품 등록
                        </Link>
                    </nav>
                </aside>

                {/* 본문 */}
                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}