// src/routes/products/detailPage.tsx
import { useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import DetailComponent from "~/components/products/detailComponent";
import PreviewComponent from "~/components/reviews/previewComponent";
import BottomNavComponent from "~/components/main/bottomNavComponent";
import { getProductDetail } from "~/api/products/productsAPI";
import type { ProductDetailDTO } from "~/types/products";

const SCROLL_KEY = "rankingPageScrollY";

export default function DetailPage() {
    const { barcode } = useParams<{ barcode: string }>();

    // 🚩 빈 배열로 마운트 시 무조건 실행 → F5 리로드 감지하여 스크롤 세션 삭제
    useLayoutEffect(() => {
        const entries = performance.getEntriesByType(
            "navigation"
        ) as PerformanceNavigationTiming[];
        if (entries.at(-1)?.type === "reload") {
            sessionStorage.removeItem(SCROLL_KEY);
        }
    }, []); // <- 여기를 빈 배열로 고정합니다

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

    return (
        <>
            <DetailComponent
                product={data}
                isLoading={isLoading}
                isError={isError}
            />
            {data && (
                <PreviewComponent
                    barcode={barcode!}
                    reviewNum={data.reviewCount!}
                />
            )}
            <BottomNavComponent />
        </>
    );
}
