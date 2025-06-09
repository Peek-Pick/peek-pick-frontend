import { Outlet } from "react-router-dom";

export default function NoticeLayout() {
    return (
        <div className="p-4 border">
            <h2 className="text-xl font-semibold mb-2">Notice 관리</h2>
            <Outlet />
        </div>
    );
}
