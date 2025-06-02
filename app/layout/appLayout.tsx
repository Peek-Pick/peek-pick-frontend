// src/components/layout/AppLayout.tsx
import { Outlet, useLocation, useNavigate } from "react-router";
import { ReceiptText, User } from "lucide-react";
import { useEffect, useState } from "react";

// ① 상품 상세 정보를 가져오는 API 함수 import
import type { ProductDetailDTO } from "~/types/products";
import { getProductDetail } from "~/api/productsAPI";

export default function AppLayout() {
    const location = useLocation();
    const navigate = useNavigate();

    // ② 상품명을 담을 로컬 상태
    const [dynamicTitle, setDynamicTitle] = useState<string>("");

    // 페이지 이름 매핑 (정적 경로에 대한 매핑)
    const pageTitleMap: { [key: string]: string } = {
        "/main": "Peek & Pick",
        "/mypage": "마이페이지",
        "/mypage/favorites": "찜한 상품",
        "/products/ranking": "상품 랭킹",
        // 다른 정적 경로가 필요하다면 여기에 추가
    };

    // ③ location.pathname이 변경될 때마다 실행
    useEffect(() => {
        // 우선 정적 매핑 가능한 경로인지 확인
        if (pageTitleMap[location.pathname]) {
            // 정적 매핑이 있으면 dynamicTitle을 비워두고(또는 초기화) 종료
            setDynamicTitle("");
            return;
        }

        // ④ /products/:barcode 패턴인지 판별
        const productMatch = location.pathname.match(/^\/products\/([^/]+)$/);
        if (productMatch) {
            const barcode = productMatch[1];
            // API 호출하여 상품명을 가져와 dynamicTitle에 저장
            (async () => {
                try {
                    const data: ProductDetailDTO = await getProductDetail(barcode);
                    setDynamicTitle(data.name);
                } catch (error) {
                    console.error("상품명 조회 실패:", error);
                    // 조회 실패 시 기본값 또는 빈 문자열로 둡니다.
                    setDynamicTitle("");
                }
            })();
        } else {
            // /products/ 패턴이 아니면 dynamicTitle 초기화
            setDynamicTitle("");
        }
    }, [location.pathname]);

    // ⑤ 화면 상단에 실제 보여줄 최종 제목
    // dynamicTitle이 있으면 그것을, 아니면 정적 맵핑을 사용
    const pageTitle =
        dynamicTitle || pageTitleMap[location.pathname] || "";

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
                    <button className="w-10 h-10 flex items-center justify-center rounded hover:bg-gray-100">
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
