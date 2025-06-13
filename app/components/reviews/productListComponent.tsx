import {type FetchNextPageOptions, type InfiniteQueryObserverResult, useMutation, useQueryClient} from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toggleReview } from "~/api/reviews/reviewAPI";
import type {ProductDetailDTO} from "~/types/products";
import { useReviewReport } from "~/hooks/reviews/useReviewReport";
import AverageRating from "~/components/reviews/rating/averageRating";
import { Rating20 } from "~/components/reviews/rating/rating"
import {ReviewLoading, ReviewInfiniteLoading} from "~/util/loading/reviewLoading";
import { useLikeClick } from "~/hooks/reviews/useLikeClick";
import FloatingHearts from "~/components/reviews/effect/floatingHearts";

export interface ReviewListComponentProps {
    productData?: ProductDetailDTO
    productId: number;
    reviewList: ReviewDetailDTO[];
    fetchNextPage: (options?: FetchNextPageOptions) => Promise<InfiniteQueryObserverResult<any, Error>>;
    hasNextPage: boolean | undefined;
    isFetchingNextPage: boolean;
    isLoading: boolean;
    isError: boolean;
    sortType: "latest" | "likes";
    setSortType: React.Dispatch<React.SetStateAction<"latest" | "likes">>;
    productLoading: boolean;
    productError: boolean

}

