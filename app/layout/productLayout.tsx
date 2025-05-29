// src/layout/ProductLayout.tsx
import { Outlet } from "react-router-dom";

export default function ProductLayout() {
    return (
        <div className="p-4 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">상품 랭킹</h1>
            {/* 중첩된 자식 라우트를 이곳에 렌더링 */}
            <Outlet />
        </div>
    );
}
