import {Rating20} from "~/components/reviews/rating/rating";
import {useNavigate} from "react-router-dom";

interface reviewsProps {
    reviewCount: number;
    reviewList: ReviewSimpleDTO[];
    isLoading: boolean;
    isError: boolean;
}

function AuDetailReviewsComponent({ reviewCount, reviewList, isLoading, isError }:reviewsProps) {

    const navigate = useNavigate();

    if (isLoading)
        return <p className="text-center p-4 text-base sm:text-lg">로딩 중입니다</p>;
    if (isError)
        return
    <p className="text-center p-4 text-red-500 text-base sm:text-lg">리뷰를 불러오지 못했습니다</p>;

    return (
        <div className="flex flex-col h-full">
            <div className="mb-4 shrink-0 border-b border-gray-200 py-4">
                <h2 className="text-lg font-bold text-gray-700 dark:text-white">Reviews</h2>
            </div>

            <div className=" border-b border-gray-200 py-4 mb-2 shrink-0">
                누적 리뷰 <span className="text-red-500 c">{reviewCount}</span>건
            </div>

            {/* 스크롤이 필요한 리뷰 목록 영역 */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {reviewList.map((review) => (
                    <div
                        key={review.reviewId}
                        className="bg-white rounded-md p-6 shadow-md"
                    >
                        {/* 상품 정보 */}
                        <div className="flex sm:items-center flex-col min-[400px]:flex-row justify-between gap-5 mb-3">
                            <div className="flex items-center gap-3">
                                <img src={`http://localhost${review.imageThumbUrl}`}
                                     className="w-20 h-20 rounded-lg object-cover border-2 border-gray-100" alt={"상품정보"}/>
                                <h6 className="font-semibold text-md leading-8 text-gray-600">{review.name}</h6>
                            </div>
                        </div>

                        {/* 별점과 작성일 */}
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Rating20 key={i} filled={i < review.score} />
                                ))}
                            </div>
                            <p className="font-normal text-sm sm:text-sm text-gray-400">
                                작성일자 {new Date(review.regDate).toLocaleDateString()}
                            </p>
                        </div>

                        {/* 리뷰 텍스트 */}
                        <p className="line-clamp-4 font-normal text-base sm:text-base leading-7.5 text-gray-600 max-xl:text-justify mb-2">{review.comment}</p>

                        <div className="flex flex-col-2 sm:flex-row items-stretch justify-end gap-4 mt-4 w-full">

                            {/* 리뷰 상세보기 버튼 */}
                            <button type="button"  onClick={() => navigate(`/admin/reviews/${review.reviewId}`)}
                                    className="w-full sm:flex-1 px-4 py-2 text-sm sm:text-sm rounded-lg bg-blue-100 text-blue-800 cursor-pointer font-medium text-center transition-all duration-300 hover:bg-blue-200 hover:text-blue-800 min-w-0"
                            >
                                리뷰 상세보기
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AuDetailReviewsComponent;