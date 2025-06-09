import { useNavigate } from "react-router-dom";

export interface AdminReviewListProps {
    data: AdminReviewSimpleDTO[];
    page: number;
    category?: string;
    keyword?: string;
    hidden?: boolean
}

export default function ListComponent({data, page, category, keyword, hidden}: AdminReviewListProps) {
    const navigate = useNavigate();

    return (
        <div>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    <table className="min-w-full text-sm divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="w-1/10 px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">#</th>
                            <th className="w-1/10 px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">상품번호</th>
                            <th className="w-2/10 px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">상품명</th>
                            <th className="w-1/10 px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">작성자번호</th>
                            <th className="w-2/10 px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">작성자명</th>
                            <th className="w-2/10 px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">작성일</th>
                            <th className="w-1/10 px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">상세</th>
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
                            data.map((review) => (
                                <tr
                                    key={review.reviewId}
                                    className="hover:bg-gray-100 cursor-pointer text-sm text-gray-800"
                                >
                                    <td className="px-4 py-3.5 text-left">{review.reviewId}</td>
                                    <td className="px-4 py-3.5 text-left">{review.productId}</td>
                                    <td className="px-4 py-3.5 text-left">{review.name}</td>
                                    <td className="px-4 py-3.5 text-left">{review.userId}</td>
                                    <td className="px-4 py-3.5 text-left">{review.nickname}</td>
                                    <td className="px-4 py-3.5 text-left">{review.regDate.split('.')[0]}</td>
                                    <td className="px-4 py-3.5">
                                        <button
                                            onClick={() =>
                                                navigate(`/admin/reviews/${review.reviewId}?from=reviewList&page=${page}&keyword=${keyword}&category=${category}&hidden=${hidden}`, {
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