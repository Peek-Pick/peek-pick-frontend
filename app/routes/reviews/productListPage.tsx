import ProductListComponent from "~/components/reviews/productListComponent";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getProductDetail } from "~/api/productsAPI"
import { getProductReviews, getProductIdByBarcode, getProductReviewsCount } from "~/api/reviews/reviewAPI";
import { useState, useEffect } from "react";

function ProductListPage() {
    const {barcode} = useParams();

    // barcode로 productId 받아오기
    const [productId, setProductId] = useState<number | null>(null);

    useEffect(() => {
        if (!barcode) return;

        getProductIdByBarcode(barcode)
            .then((response) => {
                setProductId(Number(response.data));
                console.log(response.data)
            })
    }, [barcode]);

    // 상풉별 리뷰 리스트 productReviews 받아오기 (무한스크롤)
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useInfiniteQuery({
        queryKey: ["productReviews", Number(productId)],
        queryFn: ({pageParam}) => getProductReviews(Number(productId), pageParam),
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

    // 상품 정보 productDetail 가져오기
    const {data: productDetail} = useQuery({
        queryKey: ["productDetail", barcode],
        queryFn: () => getProductDetail(barcode!)
    });
    console.log(productDetail)

    return (
        <div>
            <ProductListComponent
                productId={Number(productId)}
                productDetail={productDetail}
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


export default ProductListPage;