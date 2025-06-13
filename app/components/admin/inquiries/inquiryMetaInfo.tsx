import {INQUIRY_STATUS_LABELS, INQUIRY_TYPES} from "~/enums/inquiries/inquiry";

export interface AdminInquiryMetaProps {
    data?: InquiryResponseDTO;
}

function InquiryMetaInfo({ data }: AdminInquiryMetaProps) {
    if (!data) return null;

    const typeLabel = INQUIRY_TYPES.find((t) => t.value === data.type)?.label ?? data.type;
    const statusLabel = INQUIRY_STATUS_LABELS[data.status] ?? data.status;

    const infoItems = [
        { label: "문의 ID",   value: data.inquiryId },
        { label: "유형",      value: typeLabel },
        { label: "상태",      value: statusLabel },
        { label: "제목",      value: data.title },
        { label: "등록일",    value: new Date(data.regDate).toLocaleString() },
        { label: "수정일",    value: data.modDate !== data.regDate ? new Date(data.modDate).toLocaleString() : "-" },
        { label: "삭제 여부", value: data.isDelete ? "삭제됨" : "-" },
    ];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 my-6">
            {/* 헤더 */}
            <h2 className="text-lg font-bold text-gray-700 dark:text-white mb-6">문의 정보</h2>

            {/* 문의 관련 정보 */}
            <div className="flex flex-col mt-6">
                {infoItems.map((item, index) => (
                    <div className="flex items-center mb-4" key={index}>
                        <p className="text-md font-bold text-gray-700 dark:text-white mr-2 whitespace-nowrap">{item.label}:</p>
                        <p className="text-md text-gray-500 break-all">{item.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default InquiryMetaInfo;