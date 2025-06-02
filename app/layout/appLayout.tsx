// src/components/layout/AppLayout.tsx
import { Outlet, useLocation, useNavigate} from "react-router";
import { ReceiptText, User } from "lucide-react"; // 아이콘 라이브러리 (lucide-react)

export default function AppLayout() {
    const location = useLocation();
    const navigate = useNavigate();

    // 페이지 이름 매핑 (간단히 예시)
    const pageTitleMap: { [key: string]: string } = {
        "/main": "Peek & Pick",
        "/mypage": "마이페이지",
    };

    const pageTitle = pageTitleMap[location.pathname] || "";

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 헤더 */}
            <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-transparent backdrop-blur-md shadow-md">
                {/* 왼쪽: 로고 + 페이지 이름 */}
                <button className="flex items-center gap-2">
                    <img src="/icons/icon_clean.png" alt="Logo" className="h-10 w-10" />
                    <span className="text-lg font-semibold">{pageTitle}</span>
                </button>

                {/* 오른쪽: 아이콘들 */}
                <div className="flex items-center gap-1">
                    {/* 영수증 버튼 */}
                    <button className="w-10 h-10 flex items-center justify-center rounded  hover:bg-gray-100">
                        <ReceiptText className="w-6 h-6 text-gray-500" />
                    </button>

                    {/* 마이페이지 버튼 */}
                    <button
                        onClick={() => navigate("/mypage")}
                        className="w-10 h-10 flex items-center justify-center rounded hover:bg-gray-100"
                    >
                        <User className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

            </header>

            {/* 본문 */}
            <main className="p-4">
                <Outlet />
            </main>
        </div>
    );
}
