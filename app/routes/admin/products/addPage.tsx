import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import ProductFormComponent, { type ProductFormValues } from "~/components/admin/products/formComponent";
import { createAdminProduct } from "~/api/products/adminProductsAPI";
import type { ProductDetailDTO } from "~/types/products";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";

export default function AdminProductAddPage() {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string>("");
    const [fileLabel, setFileLabel] = useState<string>("선택된 파일 없음");

    const createMut = useMutation<ProductDetailDTO, Error, ProductFormValues>({
        // mutationFn 과 옵션을 하나의 객체로 넘깁니다.
        mutationFn: (values) =>
            createAdminProduct(values, imageFile ?? undefined, imageUrl),
        onSuccess: (data) => {
            navigate(`/admin/products/${data.productId}`);
        },
        onError: (err) => {
            alert("등록 중 오류 발생: " + err.message);
        },
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setImageFile(file);
        setFileLabel(file?.name ?? "선택된 파일 없음");
    };

    const handleSubmit = (values: ProductFormValues) => {
        createMut.mutate(values);
    };

    const handleCancel = () => {
        navigate("/admin/products/list");
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
            <h2 className="text-xl font-bold mb-6 border-b pb-2">새 상품 등록</h2>

            {/* 이미지 선택 */}
            <div className="mb-6">
                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">
                    이미지 파일
                </label>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100 transition"
                    >
                        <FontAwesomeIcon icon={faImage} />
                        이미지 선택
                    </button>
                    <span className="text-gray-600 truncate max-w-xs">{fileLabel}</span>
                </div>
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />
            </div>

            {/* 이미지 URL 입력 */}
            <div className="mb-6">
                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">
                    이미지 URL
                </label>
                <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full border border-gray-300 rounded p-2"
                />
            </div>

            {/* 상품 폼 */}
            <ProductFormComponent onSubmit={handleSubmit}>
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="flex items-center gap-1 rounded-md px-4 py-2 text-sm font-medium shadow-sm transition bg-gray-200 hover:bg-gray-300"
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        className="flex items-center gap-1 rounded-md px-4 py-2 text-sm font-medium shadow-sm transition bg-purple-600 text-white hover:bg-purple-700"
                    >
                        등록
                    </button>
                </div>
            </ProductFormComponent>
        </div>
    );
}
