import { useState, useEffect } from "react";

export interface InquiryFilterBarProps {
    category: string;
    setCategory: (value: string) => void;
    keyword: string;
    setKeyword: (value: string) => void;
    size: string;
    setSize: (value: string) => void;
    waitingAnswerOnly: boolean;
    setWaitingAnswerOnly: (value: boolean) => void;
    onSearch: () => void;
}

function InquiryFilterBar({
                              category,
                              setCategory,
                              keyword,
                              setKeyword,
                              size,
                              setSize,
                              waitingAnswerOnly,
                              setWaitingAnswerOnly,
                              onSearch,
                          }: InquiryFilterBarProps) {
    // 로컬 상태로 입력/옵션을 관리하여 검색 버튼 클릭 시에만 적용
    const [localCategory, setLocalCategory] = useState(category);
    const [localKeyword, setLocalKeyword] = useState(keyword);
    const [localSize, setLocalSize] = useState(size);

    // 부모 props 변경 시 로컬 상태 동기화
    useEffect(() => setLocalCategory(category), [category]);
    useEffect(() => setLocalKeyword(keyword), [keyword]);
    useEffect(() => setLocalSize(size), [size]);

    // 검색 버튼 클릭 핸들러
    const handleSearch = () => {
        setCategory(localCategory);
        // 키워드 없으면 빈 문자열로 설정해 키워드 파라미터 제외 로직을 부모에서 처리
        const kw = localKeyword.trim();
        setKeyword(kw);
        setSize(localSize);
        onSearch();
    };

    // 체크박스 변경 즉시 필터링
    const handleWaitingChange = (checked: boolean) => {
        setWaitingAnswerOnly(checked);
        onSearch();
    };

    return (
        <div className="flex justify-between items-center mb-2 text-sm bg-white p-2">
            {/* 왼쪽: 검색 필터 */}
            <div className="flex items-center gap-2">
                <select
                    value={localCategory}
                    onChange={(e) => setLocalCategory(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">전체</option>
                    <option value="title">제목</option>
                    <option value="titleContent">제목+본문</option>
                    <option value="writer">닉네임</option>
                    <option value="inquiryId">문의번호</option>
                </select>

                <input
                    type="text"
                    value={localKeyword}
                    onChange={(e) => setLocalKeyword(e.target.value)}
                    placeholder="키워드를 입력하세요"
                    className="border border-gray-300 rounded-lg px-4 py-1.5 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                    onClick={handleSearch}
                    className="bg-blue-600 text-white px-5 py-1.5 rounded-lg hover:bg-blue-700 transition"
                >
                    검색
                </button>
            </div>

            {/* 오른쪽: size 옵션 + 답변 대기만 보기 체크박스 */}
            <div className="flex items-center gap-4">
                <select
                    value={localSize}
                    onChange={(e) => setLocalSize(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="10">10개</option>
                    <option value="20">20개</option>
                    <option value="50">50개</option>
                </select>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="waitingAnswerOnly"
                        checked={waitingAnswerOnly}
                        onChange={(e) => handleWaitingChange(e.target.checked)}
                    />
                    <label htmlFor="waitingAnswerOnly" className="text-sm text-gray-700">
                        답변 대기만 보기
                    </label>
                </div>
            </div>
        </div>
    );
}

export default InquiryFilterBar;