import ProductListComponent from "~/components/reviews/productListComponent";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getProductReviews, getProductIdByBarcode, getProductReviewsCount } from "~/api/reviews/reviewAPI";
import { useState, useEffect } from "react";

function ProductListPage() {
    const { barcode } = useParams();

    // barcode로 productId 받아오기
    const [productId, setProductId] = useState<number | null>(null);

    useEffect(() => {
        if (!barcode) return;

        getProductIdByBarcode(barcode)
            .then((response) => {
                setProductId(Number(response.data));
                console.log(response.data)})
    }, [barcode]);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useInfiniteQuery({
        queryKey: ["productReviews", Number(productId)],
        queryFn: ({ pageParam}) => getProductReviews(Number(productId), pageParam),
        initialPageParam: 0,
        enabled: productId !== null,
        getNextPageParam: (lastPage) => {
            console.log(lastPage)
            const currentPage = lastPage.data.pageable.page_number;
            const isLast = lastPage.data.last;
            return isLast ? undefined : currentPage + 1;
        }
    });

    const allReviews = data?.pages.flatMap((page) => page.data.content) ?? [];

    // 리뷰 개수
    const { data: reviewCount, isLoading: isCountLoading} = useQuery({
        queryKey: ["productReviewCount", productId],
        queryFn: () => getProductReviewsCount(productId!),
        enabled: productId !== null
    });

    return (
        <div>
            {!isCountLoading && (
                <div className="w-full min-h-screen bg-gray-50 p-4">
                    <div className="text-center">
                        작성한 리뷰 수:{" "}
                        <span className="font-bold text-red-500">
                            {isCountLoading ? "로딩 중..." : `${reviewCount}`}
                        </span>
                    </div>

                    <ProductListComponent
                        productId={Number(productId)}
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

export default ProductListPage;