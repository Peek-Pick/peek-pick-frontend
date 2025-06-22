import type { FetchNextPageOptions, InfiniteQueryObserverResult } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Rating20 } from "~/components/reviews/rating/rating"
import { ReviewLoading, ReviewInfiniteLoading } from "~/util/loading/reviewLoading";
import { BackParamButton, FloatingActionButtons } from "~/util/button/FloatingActionButtons";
import { Star } from "lucide-react";

export interface ReviewListComponentProps {
    reviewCount: number;
    reviewList: ReviewSimpleDTO[];
    fetchNextPage: (options?: FetchNextPageOptions) => Promise<InfiniteQueryObserverResult<any, Error>>;
    hasNextPage: boolean | undefined;
    isFetchingNextPage: boolean;
    isLoading: boolean;
    isError: boolean;
}

export default function UserListComponent({reviewCount, reviewList, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError}
                                          : ReviewListComponentProps) {
    if (isLoading)
        return <ReviewLoading />;
    if (isError)
        return <p className="text-center p-4 text-red-500 text-base sm:text-lg">Failed to load review data.</p>;

    const navigate = useNavigate()

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

    return (
        <div>
            <section className="relative">
                <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow px-4 pt-4 pb-6 relative space-y-4">
                    <div className="w-full">
                        {/* 정렬 탭 */}
                        <div className="flex justify-between items-center mb-4 mt-1.5">
                            <h2 className="flex items-center gap-1 text-xl font-bold  select-none leading-none">
                                <span className="leading-none text-black ml-1.5">Total Reviews: </span>
                                <span className="text-yellow-500 font-normal ml-2">{reviewCount}</span>
                            </h2>
                        </div>

                        {/* 리뷰 카드 */}
                        <ul className="flex flex-col gap-5">
                        {reviewList.map((review) => (
                            <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer"
                                 key={review.reviewId}>
                                {/* 상품 정보 */}
                                <div className="flex sm:items-center flex-col min-[400px]:flex-row justify-between gap-5 mb-3">
                                    <div className="flex items-center gap-3">
                                        <img src={`http://localhost${review.imageThumbUrl}`}
                                             className="w-20 h-20 rounded-lg object-cover border-2 border-gray-100" alt={"Product Info"}/>
                                        <h6 className="font-semibold text-base leading-8 text-gray-600">{review.name}</h6>
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
                                <p className="line-clamp-5 font-normal text-sm sm:text-sm leading-6 text-gray-600 max-xl:text-justify mb-1"
                                   style={{ whiteSpace: 'pre-line' }}
                                >
                                    {review.comment}
                                </p>

                                <div className="flex flex-col-2 sm:flex-row items-stretch justify-end gap-4 mt-4 w-full">
                                    {/* 리뷰 수정하기 버튼 */}
                                    <button type="button" onClick={() => navigate(`/reviews/modify/${review.reviewId}`)}
                                            className="w-full sm:flex-1 px-4 py-2 text-sm sm:text-sm rounded-lg bg-emerald-50 text-emerald-600 cursor-pointer font-medium text-center transition-all duration-300 hover:bg-emerald-100 hover:text-emerald-700 min-w-0"
                                    >
                                        Edit Review
                                    </button>

                                    {/* 리뷰 상세보기 버튼 */}
                                    <button type="button"  onClick={() => navigate(`/reviews/${review.reviewId}`)}
                                            className="w-full sm:flex-1 px-4 py-2 text-sm sm:text-sm rounded-lg bg-emerald-50 text-emerald-600 cursor-pointer font-medium text-center transition-all duration-300 hover:bg-emerald-100 hover:text-emerald-700 min-w-0"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                        </ul>

                        {/* 조이스틱 */}
                        <FloatingActionButtons />
                        <BackParamButton where={"/mypage"}/>

                        {/* 무한 스크롤 디텍터 */}
                        {hasNextPage && <div ref={bottomRef} className="h-1"/>}

                        {/* 리뷰 로딩중 */}
                        {isFetchingNextPage && (<ReviewInfiniteLoading />)}
                    </div>
                </div>
            </section>
        </div>
    );
}