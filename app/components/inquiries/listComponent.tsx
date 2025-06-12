import { useNavigate } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import type { InquiryResponseDTO, InquiryType } from "~/types/inquiries";

const INQUIRY_TYPES: { value: InquiryType; label: string }[] = [
    { value: "ACCOUNT", label: "계정/로그인" },
    { value: "POINT_REVIEW", label: "포인트/리뷰" },
    { value: "PRODUCT_ADD", label: "상품 추가" },
    { value: "HOW_TO_USE", label: "사용 방법" },
    { value: "BUG", label: "오류/버그" },
    { value: "ETC", label: "기타 문의" },
];

interface ListComponentProps {
    items: InquiryResponseDTO[];
    size: number;
    onSizeChange: (newSize: number) => void;
}

function ListComponent({ items, size, onSizeChange }: ListComponentProps) {
    const nav = useNavigate();

    const handleDetail = (id: number) => {
        nav(`/inquiries/${id}`);
    };

    const handleAdd = () => {
        nav("/inquiries/add");
    };

    const formatDate = (iso: string) => {
        const d = new Date(iso);
        const now = new Date();
        const pad = (n: number) => n.toString().padStart(2, "0");
        const isToday = d.toDateString() === now.toDateString();
        return isToday
            ? `${pad(d.getHours())}:${pad(d.getMinutes())}`
            : `${d.getFullYear().toString().slice(-2)}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
    };

    return (
        <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800">
                    <MessageSquare className="w-6 h-6 text-yellow-500" />
                    문의사항
                </h2>
                <div className="flex items-center gap-3">
                    <select
                        value={size}
                        onChange={(e) => onSizeChange(Number(e.target.value))}
                        className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                    >
                        {[5, 10, 20, 50].map((n) => (
                            <option key={n} value={n}>
                                {n}개
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={handleAdd}
                        className="px-4 py-1.5 rounded-md bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold"
                    >
                        + 추가
                    </button>
                </div>
            </div>

            {items.length === 0 ? (
                <div className="py-8 text-center text-gray-400 text-sm">
                    문의사항이 없습니다.
                </div>
            ) : (
                <ul className="flex flex-col gap-2">
                    {items.map((item) => {
                        const typeLabel =
                            INQUIRY_TYPES.find((t) => t.value === item.type)?.label ?? item.type;

                        return (
                            <li
                                key={item.inquiryId}
                                onClick={() => handleDetail(item.inquiryId)}
                                className="flex items-center justify-between px-4 py-3 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition cursor-pointer shadow-sm"
                            >
                                {/* ID + [type] + 제목 */}
                                <div className="flex items-center gap-2 min-w-0">
                                    <span className="text-xs text-yellow-500 font-semibold whitespace-nowrap">
                                        #{item.inquiryId}
                                    </span>
                                    <span className="text-yellow-500 font-bold text-sm whitespace-nowrap">
                                        [{typeLabel}]
                                    </span>
                                    <span className="text-sm text-gray-800 truncate max-w-[45vw]">
                                        {item.title}
                                    </span>
                                </div>

                                {/* 날짜 | 닉네임 */}
                                <div className="flex items-center gap-1 text-xs text-gray-500 whitespace-nowrap pl-2">
                                    <span>{formatDate(item.regDate)}</span>
                                    <span className="text-gray-300">|</span>
                                    <span>{item.userNickname}</span>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

export default ListComponent;
