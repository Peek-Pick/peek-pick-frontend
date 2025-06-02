import UserListComponent from "~/components/reviews/userListComponent";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getUserReviews, getUserReviewsCount } from "~/api/reviews/reviewAPI";

function UserListPage() {
    // 유저 리뷰 개수 받아오기
    const { data: reviewCount } = useQuery({
        queryKey: ["userReviewCount"],
        queryFn: () => getUserReviewsCount()
    });

    // 유저 리뷰 리스트 userReviews 받아오기 (무한스크롤)
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

    const allReviews = data?.pages.flatMap((page) => page.data.content) ?? [];

    return (
        <div>
            <UserListComponent
                reviewCount={reviewCount!}
                reviewList={allReviews}
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                isLoading={isLoading}
                isError={isError}
            />
        </div>
    );
}

export default UserListPage;