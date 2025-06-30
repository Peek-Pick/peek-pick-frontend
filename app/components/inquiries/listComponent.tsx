import { useNavigate } from "react-router-dom";
import { MessageSquare, Check, Hourglass } from "lucide-react";
import { INQUIRY_TYPES } from "~/enums/inquiries/inquiry";
import {InquiryLoading} from "~/util/loading/inquiryLoading";
import {BackButton} from "~/util/button/FloatingActionButtons";

interface ListComponentProps {
    items?: InquiryResponseDTO[];
    isLoading?: boolean;
    isError?: boolean
    currentPage: number;
    pageSize: number;
    totalCount: number;
}

function ListComponent({ items, isLoading, isError, currentPage, pageSize, totalCount }: ListComponentProps) {
    if (isLoading)
        return <InquiryLoading />;
    if (isError)
        return <p className="text-center p-4 text-red-500 text-base sm:text-lg">Failed to load inquiry data.</p>;

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
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow px-4 pt-4 pb-6 relative space-y-4">
            <div className="flex justify-between items-center mb-4 mt-1.5">
                <h2 className="flex items-center gap-1 text-xl font-bold text-yellow-600 select-none leading-none">
                    <MessageSquare className="w-6 h-6 leading-none ml-1.5 mt-1.5" />
                    <span className="leading-none text-black ml-1.5">Q&A</span>
                </h2>
                <button
                    onClick={handleAdd}
                    className="px-4 py-2 rounded-md bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold shadow-sm border border-white transition"
                >
                    + New Inquiry
                </button>
            </div>

            {items.length === 0 ? (
                <div className="py-20 text-center text-yellow-300 text-base select-none">
                    You have not submitted any inquiries yet.
                </div>
            ) : (
                <ul className="flex flex-col gap-5">
                    {items.map((item, index) => {
                        const typeLabel = INQUIRY_TYPES.find((t) => t.value === item.type)?.label ?? item.type;
                        const isAnswered = item.status === "ANSWERED";
                        const statusLabel = isAnswered ? "Answered" : "Waiting";

                        const reversedIndex = totalCount - ((currentPage - 1) * pageSize + index);

                        return (
                            <li
                                key={item.inquiryId}
                                onClick={() => handleDetail(item.inquiryId)}
                                className="flex gap-4 p-4 rounded-lg bg-white shadow-sm hover:shadow-md cursor-pointer border border-black/10 transition"
                            >
                                {/* 인덱스 큰 숫자 */}
                                <div className="flex-shrink-0 w-8 flex items-center justify-center text-yellow-500 font-extrabold text-xl select-none">
                                    {reversedIndex}
                                </div>

                                {/* 컨텐츠 영역 */}
                                <div className="flex flex-col flex-grow">
                                    {/* [type] 레이블 */}
                                    <div className="text-sm font-semibold text-yellow-500 mb-1 select-none">
                                        [{typeLabel}]
                                    </div>

                                    {/* 내용 */}
                                    {item.content && (
                                        <div className="text-base text-black line-clamp-1 mb-4 select-text">
                                            {item.content}
                                        </div>
                                    )}

                                    {/* 작성일 및 상태 */}
                                    <div className="flex justify-between items-center text-xs select-none">
                                        <div>Posted on: {item.regDate.slice(0, 10).replace(/-/g, ".")}</div>

                                        <div
                                            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 font-semibold transition-colors ${
                                                isAnswered
                                                    ? "bg-yellow-400 hover:bg-yellow-500 text-white"
                                                    : "bg-gray-100 hover:bg-gray-200 text-gray-500"
                                            }`}
                                        >
                                            {isAnswered ? (
                                                <Check className="w-4 h-4" />
                                            ) : (
                                                <Hourglass className="w-4 h-4" />
                                            )}
                                            {statusLabel}
                                        </div>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
            {/*<BottomNavComponent />*/}
            <BackButton />
        </div>
    );
}

export default ListComponent;