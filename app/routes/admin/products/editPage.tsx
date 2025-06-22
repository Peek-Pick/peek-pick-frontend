// src/routes/admin/products/editPage.tsx

import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import ProductFormComponent, { type ProductFormValues } from "~/components/admin/products/formComponent";
import { getAdminProductDetail, updateAdminProduct } from "~/api/products/adminProductsAPI";
import {ProductLoading} from "~/util/loading/productLoading";
import type { ProductDetailDTO } from "~/types/products";

export default function AdminProductEditPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const idNum = Number(id);

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [fileLabel, setFileLabel] = useState<string>("이미지 필수");
    const [isDelete, setIsDelete] = useState<boolean>(false);
    const [initialData, setInitialData] = useState<ProductFormValues>();

    const { data: product, isLoading } = useQuery<ProductDetailDTO, Error>({
        queryKey: ["adminProductDetail", idNum],
        queryFn: () => getAdminProductDetail(idNum),
        enabled: !!id,
    });

    useEffect(() => {
        if (!product) return;
        setInitialData({
            name: product.name,
            barcode: product.barcode,
            description: product.description ?? "",
            category: product.category ?? "",
            volume: product.volume ?? "",
            ingredients: product.ingredients ?? "",
            allergens: product.allergens ?? "",
            nutrition: product.nutrition ?? "",
        });
        setIsDelete(product.isDelete ?? false);
        const fileName = product.imgUrl?.split("/").pop();
        setFileLabel(fileName ?? "이미지 필수");
    }, [product]);

    const updateMut = useMutation<ProductDetailDTO, Error, ProductFormValues>({
        mutationFn: (values) =>
            updateAdminProduct(idNum, values, imageFile ?? undefined, isDelete),
        onSuccess: (data) => navigate(`/admin/products/${data.productId}`),
        onError: (err) => alert("수정 중 오류 발생: " + err.message),
    });

    const handleSubmit = (values: ProductFormValues) => {
        if (!imageFile && !product?.imgUrl) {
            alert("이미지를 반드시 첨부해야 합니다.");
            return;
        }
        updateMut.mutate(values);
    };

    if (isLoading || !initialData) {
        return <ProductLoading />;
    }

    return (
        <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
            <h2 className="text-xl font-bold mb-6 border-b pb-2">상품 수정</h2>

            <ProductFormComponent
                initial={initialData}
                onSubmit={handleSubmit}
                onFileChange={(file) => {
                    setImageFile(file);
                    setFileLabel(file?.name ?? "이미지 필수");
                }}
                fileLabel={fileLabel}
                showDeleteCheckbox={true}
                isDelete={isDelete}
                onToggleDelete={() => setIsDelete((prev) => !prev)}
            />

            <div className="flex justify-end gap-3 mt-6">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1 rounded-md px-4 py-2 text-sm font-medium shadow-sm transition bg-gray-200 hover:bg-gray-300"
                >
                    취소
                </button>
                <button
                    type="button"
                    onClick={() => {
                        const form = document.querySelector("form") as HTMLFormElement;
                        if (form) form.requestSubmit();
                    }}
                    className="flex items-center gap-1 rounded-md px-4 py-2 text-sm font-medium shadow-sm transition bg-blue-600 text-white hover:bg-blue-700"
                >
                    수정
                </button>
            </div>
        </div>
    );
}
