import { useEffect, useRef } from "react";

export interface NoticeFilterBarProps {
    keyword: string;
    category: string;
    setCategory: (value: string) => void;
    onSearch: (keyword: string) => void;
}

function NoticeFilterBar({
                             keyword,
                             category,
                             setCategory,
                             onSearch,
                         }: NoticeFilterBarProps) {
    const inputRef = useRef<HTMLInputElement>(null);

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
        <div className="flex justify-between items-center mb-2 text-sm bg-white p-2">
            <div className="flex items-center gap-2">
                {/* 🔽 검색 기준 */}
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="title">제목</option>
                    <option value="content">내용</option>
                    <option value="titleContent">제목+내용</option>
                </select>

                {/* 🔍 입력창 */}
                <input
                    type="text"
                    defaultValue={keyword}
                    ref={inputRef}
                    onKeyDown={handleKeyDown}
                    placeholder="키워드를 입력하세요"
                    className="border border-gray-300 rounded-lg px-4 py-1.5 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* 🔎 검색 버튼 */}
                <button
                    onClick={handleSearch}
                    className="bg-blue-600 text-white px-5 py-1.5 rounded-lg hover:bg-blue-700 transition"
                >
                    검색
                </button>
            </div>
        </div>
    );
}

export default NoticeFilterBar;
