import type {FetchNextPageOptions, InfiniteQueryObserverResult,} from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import {useNavigate} from "react-router-dom";

export interface ReviewListComponentProps {
    reviewList: ReviewSimpleDTO[];
    fetchNextPage: (options?: FetchNextPageOptions) => Promise<InfiniteQueryObserverResult<any, Error>>;
    hasNextPage: boolean | undefined;
    isFetchingNextPage: boolean;
    isLoading: boolean;
    isError: boolean;
}

export default function UserListComponent({reviewList, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError}
                                          : ReviewListComponentProps) {
    const navigate = useNavigate()

    const bottomRef = useRef<HTMLDivElement | null>(null);

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

    if (isLoading)
        return <p className="text-center p-4 text-base sm:text-lg">로딩 중입니다</p>;
    if (isError)
        return
            <p className="text-center p-4 text-red-500 text-base sm:text-lg">리뷰를 불러오지 못했습니다</p>;

    return (
        <div className="w-full min-h-screen bg-gray-50 flex justify-center p-4">
            <div className="w-full max-w-md sm:max-w-xl md:max-w-3xl space-y-4">
                {reviewList.map((review) => (
                    <div
                        key={`review-${review.review_id}`}
                        className="bg-white shadow-md rounded-lg p-4 space-y-2"
                    >
                        {/* 상품 정보 */}
                        <div className="flex items-center space-x-3">
                            <img
                                src={review.image_url || "/example.jpg"}
                                alt={review.name}
                                className="w-24 h-24 sm:w-24 sm:h-24 md:w-24 md:h-24 rounded-lg object-cover"
                            />
                            <div>
                                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                                    {review.name}
                                </h2>
                            </div>
                        </div>

                        {/* 리뷰 별점 + 작성일 */}
                        <div className="flex justify-between items-center text-xs sm:text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <span
                                        key={i}
                                        className={`text-lg ${
                                            i < review.score ? "text-yellow-400" : "text-gray-300"
                                        }`}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                            <span>{review.reg_date.slice(0, 10)}</span>
                        </div>

                        {/* 리뷰 텍스트 */}
                        <p className="whitespace-pre-wrap text-gray-800 text-sm sm:text-base line-clamp-2">
                            {review.comment}
                        </p>

                        {/* 리뷰 관리 버튼 */}
                        <div className="flex gap-2 pt-2">
                            <button
                                className="flex-1 text-center px-3 py-1.5 text-xs sm:text-sm border rounded hover:bg-gray-100 transition"
                                onClick={() =>
                                    navigate(`/reviews/modify/${review.review_id}`)
                                }
                            >
                                리뷰 수정
                            </button>
                            <button
                                className="flex-1 text-center px-3 py-1.5 text-xs sm:text-sm border rounded hover:bg-gray-100 transition"
                                onClick={() => navigate(`/reviews/${review.review_id}`)}
                            >
                                리뷰 보기
                            </button>
                        </div>
                    </div>
                ))}

                {/* 무한 스크롤 디텍터 */}
                {hasNextPage && <div ref={bottomRef} className="h-1" />}
                {isFetchingNextPage && (
                    <p className="text-center py-2 text-sm text-gray-600">
                        리뷰를 불러오는 중입니다...
                    </p>
                )}
                {!hasNextPage && (
                    <p className="text-center py-2 text-gray-400 text-sm">
                        마지막 리뷰입니다
                    </p>
                )}
            </div>
        </div>
    );
}