import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchInquiries } from "~/api/inquiriesAPI";
import type { InquiryResponseDTO } from "~/types/inquiries";
import PaginationComponent from "~/components/common/PaginationComponent";
import LoadingComponent from "../common/loadingComponent";

function ListComponent() {
    const [searchParams, setSearchParams] = useSearchParams();
    const nav = useNavigate();
    const raw = searchParams.get("page");
    const initialPage = raw ? Math.max(0, parseInt(raw, 10)) : 0;
    const [page, setPage] = useState(initialPage);
    const size = 10;
    const [pagesCache, setPagesCache] = useState<Record<number, InquiryResponseDTO[]>>({});
    const [items, setItems] = useState<InquiryResponseDTO[]>([]);
    const [totalElements, setTotalElements] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    // 페이지 바뀔 때 URL 유지
    useEffect(() => {
        setSearchParams({ page: String(page) }, { replace: true });
    }, [page, setSearchParams]);

    // page가 바뀌면, 캐시 체크 후 필요하면 fetch
    useEffect(() => {
        if (pagesCache[page]) {
            setItems(pagesCache[page]);
            setLoading(false);
            return;
        }
        setLoading(true);
        fetchInquiries(page, size)
            .then((res) => {
                const content = res.data.content || [];
                setItems(content);
                setPagesCache((prev) => ({ ...prev, [page]: content }));
                if (totalElements === null) {
                    setTotalElements(res.data.totalElements || 0);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [page, pagesCache, size, totalElements]);

    const handleDetail = (id: number) => {
        nav(`/inquiries/${id}`);
    };

    // 날짜 포맷 함수
    const formatDate = (iso: string) => {
        const d = new Date(iso);
        const now = new Date();
        const pad = (n: number) => n.toString().padStart(2, "0");

        const isToday =
            d.getFullYear() === now.getFullYear() &&
            d.getMonth() === now.getMonth() &&
            d.getDate() === now.getDate();

        if (isToday) {
            return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
        } else {
            const yy = d.getFullYear().toString().slice(-2);
            const mm = pad(d.getMonth() + 1);
            const dd = pad(d.getDate());
            return `${yy}.${mm}.${dd}`;
        }
    };

    if (loading) return <LoadingComponent isLoading />;

    return (
        <div>
            <button onClick={() => nav("/inquiries/add")} className="mb-4 px-4 py-2 bg-green-600 text-white rounded" >
                문의 추가
            </button>

            {items.length === 0 ? ( <p className="text-center text-gray-500">문의사항이 없습니다.</p> ) : (
                <ul className="space-y-2">
                    {items.map((item) => (
                        <li key={item.inquiryId}
                            className="flex items-center p-3 border rounded hover:bg-gray-50" >
                            <div className="w-12 text-gray-500 text-sm flex-shrink-0">
                                #{item.inquiryId}
                            </div>
                            <div className="flex-1 cursor-pointer font-medium text-blue-600 truncate"
                                onClick={() => handleDetail(item.inquiryId)} >
                                {item.title}
                            </div>
                            <div className="ml-4 text-sm text-gray-500 flex-shrink-0 flex items-center space-x-1">
                                <span>{formatDate(item.regDate)}</span>
                                <span>|</span>
                                <span className="whitespace-nowrap">{item.userNickname}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <PaginationComponent
                currentPage={page}
                totalPages={Math.ceil((totalElements ?? 0) / size)}
                onPageChange={setPage}
                maxPageButtons={10}
            />
        </div>
    );
}

export default ListComponent;