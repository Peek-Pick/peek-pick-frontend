import { useNavigate } from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faComment } from '@fortawesome/free-solid-svg-icons';

export interface AdminReviewListProps {
    data: AdminReviewSimpleDTO[];
}

export default function ListComponent({data}: AdminReviewListProps) {
    const navigate = useNavigate();

    return (
        <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faComment} /> 상품 리뷰 관리
            </h3>

            <div className="overflow-x-auto bg-white shadow rounded-lg">
                <div className="overflow-x-auto bg-white shadow rounded-lg">
                    <table className="min-w-full text-sm divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="w-1/10 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                            <th className="w-1/10 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상품번호</th>
                            <th className="w-3/10 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상품명</th>
                            <th className="w-2/10 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성자</th>
                            <th className="w-2/10 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성일</th>
                            <th className="w-1/10 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상세</th>
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
                                    className="hover:bg-gray-100 cursor-pointer text-sm"
                                >
                                    <td className="px-4 py-4 text-left">{review.reviewId}</td>
                                    <td className="px-4 py-4 text-left">{review.productId}</td>
                                    <td className="px-4 py-4 text-left">{review.name}</td>
                                    <td className="px-4 py-4 text-left">{review.nickname}</td>
                                    <td className="px-4 py-4 text-left">{review.regDate.split('.')[0]}</td>
                                    <td className="px-4 py-4">
                                        <button
                                            onClick={() => navigate(`/admin/reviews/${review.reviewId}`)}
                                            className="text-blue-600 hover:underline text-sm"
                                        >
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