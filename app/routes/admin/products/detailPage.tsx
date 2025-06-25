// src/routes/admin/products/detailPage.tsx
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import AdminProductDetailComponent from "~/components/admin/products/detailComponent";
import { getAdminProductDetail } from "~/api/products/adminProductsAPI";
import type { ProductDetailDTO } from "~/types/products";
import {ProductLoading} from "~/util/loading/productLoading";

export default function AdminProductDetailPage() {
    const { id } = useParams<{ id: string }>();

    const { data: product, isLoading, isError } = useQuery<
        ProductDetailDTO,
        Error
    >({
        queryKey: ["adminProductDetail", id],
        queryFn: () => getAdminProductDetail(Number(id)),
        enabled: Boolean(id),
    });

    return (
        <div className="bg-white shadow-md rounded-lg p-6 text-gray-800 max-w-4xl mx-auto">
            <AdminProductDetailComponent product={product} isLoading={isLoading} isError={isError}/>
        </div>
    );
}
