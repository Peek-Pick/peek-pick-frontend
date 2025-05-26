import UserListComponent from "~/components/reviews/userListComponent";
import {useInfiniteQuery } from "@tanstack/react-query";
import {useParams} from "react-router-dom";
import {getProductReviews} from "~/api/reviews/reviewAPI";

function ProductListPage() {
    const { productId } = useParams();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useInfiniteQuery({
        queryKey: ["productReviews", productId],
        queryFn: ({ pageParam}) => getProductReviews(Number(productId), pageParam),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            const currentPage = lastPage.data.pageable.page_number;
            const isLast = lastPage.data.last;
            return isLast ? undefined : currentPage + 1;
        },
        staleTime: 10 * 60 * 1000,
    });

    const allReviews = data?.pages.flatMap((page) => page.data.content) ?? [];

    return (
        <UserListComponent
            reviewList={allReviews}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            isLoading={isLoading}
            isError={isError}
        />
    );
}

export default ProductListPage;