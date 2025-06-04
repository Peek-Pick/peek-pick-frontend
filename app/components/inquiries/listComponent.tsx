import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchInquiries, deleteInquiry } from "~/api/inquiriesAPI";
import type { InquiryResponseDTO } from "~/types/inquiries";
import PaginationComponent from "~/components/common/PaginationComponent";
import LoadingComponent from "../common/loadingComponent";

export default function ListComponent() {
    const [items, setItems] = useState<InquiryResponseDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0); // 0-based index
    const size = 10;
    const [totalElements, setTotalElements] = useState(0);

    const nav = useNavigate();

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetchInquiries(page, size); // 0-based API 처리
            setItems(res.data.content || []);
            setTotalElements(res.data.totalElements || 0);
        } catch (err) {
            console.error("데이터 조회 실패:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page]);

    const handleDelete = async (id: number) => {
        if (!confirm("삭제하시겠습니까?")) return;
        try {
            await deleteInquiry(id);
            fetchData();
        } catch (err) {
            console.error("삭제 실패:", err);
        }
    };

    const handleEdit = (id: number) => {
        nav(`/inquiries/${id}/edit`);
    };

    const handleDetail = (id: number) => {
        nav(`/inquiries/${id}`);
    };

    if (loading) return <LoadingComponent isLoading={true} />;

    return (
        <div>
            <button
                onClick={() => nav("/inquiries/add")}
                className="mb-4 px-4 py-2 bg-green-600 text-white rounded"
            >
                문의 추가
            </button>

            {items.length === 0 ? (
                <p className="text-center text-gray-500">문의사항이 없습니다.</p>
            ) : (
                <ul className="space-y-2">
                    {[...items]
                        .sort((a, b) => new Date(b.regDate).getTime() - new Date(a.regDate).getTime())
                        .map((item) => (
                            <li
                                key={item.inquiryId}
                                className="flex justify-between items-center p-3 border rounded hover:bg-gray-50"
                            >
                                <div
                                    className="flex-1 cursor-pointer font-medium text-blue-600"
                                    onClick={() => handleDetail(item.inquiryId)}
                                >
                                    {item.title}
                                </div>
                                <div className="space-x-2">
                                    <button
                                        onClick={() => handleEdit(item.inquiryId)}
                                        className="px-2 py-1 text-sm bg-blue-500 text-white rounded"
                                    >
                                        수정
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.inquiryId)}
                                        className="px-2 py-1 text-sm bg-red-500 text-white rounded"
                                    >
                                        삭제
                                    </button>
                                </div>
                            </li>
                        ))}
                </ul>
            )}

            <PaginationComponent
                currentPage={page}
                totalPages={Math.ceil(totalElements / size)}
                onPageChange={setPage}
                maxPageButtons={10}
            />
        </div>
    );
}