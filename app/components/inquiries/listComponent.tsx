import { useNavigate } from "react-router-dom";
import { MessageSquare, Check, Hourglass } from "lucide-react";
import { InquiryLoading } from "~/util/loading/inquiryLoading";
import { BackButton } from "~/util/button/FloatingActionButtons";
import { useTranslation } from "react-i18next";

interface ListComponentProps {
    items?: InquiryResponseDTO[];
    isLoading?: boolean;
    isError?: boolean;
    currentPage: number;
    pageSize: number;
    totalCount: number;
}

function ListComponent({ items = [], isLoading, isError, currentPage, pageSize, totalCount }: ListComponentProps) {
    // 국제화
    const { t } = useTranslation();
    const nav = useNavigate();

    const handleDetail = (id: number) => {
        nav(`/inquiries/${id}`);
    };

    const handleAdd = () => {
        nav("/inquiries/add");
    };

    if (isLoading) return <InquiryLoading />;
    if (isError) return <p className="text-center p-4 text-red-500 text-base sm:text-lg">{t("inquiry.loadFail")}</p>;

    return (
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow px-4 pt-4 pb-6 relative space-y-4">
            <div className="flex justify-between items-center mb-4 mt-1.5">
                <h2 className="flex items-center gap-1 text-xl font-bold text-yellow-600 select-none leading-none">
                    <MessageSquare className="w-6 h-6 leading-none ml-1.5 mt-1.5" />
                    <span className="leading-none text-black ml-1.5">{t("inquiry.listTitle")}</span>
                </h2>
                <button
                    onClick={handleAdd}
                    className="px-4 py-2 rounded-md bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold shadow-sm border border-white transition"
                >
                    + {t("inquiry.new")}
                </button>
            </div>

            {items.length === 0 ? (
                <div className="py-20 text-center text-yellow-300 text-base select-none">
                    {t("inquiry.empty")}
                </div>
            ) : (
                <ul className="flex flex-col gap-5">
                    {items.map((item, index) => {
                        const typeLabel = t(`inquiry.types.${item.type}`, item.type);
                        const isAnswered = item.status === "ANSWERED";
                        const statusLabel = t(`inquiry.status.${isAnswered ? "ANSWERED" : "PENDING"}`);
                        const reversedIndex = totalCount - ((currentPage - 1) * pageSize + index);

                        return (
                            <li
                                key={item.inquiryId}
                                onClick={() => handleDetail(item.inquiryId)}
                                className="flex gap-4 p-4 rounded-lg bg-white shadow-sm hover:shadow-md cursor-pointer border border-black/10 transition"
                            >
                                <div className="flex-shrink-0 w-8 flex items-center justify-center text-yellow-500 font-extrabold text-xl select-none">
                                    {reversedIndex}
                                </div>

                                <div className="flex flex-col flex-grow">
                                    <div className="text-sm font-semibold text-yellow-500 mb-1 select-none">
                                        [{typeLabel}]
                                    </div>

                                    {item.content && (
                                        <div className="text-base text-black line-clamp-1 mb-4 select-text">
                                            {item.content}
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center text-xs select-none">
                                        <div>{t("inquiry.postedOn")}: {item.regDate.slice(0, 10).replace(/-/g, ".")}</div>
                                        <div
                                            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 font-semibold transition-colors ${
                                                isAnswered
                                                    ? "bg-yellow-400 hover:bg-yellow-500 text-white"
                                                    : "bg-gray-100 hover:bg-gray-200 text-gray-500"
                                            }`}
                                        >
                                            {isAnswered ? <Check className="w-4 h-4" /> : <Hourglass className="w-4 h-4" />}
                                            {statusLabel}
                                        </div>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
            <BackButton />
        </div>
    );
}

export default ListComponent;