export default function ProductListComponent({productData, productId, reviewList, fetchNextPage, hasNextPage, isFetchingNextPage,
                                                 isLoading, isError, sortType, setSortType, productLoading, productError}: ReviewListComponentProps) {
    if (isLoading || productLoading)
        return <ReviewLoading />;
    if (isError || productError|| !reviewList || !productData) {
        return (
            <p className="text-center p-4 text-red-500 text-base sm:text-lg">
                리뷰 정보를 불러오지 못했습니다
            </p>
        );
    }

    const queryClient = useQueryClient();

    // 무한 스크롤 감지 요소
    const bottomRef = useRef<HTMLDivElement | null>(null);

    // 무한 스크롤 다음 페이지 호출
    useEffect(() => {
        if (!bottomRef.current || !hasNextPage) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            {
                rootMargin: "100px",
                threshold: 1.0,
            }
        );

        observer.observe(bottomRef.current);

        return () => observer.disconnect();
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    const handleSortChange = (newSortType) => {
        if (sortType !== newSortType) {
            queryClient.removeQueries({ queryKey: ['productReviews', productId, sortType] });
            setSortType(newSortType);
        }
    };


    return (
        <div>
            <section className="relative">
                <div className="w-full max-w-7xl md:px-5 lg-6 mx-auto">
                    <div className="w-full">
                        {/* 상품 평균 별점 */}
                        <div
                            className="grid grid-cols-1 xl:grid-cols-1 gap-11 pb-5 border-b border-gray-100 max-xl:max-w-2xl max-xl:mx-auto">
                            <div className="p-6 bg-yellow-50 rounded-3xl flex items-center justify-center flex-col">
                                <h2 className="font-manrope font-bold text-4xl text-amber-400 mb-6">{productData?.score}</h2>
                                <AverageRating score={productData?.score ?? 5}/>
                                <p className="font-semibold text-lg leading-8 text-gray-800 text-center">{productData?.reviewCount} Ratings</p>
                            </div>
                        </div>

                        {/* 정렬 탭 */}
                        <div className="flex text-sm sm:text-sm justify-between items-center border-t border-b border-gray-200 py-2 mb-4">
                            <nav
                                className="tabs tabs-bordered"
                                aria-label="정렬 탭"
                                role="tablist"
                                aria-orientation="horizontal"
                            >
                                <button
                                    type="button"
                                    className={`tab px-2 py-2 rounded-md hover:font-semibold transition-all duration-200 ${
                                        sortType === "latest" ? "tab-active text-indigo-600 font-bold" : ""
                                    }`}
                                    onClick={() => handleSortChange("latest")}
                                    role="tab"
                                    aria-selected={sortType === "latest"}
                                >
                                    최신순
                                </button>
                                <button
                                    type="button"
                                    className={`tab px-2 py-2 rounded-md hover:font-semibold transition-all duration-200 ${
                                        sortType === "likes" ? "tab-active text-indigo-600 font-bold" : ""
                                    }`}
                                    onClick={() => handleSortChange("likes")}
                                    role="tab"
                                    aria-selected={sortType === "likes"}
                                >
                                    좋아요순
                                </button>
                            </nav>
                        </div>

                        {/* 리뷰 카드 */}
                        {reviewList.map((review) => (
                            <ReviewItem key={`${sortType}-${review.reviewId}`} review={review} productId={productId} />
                        ))}
                    </div>
                </div>
            </section>

            {/* 무한 스크롤 디텍터 */}
            {hasNextPage && <div ref={bottomRef} className="h-1"/>}

            {/* 리뷰 로딩중 */}
            {isFetchingNextPage && (<ReviewInfiniteLoading />)}
        </div>
    );
}

interface ReviewItemProps {
    review: ReviewDetailDTO;
    productId: number;
}

function ReviewItem({review, productId}: ReviewItemProps) {
    const queryClient = useQueryClient();

    // 숨김 리뷰 is_hidden
    const [showHidden, setShowHidden] = useState(false);

    // 리뷰 신고 모달
    const { openReportModal } = useReviewReport(review.reviewId);

    // 리뷰 좋아요
    const toggleLikeMutation = useMutation({
        mutationFn: (reviewId: number) => toggleReview(reviewId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["productReviews", productId]});
        },
        onError: (error) => {
            console.error("toggleLikeMutation failed: ", error);
        },
    });

    // 좋아요 클릭 핸들러, 애니메이션
    const {handleLikeClick, containerRef, hearts} = useLikeClick(toggleLikeMutation.mutate, review);

    return (
        <div className="relative" ref={containerRef}>
        <div className="bg-white rounded-md p-5 shadow-md mb-2">
            {/* 작성자 정보와 작성일*/}
            <div className="flex sm:items-center flex-col min-[400px]:flex-row justify-between gap-5 mb-3">
                <div className="flex items-center gap-3">
                    <img src={review.profileImageUrl ? `http://localhost/${review.profileImageUrl}` : "/default.png"}
                         alt="profile image" className="w-14 h-14 rounded-full object-cover"/>
                    <h6 className="font-semibold text-md leading-8 text-gray-600">{review.nickname ?? "테스트"}</h6>
                </div>
                <div className="flex items-center gap-3">
                    <p className="font-normal text-sm sm:text-sm leading-8 text-gray-400">작성일자 {new Date(review.regDate).toLocaleDateString()}</p>
                </div>
            </div>

            {/* 별점 */}
            <div className="flex items-center gap-2 mb-4">
                {Array.from({length: 5}).map((_, i) => (
                    <Rating20 key={i} filled={i < review.score}/>
                ))}
            </div>

            {/* 리뷰 텍스트 */}
            <p className="font-normal text-sm sm:text-sm leading-6 text-gray-600 max-xl:text-justify mb-3"
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
            <div className="flex justify-between items-center text-sm sm:text-base mt-3">
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

                {/* 하트 이펙트 - 반드시 relative 컨테이너 안에서 렌더 */}
                {hearts.map((heart) => (
                    <FloatingHearts key={heart.id} x={heart.x} y={heart.y} />
                ))}
            </div>
        </div>
            {/* 리뷰 볼래 말래 */}
            {review.isHidden && !showHidden && (
                <div className="absolute inset-0 flex flex-col items-center justify-center rounded-md z-10">
                    <div className="absolute inset-0 bg-yellow-100/50 backdrop-blur-md rounded-md border border-yellow-300 shadow-inner"></div>
                    <div className="relative flex flex-col items-center text-center px-4">
                        <span className="text-3xl mb-2">🙈</span>
                        <p className="mb-3 text-yellow-800 font-semibold">이 리뷰는 숨겨졌어요!</p>
                        <button
                            onClick={() => setShowHidden(true)}
                            className="px-4 py-2 font-semibold bg-yellow-400 text-white rounded-full hover:bg-yellow-500 transition-all shadow-md"
                        >
                            살짝 보기 👀
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}