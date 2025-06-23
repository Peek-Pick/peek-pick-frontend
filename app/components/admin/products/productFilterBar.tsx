import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
    keyword: string;
    onSearch: (kw: string) => void;
}

export default function AdminProductsFilterBar({ keyword, onSearch }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.value = keyword;
        }
    }, [keyword]);

    const handleSearch = () => {
        const kw = inputRef.current?.value.trim() ?? "";
        onSearch(kw);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleSearch();
    };

    return (
        <div className="flex justify-between items-center mb-4 text-sm bg-white p-2">
            {/* 왼쪽: 검색창 */}
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    ref={inputRef}
                    defaultValue={keyword}
                    onKeyDown={handleKeyDown}
                    placeholder="상품명/설명 검색"
                    className="border border-gray-300 rounded-lg px-4 py-1.5 w-72 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleSearch}
                    className="bg-blue-600 text-white px-5 py-1.5 rounded-lg hover:bg-blue-700 transition"
                >
                    검색
                </button>
            </div>

            {/* 오른쪽: 새 상품 등록 버튼 (포인트필터바 디자인 적용) */}
            <button
                onClick={() => navigate("/admin/products/add")}
                className="flex items-center gap-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-100 hover:text-gray-800 transition"
            >
                <svg
                    className="w-4 h-4"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                        fill="currentColor"
                    />
                </svg>
                상품 추가
            </button>
        </div>
    );
}
