import ListComponent from "~/components/inquiries/listComponent";
import BottomNavComponent from "~/components/main/bottomNavComponent";

export default function ListPage() {
    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">문의사항 목록</h1>
            <ListComponent />
            <BottomNavComponent/>
            {/* 임시 footer 공간 */}
            <div className="h-20" />
        </div>
    );
}
