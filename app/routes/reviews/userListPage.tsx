import UserListComponent from "~/components/reviews/userListComponent";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getUserReviews, getUserReviewsCount } from "~/api/reviews/reviewAPI";

function UserListPage() {
    // 리뷰 개수
    const { data: reviewCount, isLoading: isCountLoading} = useQuery({
        queryKey: ["userReviewCount"],
        queryFn: () => getUserReviewsCount()
    });

    // 리뷰 리스트 (무한 스크롤)
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useInfiniteQuery({
        queryKey: ["userReviews"],
        queryFn: ({ pageParam}) => getUserReviews(pageParam),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            const currentPage = lastPage.data.pageable.page_number;
            const isLast = lastPage.data.last;
            return isLast ? undefined : currentPage + 1;
        }
    });
    console.log(data)

    const allReviews = data?.pages.flatMap((page) => page.data.content) ?? [];

    return (
        <div>
            {/* 리뷰 개수 로딩 완료 후 리스트 표시 */}
            {!isCountLoading && (
                <div className="w-full min-h-screen bg-gray-50 p-4">
                    <div className="text-center">
                        작성한 리뷰 수:{" "}
                        <span className="font-bold text-red-500">
                            {isCountLoading ? "로딩 중..." : `${reviewCount}`}
                        </span>
                    </div>

                    <UserListComponent
                        reviewList={allReviews}
                        fetchNextPage={fetchNextPage}
                        hasNextPage={hasNextPage}
                        isFetchingNextPage={isFetchingNextPage}
                        isLoading={isLoading}
                        isError={isError}
                    />
                </div>
            )}
        </div>
    );
}

export default UserListPage;