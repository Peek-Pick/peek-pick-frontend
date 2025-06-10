import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import ProductFormComponent, { type ProductFormValues } from "~/components/admin/products/formComponent";
import { getAdminProductDetail, updateAdminProduct } from "~/api/products/adminProductsAPI";
import type { ProductDetailDTO } from "~/types/products";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";

export default function AdminProductEditPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const idNum = Number(id);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string>("");
    const [fileLabel, setFileLabel] = useState<string>("선택된 파일 없음");
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
        setImageUrl(product.imgUrl ?? "");
        setFileLabel(product.imgUrl ? product.imgUrl.split("/").pop()! : "선택된 파일 없음");
        setIsDelete(product.isDelete ?? false);
    }, [product]);

    const updateMut = useMutation<ProductDetailDTO, Error, ProductFormValues>({
        mutationFn: (values) =>
            updateAdminProduct(idNum, values, imageFile ?? undefined, imageUrl, isDelete),
        onSuccess: (data) => navigate(`/admin/products/${data.productId}`),
        onError: (err) => alert("수정 중 오류 발생: " + err.message),
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setImageFile(file);
        setFileLabel(file?.name ?? "선택된 파일 없음");
    };

    if (isLoading || !initialData) {
        return <p className="p-6 text-gray-500">로딩 중...</p>;
    }

    const handleSubmit = (values: ProductFormValues) => {
        updateMut.mutate(values);
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
            <h2 className="text-xl font-bold mb-6 border-b pb-2">상품 수정</h2>

            {/* 이미지 선택 */}
            <div className="mb-6">
                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">
                    이미지 파일
                </label>
                <div className="flex items-center gap-3 mb-3">
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

                {/* 이미지 URL 입력 */}
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

            {/* 삭제 처리 토글 */}
            <div className="mb-6 flex items-center gap-2">
                <input
                    id="isDeleteToggle"
                    type="checkbox"
                    checked={isDelete}
                    onChange={() => setIsDelete((prev) => !prev)}
                    className="w-4 h-4"
                />
                <label htmlFor="isDeleteToggle" className="text-sm text-gray-700">
                    삭제 처리 여부
                </label>
            </div>

            {/* 상품 폼 */}
            <ProductFormComponent initial={initialData} onSubmit={handleSubmit}>
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        type="button"
                        onClick={() => navigate(`/admin/products/${idNum}`)}
                        className="flex items-center gap-1 rounded-md px-4 py-2 text-sm font-medium shadow-sm transition bg-gray-200 hover:bg-gray-300"
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        className="flex items-center gap-1 rounded-md px-4 py-2 text-sm font-medium shadow-sm transition bg-blue-600 text-white hover:bg-blue-700"
                    >
                        수정
                    </button>
                </div>
            </ProductFormComponent>
        </div>
    );
}
