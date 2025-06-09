import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProductPreviews, toggleReview } from "~/api/reviews/reviewAPI";
import { useState, useEffect } from "react";
import { getProductIdByBarcode} from "~/api/reviews/reviewAPI"
import { useReviewReport } from "~/hooks/useReviewReport";
import { Rating20 } from "~/components/reviews/rating/rating"
import { useNavigate } from "react-router-dom";

interface PreviewProps {
    barcode: string;
    reviewNum: number;
}

export default function PreviewComponent({ barcode, reviewNum }: PreviewProps) {
    const navigate = useNavigate()

    const [productId, setProductId] = useState<number | null>(null);

    // barcode로 productId 받아오기
    useEffect(() => {
        getProductIdByBarcode(barcode)
            .then((response) => {
                setProductId(Number(response.data));
            });
    }, [barcode]);

    // 상품별 리뷰 3개 받아오기
    const { data, isLoading, isError } = useQuery<ReviewDetailDTO[]>({
        queryKey: ["previews", productId],
        queryFn: () => getProductPreviews(productId!),
        enabled: Boolean(productId)
    });

    if (isLoading)
        return <p className="text-center p-4 text-base sm:text-lg">로딩 중입니다</p>;
    if (isError)
        return<p className="text-center p-4 text-red-500 text-base sm:text-lg">리뷰를 불러오지 못했습니다</p>
    if (!data || data.length === 0)
        return <p className="text-center p-4 text-gray-500 text-base sm:text-lg">아직 작성된 리뷰가 없습니다.</p>;

    return (
        <div>
            <section className="py-24 relative">
                <div className="w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto">
                    <div className="w-full">
                        {/* 헤더: 타이틀 + 링크 */}
                        <div className="flex justify-between items-center border-t border-b border-gray-200 py-4 mb-2">
                           <span>
                                누적 리뷰 <span className="text-red-500 font-semibold">{reviewNum}</span>건
                            </span>
                            <button
                                onClick={() => navigate(`/reviews/product/${barcode}`)}
                                className="text-base text-gray-500 hover:text-gray-700 hover:font-semibold transition"
                            >
                                전체보기 &gt;
                            </button>
                        </div>

                        {/* 리뷰 카드 */}
                        {data.map((review) => (
                            <ReviewItem key={review.reviewId} review={review} productId={productId!} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

interface ReviewItemProps {
    review: ReviewDetailDTO;
    productId: number;
}

function ReviewItem({ review, productId }: ReviewItemProps) {
    const queryClient = useQueryClient();

    // 리뷰 신고 모달
    const { openReportModal } = useReviewReport(review.reviewId);

    // 숨김 리뷰 오버레이
    const [showHidden, setShowHidden] = useState(false);

    // 리뷰 좋아요
    const toggleLikeMutation = useMutation({
        mutationFn: (reviewId: number) => toggleReview(reviewId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["previews", productId]});
        },
        onError: (error) => {
            console.error("toggleLikeMutation failed: ", error);
        },
    });

    return (
        <div className="relative">
        <div
            className={`bg-white rounded-md p-6 shadow-md mb-2 transition-opacity duration-200 ${
                review.isHidden && !showHidden ? "opacity-50" : "opacity-100"
            }`}
        >
            {/* 작성자 정보와 작성일*/}
            <div className="flex sm:items-center flex-col min-[400px]:flex-row justify-between gap-5 mb-3">
                <div className="flex items-center gap-3">
                    <img src={review.profileImageUrl ? `http://localhost/${review.profileImageUrl}` : "/default.png"}
                         alt="profile image" className="w-14 h-14 rounded-full object-cover"/>
                    <h6 className="font-semibold text-md leading-8 text-gray-600">{review.nickname ?? "테스트"}</h6>
                </div>
                <div className="flex items-center gap-3">
                    <p className="font-normal text-sm sm:text-sm text-gray-400">작성일자 {new Date(review.regDate).toLocaleDateString()}</p>
                </div>
            </div>

            {/* 별점 */}
            <div className="flex items-center gap-2 mb-4">
                {Array.from({length: 5}).map((_, i) => (
                    <Rating20 key={i} filled={i < review.score}/>
                ))}
            </div>

            {/* 리뷰 텍스트 */}
            <p className="font-normal text-base sm:text-base leading-7.5 text-gray-500 max-xl:text-justify mb-3">{review.comment}</p>

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
                            className="w-25 h-25 sm:w-25 sm:h-25 rounded-lg object-cover flex-shrink-0 border-1 border-gray-100 "
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
            <div className="flex justify-between items-center text-sm sm:text-base mt-3">
                {/* 좋아요 버튼 */}
                <button
                    onClick={() => toggleLikeMutation.mutate(review.reviewId)}
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
            {review.isHidden && !showHidden && (
                <div className="absolute inset-0 flex flex-col items-center justify-center rounded-md z-10">
                    {/* 반투명 + 블러 효과 */}
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-md"></div>
                    <div className="relative flex flex-col items-center">
                        <p className="mb-3 text-gray-100 font-medium">신고된 리뷰입니다.</p>
                        <button
                            onClick={() => setShowHidden(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                        >
                            열람하기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}