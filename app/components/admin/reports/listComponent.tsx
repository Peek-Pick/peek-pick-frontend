import { useNavigate } from "react-router-dom";
import  {ReportReason, ReportReasonDescriptions} from "~/hooks/useReviewReport";

export interface AdminReportListProps {
    data: AdminReviewReportDTO[];
    page: number;
    category?: string;
    keyword?: string;
    hidden?: boolean
}

export default function ListComponent({data, page, category, keyword, hidden}: AdminReportListProps) {
    const navigate = useNavigate();

    const reasonColorMap: Record<ReportReason, string> = {
        [ReportReason.POLITICS]: "bg-red-100 text-red-800",
        [ReportReason.HATE]: "bg-yellow-100 text-yellow-800",
        [ReportReason.DEFAMATION]: "bg-blue-100 text-blue-800",
        [ReportReason.PROFANITY]: "bg-purple-100 text-purple-800",
    };

    return (
        <div>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    <table className="min-w-full text-sm divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="w-1/9 px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">#</th>
                            <th className="w-1/9 px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">리뷰번호</th>
                            <th className="w-1/9 px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">작성자번호</th>
                            <th className="w-1/9 px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">신고자번호</th>
                            <th className="w-1/9 px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">신고사유</th>
                            <th className="w-2/9 px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">신고일</th>
                            <th className="w-1/9 px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">리뷰상세</th>
                            <th className="w-1/9 px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">작성자상세</th>
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
                                    className="hover:bg-gray-100 cursor-pointer text-sm text-gray-800"
                                >
                                    <td className="px-4 py-3.5 text-left">{report.reviewReportId}</td>
                                    <td className="px-4 py-3.5 text-left">{report.reviewId}</td>
                                    <td className="px-4 py-3.5 text-left">{report.reviewerId}</td>
                                    <td className="px-4 py-3.5 text-left">{report.userId}</td>
                                    <td className="px-4 py-3.5 text-left">
                                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                                            reasonColorMap[report.reason as ReportReason] || "bg-gray-100 text-gray-800"}`}
                                        >
                                            {ReportReasonDescriptions[report.reason as ReportReason] || report.reason}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 text-left">{report.regDate.split('.')[0]}</td>
                                    <td className="px-4 py-3.5">
                                        <button
                                            onClick={() =>
                                                navigate(`/admin/reviews/${report.reviewId}?from=reportList&page=${page}&keyword=${keyword}&category=${category}&hidden=${hidden}`, {
                                                    state: { from: 'reportList' }
                                                })}
                                            className="text-blue-600 hover:underline text-xs">
                                            상세보기
                                        </button>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <button
                                            onClick={() =>
                                                navigate(`/admin/users/${report.userId}`, {
                                                    state: { from: 'reportList' }
                                                })}
                                            className="text-blue-600 hover:underline text-xs">
                                            상세보기
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}