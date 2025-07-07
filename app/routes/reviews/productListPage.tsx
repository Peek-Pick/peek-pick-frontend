import ProductListComponent from "~/components/reviews/productListComponent";
import {useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getProductDetail } from "~/api/products/productsAPI"
import {getProductReviews, getProductIdByBarcode, getReviewSummary} from "~/api/reviews/reviewAPI";
import { useState, useEffect } from "react";
import {useTranslation} from "react-i18next";

function ProductListPage() {
    const {barcode} = useParams();
    const { t, i18n } = useTranslation();
    const lang = i18n.language;
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
                return getProductReviews(productId, pageParam, "regDate", lang);
            } else {
                return getProductReviews(productId, pageParam, "recommendCnt", lang);
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
        queryFn: () => getProductDetail(barcode!, lang)
    });

    // AI 요약 리뷰 가져오기
    const { data: aiReview, isLoading: aiReviewLoading, isError: aiReviewError } = useQuery<aiReviewDTO>({
        queryKey: ["reviewSummary", productId],
        queryFn: () => getReviewSummary(productId!, lang), // productId는 null 체크 후 실행됨
        enabled: productId !== null,
    });

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