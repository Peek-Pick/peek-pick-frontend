// src/routes/products/detailPage.tsx
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import DetailComponent from "~/components/products/detailComponent";
import { getProductDetail } from "~/api/products/productsAPI";
import PreviewComponent from "~/components/reviews/previewComponent";
import type { ProductDetailDTO } from "~/types/products";
import BottomNavComponent from "~/components/main/bottomNavComponent";

export default function DetailPage() {
    const { barcode } = useParams<{ barcode: string }>();

    const {
        data,
        isLoading,
        isError,
        error,
    } = useQuery<ProductDetailDTO, Error>({
        queryKey: ["productDetail", barcode],
        queryFn: () => getProductDetail(barcode!),
        enabled: Boolean(barcode),
        staleTime: 5 * 60 * 1000,
    });

    if (isLoading) {
        return <div className="p-4 text-center">로딩 중…</div>;
    }
    if (isError || !data) {
        return (
            <div className="p-4 text-center text-red-500">
                오류 발생: {error?.message ?? "상품을 불러올 수 없습니다."}
            </div>
        );
    }

    return (
        <>
            <DetailComponent product={data} />
            <PreviewComponent
                barcode={barcode!}
                reviewNum={data.reviewCount!}
            />
            <BottomNavComponent />
        </>
    );
}
