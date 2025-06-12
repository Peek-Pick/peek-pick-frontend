// src/routes/products/detailPage.tsx
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import DetailComponent from "~/components/products/detailComponent";
import PreviewComponent from "~/components/reviews/previewComponent";
import BottomNavComponent from "~/components/main/bottomNavComponent";
import { getProductDetail } from "~/api/products/productsAPI";
import type { ProductDetailDTO } from "~/types/products";

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
