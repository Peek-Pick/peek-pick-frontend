import { useEffect, useRef } from "react";

interface Props {
    keyword: string;
    onSearch: (kw: string) => void;
}

export default function AdminProductsFilterBar({ keyword, onSearch }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);

    // 검색어 초기화 시 ref에 반영
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
        <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    ref={inputRef}
                    defaultValue={keyword}
                    onKeyDown={handleKeyDown}
                    placeholder="상품명/설명 검색"
                    className="border border-gray-300 rounded-lg px-4 py-1.5 w-72 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleSearch}
                    className="px-5 py-1.5 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                    검색
                </button>
            </div>
        </div>
    );
}
