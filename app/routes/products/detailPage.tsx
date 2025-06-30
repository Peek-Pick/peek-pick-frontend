import { useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import PreviewComponent from "~/components/reviews/previewComponent";
import { getProductDetail } from "~/api/products/productsAPI";
import type { ProductDetailDTO } from "~/types/products";
import { BackButton, FloatingActionButtons } from "~/util/button/FloatingActionButtons";
import DetailComponent2 from "~/components/products/detailComponent2";
import {getReviewSummary} from "~/api/reviews/reviewAPI";
import AISummarySection from "~/components/reviews/aiSummarySection";
import AverageRatingSection from "~/components/reviews/averageRatingSection";

const SCROLL_KEY = "rankingPageScrollY";

export default function DetailPage() {
    const { barcode } = useParams<{ barcode: string }>();

    // 🚩 빈 배열로 마운트 시 무조건 실행 → F5 리로드 감지하여 스크롤 세션 삭제
    useLayoutEffect(() => {
        const entries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
        if (entries.at(-1)?.type === "reload") {
            sessionStorage.removeItem(SCROLL_KEY);
        }
    }, []);

    const {
        data,
        isLoading,
        isError,
    } = useQuery<ProductDetailDTO, Error>({
        queryKey: ["productDetail", barcode],
        queryFn: () => getProductDetail(barcode!),
        enabled: Boolean(barcode),
        staleTime: 5 * 60 * 1000,
    });

    // AI 요약 리뷰 가져오기
    const { data: aiReview, isLoading: aiReviewLoading, isError: aiReviewError } = useQuery<aiReviewDTO>({
        queryKey: ["reviewSummary", data?.productId],
        queryFn: () => getReviewSummary(data?.productId!), // productId는 null 체크 후 실행됨
        enabled: data?.productId !== null && data?.productId !== undefined,
    });

    return (
        <>
            <DetailComponent2
                product={data}
                isLoading={isLoading}
                isError={isError}
            />
            {data && (
                <AverageRatingSection
                    score={data.score ?? 5}
                    reviewCount={data.reviewCount}
                />
            )}
            {aiReview &&
                <AISummarySection aiReview={aiReview} />
            }
            {data && (
                <PreviewComponent
                    barcode={barcode!}
                    reviewNum={data.reviewCount!}
                />
            )}
            {/*<BottomNavComponent />*/}
            <BackButton />
            <FloatingActionButtons />
        </>
    );
}
