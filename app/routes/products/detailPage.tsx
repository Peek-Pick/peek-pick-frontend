// app/routes/products/detailPage.tsx

import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ProductLayout from "~/layout/productLayout";
import DetailComponent from "~/components/products/detailComponent";
import { getProductDetail } from "~/api/productsAPI";
import type { ProductDetailDTO } from "~/types/products";

export default function DetailPage() {
    // URL 파라미터에서 barcode 읽기
    const { barcode } = useParams<{ barcode: string }>();

    // ───────────────────────────────────────────────────────────────
    // useQuery를 object syntax로 호출
    // ───────────────────────────────────────────────────────────────
    const {
        data,         // ProductDetailDTO | undefined
        isLoading,
        isError,
        error,
    } = useQuery<ProductDetailDTO, Error>({
        queryKey: ["productDetail", barcode],
        queryFn: () => getProductDetail(barcode!),
        enabled: Boolean(barcode),        // barcode가 있을 때만 실행
        staleTime: 5 * 60 * 1000,         // 5분
    });

    // 로딩·에러 처리
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

    // data가 ProductDetailDTO로 정확히 인식되므로 TS2739 에러 없음
    return (
        <ProductLayout>
            <DetailComponent product={data} />
        </ProductLayout>
    );
}
