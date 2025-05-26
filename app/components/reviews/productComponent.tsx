import {type FetchNextPageOptions, type InfiniteQueryObserverResult, useMutation,} from "@tanstack/react-query";
import { useEffect, useRef } from "react";

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

    if (isLoading) return <p className="text-center p-4">로딩 중입니다</p>;
    if (isError) return <p className="text-center p-4 text-red-500">리뷰를 불러오지 못했습니다</p>;

    return (
        <div className="w-full min-h-screen bg-gray-50 p-4">
            <div className="max-w-md w-full mx-auto bg-white shadow rounded-lg space-y-6 p-4">
                {/* 리뷰 리스트 */}
                <div className="space-y-6">
                    {reviewList.map((review) => (
                        <div
                            key={`review-${review.review_id}`}
                            className="bg-white rounded-lg shadow p-4 space-y-3"
                        >
                            {/* 별점 · 날짜 */}
                            <div className="flex items-center justify-between">
                                <div className="flex">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <span
                                            key={i}
                                            className={`mr-1 text-xl ${
                                                i < review.score ? "text-yellow-400" : "text-gray-300"
                                            }`}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                                <span className="text-xs text-gray-400">
                                    {review.reg_date.slice(0, 10)}
                                </span>
                            </div>

                            {/* 코멘트 */}
                            <p className="text-gray-800 whitespace-pre-wrap">{review.comment}</p>

                            {/* 이미지 */}
                            {review.img?.img_url && (
                                <img
                                    src={`http://localhost:8080/images/s_${review.img.img_url}`}
                                    alt="리뷰 이미지"
                                    className="w-24 h-24 object-cover rounded"
                                />
                            )}

                            {/* 좋아요 */}
                            <button className="flex items-center space-x-1 text-gray-600 hover:text-primary">
                                <span className="text-lg">👍</span>
                                <span className="text-sm">{review.recommend_cnt}</span>
                            </button>
                        </div>
                    ))}

                    {/* 무한 스크롤 디텍터 */}
                    {hasNextPage && <div ref={bottomRef} className="h-1" />}

                    {isFetchingNextPage && (
                        <p className="text-center py-2">리뷰를 불러오는 중입니다</p>
                    )}
                    {!hasNextPage && (
                        <p className="text-center py-2 text-gray-400">마지막 리뷰입니다</p>
                    )}
                </div>
            </div>
        </div>
    );
}