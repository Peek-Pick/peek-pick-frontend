import ProductListComponent from "~/components/reviews/productListComponent";
import {useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getProductDetail } from "~/api/products/productsAPI"
import { getProductReviews, getProductIdByBarcode } from "~/api/reviews/reviewAPI";
import { useState, useEffect } from "react";

function ProductListPage() {
    const {barcode} = useParams();

    // barcode로 productId 받아오기
    const [productId, setProductId] = useState<number | null>(null);

    // 정렬 기준 - 최신순 / 좋아요순
    const [sortType, setSortType] = useState<"latest" | "likes">("latest");

    useEffect(() => {
        if (!barcode) return;

        getProductIdByBarcode(barcode)
            .then((response) => {
                setProductId(Number(response.data));
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
        queryKey: ["productReviews", productId, sortType],
        queryFn: ({ pageParam = 0 }) => {
            if (sortType === "latest") {
                return getProductReviews(productId, pageParam, "regDate");
            } else {
                return getProductReviews(productId, pageParam, "recommendCnt");
            }
        },
        initialPageParam: 0,
        enabled: productId !== null,
        getNextPageParam: (lastPage) => {
            const currentPage = lastPage.data.pageable.pageNumber;
            const isLast = lastPage.data.last;
            return isLast ? undefined : currentPage + 1;
        }
    });

    const allReviews = data?.pages.flatMap((page) => page.data.content) ?? [];

    // 상품 정보 productDetail 가져오기
    const {data: productData, isLoading: productLoading, isError: productError} = useQuery({
        queryKey: ["productData", barcode],
        queryFn: () => getProductDetail(barcode!)
    });

    const aiReview: aiReviewDTO = {
        percent: 98,
        goodComment: "이 제품은 용량이 많아서 부족함 없이 편리하게 사용할 수 있어요. 아이들이 좋아하는 간식으로 자주 구매하고, 품질이 좋아 만족스러운 제품이에요. 바나나킥의 달콤하고 바삭한 맛을 즐기며 행복한 시간을 보낼 수 있어요. 가격 대비 만족도도 높아요!",
        badComment: "제품의 맛이 예전 같지 않고 너무 달아서 부담스러웠어요. 바삭함도 덜해져서 재구매는 고민이 되는 수준이었습니다. 같은 가격이면 그냥 피카츄냐냐 먹을래요. 요즘 누가 바나나킥 돈주고 사먹냐?"
    };

    return (
        <div>
            <ProductListComponent
                aiReview={aiReview}
                productId={Number(productId)}
                productData={productData}
                reviewList={allReviews}
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                isLoading={isLoading}
                isError={isError}
                sortType={sortType}
                setSortType={setSortType}
                productLoading={productLoading}
                productError={productError}
            />
        </div>
    );
}

export default ProductListPage;