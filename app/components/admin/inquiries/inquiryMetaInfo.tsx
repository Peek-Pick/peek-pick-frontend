import { INQUIRY_TYPES } from "~/enums/inquiries/inquiry";

export interface AdminInquiryMetaProps {
    data?: InquiryResponseDTO;
}

function InquiryMetaInfo({ data }: AdminInquiryMetaProps) {
    if (!data) return null;

    const typeLabel = INQUIRY_TYPES.find((t) => t.value === data.type)?.label ?? data.type;

    const infoItems: { label?: string; value: React.ReactNode }[] = [
        { label: "문의 ID", value: data.inquiryId },
        { label: "유형", value: typeLabel },
        { label: "등록일", value: new Date(data.regDate).toLocaleString() },
    ];

    if (data.modDate !== data.regDate) {
        infoItems.push({
            label: "수정일",
            value: new Date(data.modDate).toLocaleString(),
        });
    }

    if (data.isDelete) {
        infoItems.push({
            value: <span className="text-red-500 font-semibold">삭제됨</span>,
        });
    }

    const isAnswered = data.status === "ANSWERED";
    const statusText = isAnswered ? "답변 완료" : "대기 중";
    const statusStyle = isAnswered
        ? "bg-green-200 text-green-800"
        : "bg-gray-200 text-gray-700";

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 my-6">
            <div className="flex justify-between items-start">
                {/* 메타 정보 */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                    {infoItems.map((item, index) => (
                        <div className="flex items-center" key={index}>
                            {item.label && (
                                <span className="font-semibold text-gray-700 dark:text-white mr-1 whitespace-nowrap">
                                    {item.label}:
                                </span>
                            )}
                            <span className="break-all">{item.value}</span>
                        </div>
                    ))}
                </div>

                {/* 상태 버튼 스타일 */}
                <div
                    className={`px-4 py-1 rounded-full text-sm font-semibold shadow-sm ${statusStyle}`}
                >
                    {statusText}
                </div>
            </div>
        </div>
    );
}

export default InquiryMetaInfo;