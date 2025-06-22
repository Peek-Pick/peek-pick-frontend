import { useNavigate } from "react-router-dom";
import LoadingComponent from "~/components/common/loadingComponent";

export interface AdminReviewListProps {
    data?: AdminReviewSimpleDTO[];
    isLoading?: boolean;
    isError?: boolean;
    page: number;
    category?: string;
    keyword?: string;
    hidden?: boolean
}

export default function ListComponent({data, isLoading, isError, page, category, keyword, hidden}: AdminReviewListProps) {
    const navigate = useNavigate();

    if (isLoading)
        return <LoadingComponent isLoading />;
    if (isError || !data)
        return <div className="p-4 text-red-500">리뷰 목록 불러오기 실패</div>;

    const goDetail = (rid: number) => {
        navigate(`/admin/reviews/${rid}?page=${page}&keyword=${keyword}&category=${category}&hidden=${hidden}`, {
            state: { from: 'reviewList' }});
    };

    return (
        <div>
            <div className="overflow-x-auto bg-white shadow rounded-lg">
                <table className="min-w-full text-sm divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="w-1/9 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                            <th className="w-1/9 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상품번호</th>
                            <th className="w-2/9 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상품명</th>
                            <th className="w-1/9 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성자번호</th>
                            <th className="w-2/9 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성자명</th>
                            <th className="w-2/9 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성일</th>
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
                                    onClick={() => goDetail(review.reviewId)}
                                    className="hover:bg-gray-100 cursor-pointer text-sm text-gray-800"
                                >
                                    <td className="px-4 py-4 text-left">{review.reviewId}</td>
                                    <td className="px-4 py-4 text-left">{review.productId}</td>
                                    <td className="px-4 py-4 text-left">{review.name}</td>
                                    <td className="px-4 py-4 text-left">{review.userId}</td>
                                    <td className="px-4 py-4 text-left">{review.nickname}</td>
                                    <td className="px-4 py-4 text-left">{new Date(review.regDate).toLocaleString('ko-KR', {
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