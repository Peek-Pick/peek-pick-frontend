import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle, faFlag, faDownload } from '@fortawesome/free-solid-svg-icons';
import type {Category, CategoryDataMap} from "~/api/dashboardAPI";
import type {PagingResponse} from "~/types/common";
import {ReportReason} from "~/hooks/reviews/useReviewReport";
import {useNavigate} from "react-router-dom";

// 문의 사항 색상 맵핑
const inquiryTypeColorMap: Record<InquiryType, string> = {
    ACCOUNT: "bg-blue-100 text-blue-800",
    PRODUCT_ADD: "bg-green-100 text-green-800",
    POINT_REVIEW: "bg-yellow-100 text-yellow-800",
    HOW_TO_USE: "bg-purple-100 text-purple-800",
    BUG: "bg-red-100 text-red-800",
    ETC: "bg-gray-100 text-gray-800",
};

// 문의 사항 타입 라벨 맵핑
const inquiryTypeLabelMap: Record<InquiryType, string> = {
    ACCOUNT: "계정/로그인",
    PRODUCT_ADD: "상품 추가",
    POINT_REVIEW: "포인트/리뷰",
    HOW_TO_USE: "사용 방법",
    BUG: "오류/버그",
    ETC: "기타 문의",
};

// 신고 사유 색상 맵핑
const reasonColorMap: Record<ReportReason, string> = {
    [ReportReason.POLITICS]: "bg-red-100 text-red-800",
    [ReportReason.HATE]: "bg-yellow-100 text-yellow-800",
    [ReportReason.DEFAMATION]: "bg-blue-100 text-blue-800",
    [ReportReason.PROFANITY]: "bg-purple-100 text-purple-800",
};

// 신고 사유 라벨 맵핑
const ReportReasonLabelMap: Record<ReportReason, string> = {
    POLITICS: "정치",
    HATE: "혐오",
    DEFAMATION: "비방",
    PROFANITY: "욕설",
};

export interface LogComponentProps<C extends Category = Category> {
    data?: PagingResponse<CategoryDataMap[C]>;
    category: C;
    setCategory: (C) => void;
    setPage: (pageNum: number) => void;
}

