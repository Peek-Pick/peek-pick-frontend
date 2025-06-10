// src/routes/admin/products/detailPage.tsx
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import AdminProductDetailComponent from "~/components/admin/products/detailComponent";
import { getAdminProductDetail } from "~/api/products/adminProductsAPI";
import type { ProductDetailDTO } from "~/types/products";

export default function AdminProductDetailPage() {
    const { id } = useParams<{ id: string }>();

    const { data: product, isLoading, isError, error } = useQuery<
        ProductDetailDTO,
        Error
    >({
        queryKey: ["adminProductDetail", id],
        queryFn: () => getAdminProductDetail(Number(id)),
        enabled: Boolean(id),
    });

    if (isLoading) {
        return <p className="p-6 text-gray-500">로딩 중...</p>;
    }
    if (isError || !product) {
        return <p className="p-6 text-red-500">상세 정보를 불러오는 중 오류 발생: {error?.message}</p>;
    }

    return (
        <div className="bg-white shadow-md rounded-lg p-6 text-gray-800 max-w-4xl mx-auto">
            <AdminProductDetailComponent product={product} />
        </div>
    );
}
