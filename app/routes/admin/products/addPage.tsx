// src/routes/admin/products/addPage.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import ProductFormComponent, { type ProductFormValues } from "~/components/admin/products/formComponent";
import { createAdminProduct } from "~/api/products/adminProductsAPI";
import { ProductLoading } from "~/util/loading/productLoading";
import type { ProductDetailDTO } from "~/types/products";

export default function AdminProductAddPage() {
    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [fileLabel, setFileLabel] = useState<string>("이미지 필수");

    const createMut = useMutation<ProductDetailDTO, Error, ProductFormValues>({
        mutationFn: (values) => createAdminProduct(values, imageFile ?? undefined),
        onSuccess: (data) => {
            navigate(`/admin/products/${data.productId}`);
        },
        onError: (err) => {
            alert("등록 중 오류 발생: " + err.message);
        },
    });

    const handleSubmit = (values: ProductFormValues) => {
        if (!imageFile) {
            alert("이미지를 반드시 첨부해야 합니다.");
            return;
        }
        createMut.mutate(values);
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
            <h2 className="text-xl font-bold mb-6 border-b pb-2">새 상품 등록</h2>

            <ProductFormComponent
                onSubmit={handleSubmit}
                onFileChange={(file) => {
                    setImageFile(file);
                    setFileLabel(file?.name ?? "이미지 필수");
                }}
                fileLabel={fileLabel}
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
                    className="flex items-center gap-1 rounded-md px-4 py-2 text-sm font-medium shadow-sm transition bg-purple-600 text-white hover:bg-purple-700"
                >
                    등록
                </button>
            </div>
        </div>
    );
}
