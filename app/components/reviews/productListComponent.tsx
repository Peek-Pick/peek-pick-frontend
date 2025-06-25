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
import {BackButton, FloatingActionButtons} from "~/util/button/FloatingActionButtons";
import {DotLottieReact} from "@lottiefiles/dotlottie-react";
import { Info } from "lucide-react";
import Swal from "sweetalert2";
import '~/util/swal/customAISwal.css'
import HiddenOrNot from "~/components/reviews/effect/hiddenOrNot";
import { translateReview } from "~/api/reviews/reviewTranslateAPI";
import { TranslatingLoader } from "~/components/reviews/effect/animatedTypingText";
import AISummarySection from "~/components/reviews/aiSummarySection";
import AverageRatingSection from "~/components/reviews/averageRatingSection";
import ImageModalComponent from "~/components/common/ImageModalComponent";

export interface ReviewListComponentProps {
    aiReview?: aiReviewDTO;
    productData?: ProductDetailDTO;
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

export default function ProductListComponent({aiReview, productData, productId, reviewList, fetchNextPage, hasNextPage, isFetchingNextPage,
                                                 isLoading, isError, sortType, setSortType, productLoading, productError}: ReviewListComponentProps) {
    if (isLoading || productLoading)
        return <ReviewLoading />;
    if (isError || productError|| !reviewList || !productData) {
        return (
            <p className="text-center p-4 text-red-500 text-base sm:text-lg">
                Failed to load review data.
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
                    fetchNextPage().then();
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

    // 정렬 기준 변경 핸들러
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
                        <AverageRatingSection
                            score={productData.score ?? 5}
                            reviewCount={productData.reviewCount}
                        />

                        {/* AI 리뷰 요약 */}
                        {aiReview &&
                            <AISummarySection aiReview={aiReview} />
                        }

                        {/* 정렬 탭 */}
                        <div
                            className="flex text-sm sm:text-sm justify-between items-center border-t border-b border-gray-200 py-2 mb-4">
                            <nav
                                className="tabs tabs-bordered"
                                aria-label="Sort Tabs"
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
                                    Latest
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
                                    Most Liked
                                </button>
                            </nav>
                        </div>

                        {/* 리뷰 카드 */}
                        {reviewList.map((review) => (
                            <ReviewItem key={`${sortType}-${review.reviewId}`} review={review} productId={productId}/>
                        ))}
                    </div>
                </div>
            </section>

            {/* 조이스틱 */}
            <FloatingActionButtons/>
            <BackButton/>

            {/* 무한 스크롤 디텍터 */}
            {hasNextPage && <div ref={bottomRef} className="h-1"/>}

            {/* 리뷰 로딩중 */}
            {isFetchingNextPage && (<ReviewInfiniteLoading/>)}
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
    const {openReportModal} = useReviewReport(review.reviewId);

    // 리뷰 번역 여부, 번역 텍스트, 로딩
    const [isTranslated, setIsTranslated] = useState(false);
    const [translatedText, setTranslatedText] = useState<string | null>(null);
    const [isLoadingTranslation, setIsLoadingTranslation] = useState(false);

    // 리뷰 이미지 확대 모달
    const [modalImage, setModalImage] = useState<string | null>(null);

    // 리뷰 좋아요
    const toggleLikeMutation = useMutation({
        mutationFn: (reviewId: number) => toggleReview(reviewId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["productReviews", productId]}).then();
        },
        onError: (error) => {
            console.error("toggleLikeMutation failed: ", error);
        },
    });

    // 좋아요 클릭 핸들러, 애니메이션
    const {handleLikeClick, containerRef, hearts} = useLikeClick(toggleLikeMutation.mutate, review);

    // 리뷰 번역 핸들러
    const handleTranslateClick = async () => {
        if (isTranslated) {
            // 번역된 상태라면 다시 원문 보기
            setIsTranslated(false);
            return;
        }

        try {
            setIsLoadingTranslation(true);
            const res = await translateReview(review.reviewId);
            setTranslatedText(res.data);
            setIsTranslated(true);
        } catch (err) {
            console.error("번역 실패", err);
        } finally {
            setIsLoadingTranslation(false);
        }
    };


    return (
        <div className="relative" ref={containerRef}>
            <div className="bg-white rounded-xl p-5 shadow-md mb-2">
                {/* 작성자 정보와 작성일*/}
                <div className="flex sm:items-center flex-col min-[400px]:flex-row justify-between gap-5 mb-3">
                    <div className="flex items-center justify-between gap-3">
                        {/* 왼쪽: 프로필 이미지 + 닉네임 */}
                        <div className="flex items-center gap-3">
                            <img
                                src={`http://localhost/${review.profileImageUrl}`}
                                alt="profile image"
                                className="w-14 h-14 rounded-full object-cover"
                            />
                            <h6 className="font-semibold text-md leading-8 text-gray-600">
                                {review.nickname ?? "User"}
                            </h6>
                        </div>

                        {/* 오른쪽 끝: 번역 버튼 */}
                        <button
                            onClick={handleTranslateClick}
                            disabled={isLoadingTranslation}
                            className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full transition-all shadow-sm bg-blue-50 text-blue-500 hover:bg-blue-100`}>
                            <span>{isTranslated ? "↩" : "🌐"}</span>
                            <span>{isTranslated ? "Original" : "Translate"}</span>
                        </button>
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
                        {new Date(review.regDate).toLocaleDateString()}
                    </p>
                </div>

                {/* 리뷰 텍스트 */}
                <div className="relative mb-4">
                    <p className={`text-sm text-gray-700 whitespace-pre-line transition-opacity duration-300 ${
                            isLoadingTranslation ? "opacity-20 blur-[1px]" : "opacity-100"
                        }`}
                    >
                        {isTranslated ? translatedText : review.comment}
                    </p>

                    {/* 번역 중 로딩 오버레이 */}
                    {isLoadingTranslation && (
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                            <TranslatingLoader />
                        </div>
                    )}
                </div>

                {/* 이미지 */}
                {review.images?.length > 0 && (
                    <div
                        className="flex flex-nowrap space-x-2 mb-4 overflow-x-auto no-scrollbar"
                        style={{scrollbarWidth: "none", msOverflowStyle: "none"}}
                    >
                        {review.images.map((img) => (
                            <img
                                key={img.imgId}
                                src={`http://localhost/reviews/s_${img.imgUrl}`}
                                alt="Review Image"
                                onClick={() => setModalImage(`http://localhost/reviews/${img.imgUrl}`) }
                                className="w-25 h-25 sm:w-25 sm:h-25 rounded-lg object-cover flex-shrink-0 border-1 border-gray-300 "
                            />
                        ))}
                    </div>
                )}

                {/* 리뷰 이미지 확대 모달 */}
                {modalImage && (
                    <ImageModalComponent
                        src={modalImage}
                        onClose={() => setModalImage(null)}
                    />
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
                        {review.isLiked ? '❤️' : '🤍'} Like {review.recommendCnt}
                    </button>

                    {/* 신고하기 버튼 */}
                    <button
                        onClick={openReportModal}
                        className="text-red-500 hover:text-red-600 transition text-sm sm:text-sm duration-200"
                    >
                        Report
                    </button>

                    {/* 하트 이펙트 - 반드시 relative 컨테이너 안에서 렌더 */}
                    {hearts.map((heart) => (
                        <FloatingHearts key={heart.id} x={heart.x} y={heart.y}/>
                    ))}
                </div>
            </div>
            {/* 리뷰 볼래 말래 */}
            {review.isHidden && !showHidden && (
                <HiddenOrNot onReveal={() => setShowHidden(true)} />
            )}
        </div>
    );
}