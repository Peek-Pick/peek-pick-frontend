import { useMutation, useQueryClient} from "@tanstack/react-query";
import { toggleReview } from "~/api/reviews/reviewAPI";
import { useReviewReport } from "~/hooks/reviews/useReviewReport";
import { Rating20 } from "~/components/reviews/rating/rating"
import { ReviewLoading } from "~/util/loading/reviewLoading";
import { useLikeClick } from "~/hooks/reviews/useLikeClick";
import FloatingHearts from "~/components/reviews/effect/floatingHearts";

export interface ReviewProps {
    review?: ReviewDetailDTO;
    isLoading: boolean;
    isError: boolean;
}

export default function DetailComponent({review, isLoading, isError }: ReviewProps) {
    if (isLoading)
        return <ReviewLoading />;
    if (isError || !review) {
        return (
            <p className="text-center p-4 text-red-500 text-base sm:text-lg">
                리뷰 정보를 불러오지 못했습니다
            </p>
        );
    }

    // 쿼리 클라이언트
    const queryClient = useQueryClient();

    // 리뷰 신고 모달
    const { openReportModal } = useReviewReport(review.reviewId);

    // 리뷰 좋아요
    const toggleLikeMutation = useMutation({
        mutationFn: (reviewId: number) => toggleReview(reviewId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["review", review.reviewId]});
        },
        onError: (error) => {
            console.error("toggleLikeMutation failed: ", error);
        },
    });

    const {handleLikeClick, containerRef, hearts} = useLikeClick(toggleLikeMutation.mutate, review);

    return (
        <div>
            <section className="relative" ref={containerRef}>
                <div className="w-full max-w-7xl md:px-5 lg-6 mx-auto">
                    <div className="w-full">
                        <div className="bg-white rounded-md p-5 shadow-md mb-2">
                            {/* 작성자 정보와 작성일*/}
                            <div className="flex sm:items-center flex-col min-[400px]:flex-row justify-between gap-4 mb-2">
                                <div className="flex items-center gap-3">
                                    <img src="/default.png" alt="profile image"
                                         className="w-14 h-14 rounded-full object-cover"/>
                                    <h6 className="font-semibold text-md sm:text-base leading-2 text-gray-600">{review.nickname ?? "테스트"}</h6>
                                </div>
                                <p className="font-normal text-sm sm:text-sm leading-8 text-gray-400">작성일자 {new Date(review.regDate).toLocaleDateString()}</p>
                            </div>

                            {/* 별점 */}
                            <div className="flex items-center gap-2 mb-4">
                                {Array.from({length: 5}).map((_, i) => (
                                    <Rating20 key={i} filled={i < review.score}/>
                                ))}
                            </div>

                            {/* 리뷰 텍스트 */}
                            <p className="font-normal text-sm sm:text-sm leading-6 text-gray-600 max-xl:text-justify mb-2"
                                style={{ whiteSpace: 'pre-line' }}
                            >
                                {review.comment}
                            </p>

                            {/* 이미지 */}
                            {review.images?.length > 0 && (
                                <div
                                    className="flex flex-nowrap space-x-2 mb-4 overflow-x-auto no-scrollbar"
                                    style={{scrollbarWidth: "none", msOverflowStyle: "none"}}
                                >
                                    {review.images.map((img) => (
                                        <img
                                            key={img.imgId}
                                            src={`http://localhost/s_${img.imgUrl}`}
                                            alt="리뷰이미지"
                                            className="w-25 h-25 sm:w-25 sm:h-25 rounded-lg object-cover flex-shrink-0 border-1 border-gray-300 "
                                        />
                                    ))}
                                </div>
                            )}

                            {/* 태그 */}
                            {review.tagList?.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {review.tagList.map((tag) => (
                                        <span
                                            key={tag.tagId}
                                            className="bg-emerald-50 text-emerald-500 border border-emerald-200 text-sm sm:text-sm px-3 py-1 rounded-full"
                                        >
                                            #{tag.tagName}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* 좋아요 & 신고 */}
                            <div className="flex justify-between items-center  mt-3">
                                {/* 좋아요 버튼 */}
                                <button
                                    onClick={handleLikeClick}
                                    disabled={toggleLikeMutation.isPending}
                                    className={`flex items-center gap-1 px-2 py-1 rounded-full border font-medium text-sm sm:text-sm 
                                        ${review.isLiked
                                        ? "bg-red-50 text-red-500 border-red-200"
                                        : "bg-gray-100 text-gray-500 border-gray-200"} 
                                        hover:shadow-sm transition-colors duration-200`}
                                    >
                                    {review.isLiked ? '❤️' : '🤍'} 좋아요 {review.recommendCnt}
                                </button>

                                {/* 신고하기 버튼 */}
                                <button
                                    onClick={openReportModal}
                                    className="text-red-500 hover:text-red-600 transition text-sm sm:text-sm duration-200"
                                >
                                    신고하기
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* 하트 이펙트 - 반드시 relative 컨테이너 안에서 렌더 */}
                    {hearts.map((heart) => (
                        <FloatingHearts key={heart.id} x={heart.x} y={heart.y} />
                    ))}
                </div>
            </section>
        </div>
    );
}