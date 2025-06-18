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
    includeDeleted: boolean;
    setIncludeDeleted: (value: boolean) => void;
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
                              includeDeleted,
                              setIncludeDeleted,
                              onSearch,
                          }: InquiryFilterBarProps) {
    const [localCategory, setLocalCategory] = useState(category);
    const [localKeyword, setLocalKeyword] = useState(keyword);
    const [localSize, setLocalSize] = useState(size);

    useEffect(() => setLocalCategory(category), [category]);
    useEffect(() => setLocalKeyword(keyword), [keyword]);
    useEffect(() => setLocalSize(size), [size]);

    const handleSearch = () => {
        setCategory(localCategory);
        setKeyword(localKeyword.trim());
        setSize(localSize);
        onSearch();
    };

    const handleWaitingChange = (checked: boolean) => {
        setWaitingAnswerOnly(checked);
        onSearch();
    };

    const handleIncludeDeletedChange = (checked: boolean) => {
        setIncludeDeleted(checked);
        onSearch();
    };

    return (
        <div className="flex justify-between items-center mb-2 text-sm bg-white p-2">
            <div className="flex items-center gap-2">
                <select
                    value={localCategory}
                    onChange={(e) => setLocalCategory(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">전체</option>
                    <option value="content">본문</option>
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

                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-1 text-gray-700">
                        <input
                            type="checkbox"
                            checked={waitingAnswerOnly}
                            onChange={(e) => handleWaitingChange(e.target.checked)}
                        />
                        답변 대기만 보기
                    </label>

                    <label className="flex items-center gap-1 text-gray-700">
                        <input
                            type="checkbox"
                            checked={!includeDeleted}
                            onChange={(e) => handleIncludeDeletedChange(!e.target.checked)}
                        />
                        삭제된 문의 제외
                    </label>
                </div>
            </div>
        </div>
    );
}

export default InquiryFilterBar;