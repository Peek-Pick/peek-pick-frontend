import ListComponent from "~/components/inquiries/listComponent";

export default function ListPage() {
    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">문의사항 목록</h1>
            <ListComponent />
        </div>
    );
}
