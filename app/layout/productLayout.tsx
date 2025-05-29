// src/layout/ProductLayout.tsx
import { Outlet } from "react-router-dom";
//임시적으로 만든 레이아웃. product는 나중에 다른 레이아웃(메인 구현 후)에 포함될 수도 잇음
export default function ProductLayout() {
    return (
        <div className="p-4 max-w-5xl mx-auto">
            <h1 className="p-2 text-2xl font-bold mb-4 bg-gray-200">Layout  //  로고, 마이페이지, 검색 여기에 넣어야 할지?</h1>
            {/* 중첩된 자식 라우트를 이곳에 렌더링 */}
            <Outlet />
        </div>
    );
}
