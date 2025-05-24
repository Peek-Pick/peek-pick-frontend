import { Outlet, Link, useLocation } from "react-router";

export default function AdminPointsLayout() {
    const location = useLocation();

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            {/* 헤더 */}
            <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">👑 관리자 페이지</h1>
                <nav className="space-x-4">
                    <Link to="/" className="text-gray-600 hover:text-blue-500">홈으로</Link>
                    <Link to="/admin/points/add" className="text-gray-600 hover:text-blue-500">상품 등록</Link>
                </nav>
            </header>

            {/* 콘텐츠 */}
            <div className="flex flex-1">
                {/* 사이드 메뉴 */}
                <aside className="w-64 bg-white p-4 border-r hidden md:block">
                    <h2 className="text-lg font-semibold mb-4">메뉴</h2>
                    <ul className="space-y-2">
                        <li>
                            <Link
                                to="/admin/points/list"
                                className="block px-3 py-2 rounded hover:bg-gray-100"
                            >
                                상품 목록
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin/points/add"
                                className="block px-3 py-2 rounded hover:bg-gray-100"
                            >
                                상품 등록
                            </Link>
                        </li>
                    </ul>
                </aside>

                {/* 본문 */}
                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}