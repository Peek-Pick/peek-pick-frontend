import {useNavigate} from "react-router";

export interface FilterBarProps {
    category: string;
    setCategory: (value: string) => void;
    keyword: string;
    setKeyword: (value: string) => void;
    onSearch: () => void;
    hidden: boolean;
    setHidden: (value: boolean) => void;
}

function FilterBar({ category, setCategory, keyword, setKeyword, onSearch, hidden, setHidden }: FilterBarProps) {
    const navigate = useNavigate();

    return (
        <div className="flex justify-between items-center mb-2 text-sm bg-white p-2">
            {/* 왼쪽: 검색 필터 */}
            <div className="flex items-center gap-2">
                <select
                    value={category}
                    onChange={(e) => {
                        setCategory(e.target.value);
                        setKeyword("");
                    }}
                    className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">전체</option>
                    <option value="pointstoreId">상품 번호</option>
                    <option value="item">상품명</option>
                    <option value="productType">타입</option>
                </select>

                <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="키워드를 입력하세요"
                    className="border border-gray-300 rounded-lg px-4 py-1.5 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={category === "all"}
                />

                <button
                    onClick={onSearch}
                    className="bg-blue-600 text-white px-5 py-1.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                    disabled={category !== "all" && keyword.trim() === ""}
                >
                    검색
                </button>
            </div>

            {/* 오른쪽: 체크박스 + 버튼 */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                    <input
                        type="checkbox"
                        id="hiddenOnly"
                        checked={hidden}
                        onChange={(e) => setHidden(e.target.checked)}
                    />
                    <label htmlFor="hiddenOnly" className="text-gray-700">
                        판매 중단 상품 보기
                    </label>
                </div>

                <button
                    onClick={() => navigate("/admin/points/add")}
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
        </div>
    );
}


export default FilterBar;