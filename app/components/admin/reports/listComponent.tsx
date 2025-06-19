import { useNavigate } from "react-router-dom";
import  {ReportReason, ReportReasonDescriptions} from "~/hooks/reviews/useReviewReport";
import LoadingComponent from "~/components/common/loadingComponent";

export interface AdminReportListProps {
    data?: AdminReviewReportDTO[];
    isLoading?: boolean;
    isError?: boolean;
    page: number;
    category?: string;
    keyword?: string;
    hidden?: boolean
}

export default function ListComponent({data, isLoading, isError, page, category, keyword, hidden}: AdminReportListProps) {
    const navigate = useNavigate();

    const reasonColorMap: Record<ReportReason, string> = {
        [ReportReason.POLITICS]: "bg-red-100 text-red-800",
        [ReportReason.HATE]: "bg-yellow-100 text-yellow-800",
        [ReportReason.DEFAMATION]: "bg-blue-100 text-blue-800",
        [ReportReason.PROFANITY]: "bg-purple-100 text-purple-800",
    };

    if (isLoading)
        return <LoadingComponent isLoading />;
    if (isError || !data)
        return <div className="p-4 text-red-500">신고 목록 불러오기 실패</div>;

    const goDetail = (rid: number) => {
        navigate(`/admin/reviews/${rid}?page=${page}&keyword=${keyword}&category=${category}&hidden=${hidden}`, {
            state: { from: 'reportList' }});
    };

    return (
        <div>
            <div className="overflow-x-auto bg-white shadow rounded-lg">
                <table className="min-w-full text-sm divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="w-1/8 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                            <th className="w-1/8 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">리뷰번호</th>
                            <th className="w-1/8 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성자번호</th>
                            <th className="w-1/8 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">신고자번호</th>
                            <th className="w-2/8 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">신고사유</th>
                            <th className="w-2/8 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">신고일</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-3 text-center text-gray-500">
                                    등록된 리뷰가 없습니다.
                                </td>
                            </tr>
                        ) : (
                            data.map((report) => (
                                <tr
                                    key={report.reviewReportId}
                                    onClick={() => goDetail(report.reviewId)}
                                    className="hover:bg-gray-100 cursor-pointer text-sm text-gray-800"
                                >
                                    <td className="px-4 py-4 text-left">{report.reviewReportId}</td>
                                    <td className="px-4 py-4 text-left">{report.reviewId}</td>
                                    <td className="px-4 py-4 text-left">{report.reviewerId}</td>
                                    <td className="px-4 py-4 text-left">{report.userId}</td>
                                    <td className="px-4 py-4 text-left">
                                        <span className={`px-2 py-1.5 rounded-md text-xs font-medium ${
                                            reasonColorMap[report.reason as ReportReason] || "bg-gray-100 text-gray-800"}`}
                                        >
                                            {ReportReasonDescriptions[report.reason as ReportReason] || report.reason}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 text-left">{new Date(report.regDate).toLocaleString('ko-KR', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false
                                    })}</td>
                                </tr>
                            ))
                        )}
                        </tbody>
                </table>
            </div>
        </div>
    );
}