export default function LogComponent({data, category, setCategory, setPage}: LogComponentProps) {
    // 필터 토글
    const toggleFilter = (label: Category) => {
        setCategory(label);
    }

    // 네비게이션
    const navigate = useNavigate();

    return (
        <div className="p-4">
            {/* 헤더 */}
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-bold text-gray-800 border-b-2 border-gray-300 pb-1">
                    📬 요청 사항
                </h4>
                <button className="flex items-center gap-1 px-3 py-1.5 border rounded text-sm hover:bg-gray-100">
                    <FontAwesomeIcon icon={faDownload} style={{ width: '15px', height: '15px' }} />
                    Export
                </button>
            </div>

            {/* 토글 필터 */}
            <div className="mb-3 flex gap-2">
                {(['문의', '신고'] as const).map((label) => (
                    <button
                        key={label}
                        onClick={() => {
                            toggleFilter(label);
                            setPage(0);
                        }}
                        className={`flex-1 py-2 text-sm font-semibold rounded-lg border transition-all duration-300 shadow-sm
                            ${category.includes(label)
                            ? "bg-blue-200 text-blue-900 border-blue-300 shadow-blue-300"
                            : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-blue-50 hover:text-blue-700"}`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* 문의 리스트 또는 신고 리스트 */}
            <div className="activity-timeline space-y-4">
                {data?.content.map((item, idx) => {
                    const isInquiry = category === "문의";

                    return (
                        <div className="bg-white rounded-lg shadow-md p-3 transition-transform duration-300 hover:scale-[1.008] hover:shadow-lg"
                             key={idx}
                        >
                            {isInquiry ? (
                                <div className="flex gap-6"  onClick={() => navigate(`/admin/inquiries/${(item as AdminDashInquiryDTO).inquiryId}`)}>
                                    {/* 좌측 아이콘 */}
                                    <div className="bg-blue-100 text-blue-600 w-12 h-12 flex items-center justify-center rounded-full flex-shrink-0">
                                        <FontAwesomeIcon icon={faQuestionCircle} className="text-xl" />
                                    </div>

                                    {/* 우측 콘텐츠 */}
                                    <div className="flex-grow space-y-1.5">
                                        {/* 상단: 유형 + 상태 + 등록일 */}
                                        <div className="flex justify-between items-start">
                                            {/* 유형 + 상태 */}
                                            <div className="flex items-center gap-3">
                                                {/* 유형 */}
                                                <div className="flex items-center gap-1">
                                                    <span className="text-sm font-medium text-gray-700">유형:</span>
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded ${inquiryTypeColorMap[(item as AdminDashInquiryDTO).type]}`}>
                                                        {inquiryTypeLabelMap[(item as AdminDashInquiryDTO).type]}
                                                    </span>
                                                </div>

                                                {/* 상태 */}
                                                <div className="flex items-center gap-1">
                                                    <span className="text-sm font-medium text-gray-700">상태:</span>
                                                    <span
                                                        className={`px-2 py-1 text-xs font-semibold rounded ${
                                                            (item as AdminDashInquiryDTO).status === "PENDING"
                                                                ? "bg-gray-200 text-gray-700"
                                                                : "bg-emerald-100 text-emerald-700"
                                                        }`}
                                                    >
                                                        {(item as AdminDashInquiryDTO).status === "PENDING" ? "대기중" : "답변완료"}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* 등록일 */}
                                            <span className="text-sm text-gray-500 whitespace-nowrap">
                                                {new Date((item as AdminDashInquiryDTO).regDate).toLocaleDateString("ko-KR", {
                                                    year: "numeric",
                                                    month: "2-digit",
                                                    day: "2-digit",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    hour12: false,
                                                })}
                                            </span>
                                        </div>

                                        {/* 작성자 */}
                                        <div>
                                            <span className="text-sm text-gray-700">
                                                작성자: {(item as AdminDashInquiryDTO).nickname}
                                            </span>
                                        </div>

                                        {/* 내용 */}
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            내용: {(item as AdminDashInquiryDTO).content}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex gap-6" onClick={() => navigate(`/admin/reports/${(item as AdminDashReportDTO).reviewReportId}`)}>
                                    {/* 좌측 아이콘 */}
                                    <div className="bg-yellow-100 text-yellow-600 w-12 h-12 flex items-center justify-center rounded-full flex-shrink-0">
                                        <FontAwesomeIcon icon={faFlag} className="text-xl" />
                                    </div>

                                    {/* 우측 콘텐츠 */}
                                    <div className="flex-grow space-y-1.5">
                                        {/* 상단: 신고 사유 + 등록일 */}
                                        <div className="flex justify-between items-start">
                                            {/* 신고 사유 */}
                                            <div className="flex items-center gap-1">
                                                <span className="text-sm font-medium text-gray-700">사유:</span>
                                                <span className={`px-2 py-1 text-xs font-semibold rounded ${reasonColorMap[(item as AdminDashReportDTO).reason]}`}>
                                                    {ReportReasonLabelMap[(item as AdminDashReportDTO).reason]}
                                                </span>
                                            </div>

                                            {/* 등록일 */}
                                            <span className="text-sm text-gray-500 whitespace-nowrap">
                                                {new Date((item as AdminDashReportDTO).regDate).toLocaleDateString("ko-KR", {
                                                    year: "numeric",
                                                    month: "2-digit",
                                                    day: "2-digit",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    hour12: false,
                                                })}
                                            </span>
                                        </div>

                                        {/* 신고된 리뷰 정보 */}
                                        <div>
                                            <span className="text-sm text-gray-700">
                                                용의자: {(item as AdminDashReportDTO).nickname}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}