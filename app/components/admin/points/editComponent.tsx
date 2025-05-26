import { useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { updateCoupon, deleteCoupon } from "~/api/points/pointsAPI";
import {PointProductType} from "~/enums/points/points";
import type {PointStoreDTO} from "~/types/points";

interface Props {
    idNumber: number | null;
    data: PointStoreDTO | undefined;
}

export default function EditComponent({ idNumber, data }: Props) {
    const navigate = useNavigate();
    const formRef = useRef<HTMLFormElement | null>(null);


    // 수정
    const updateMutation = useMutation({
        mutationFn: (formData: FormData) => updateCoupon(idNumber ?? 0, formData),
        onSuccess: () => {
            alert("수정 완료!");
            navigate("/admin/points/list");
        },
        onError: () => {
            alert("수정 실패");
        },
    });

    // 삭제
    const deleteMutation = useMutation({
        mutationFn: () => deleteCoupon(idNumber ?? 0),
        onSuccess: () => {
            alert("삭제 완료!");
            navigate("/admin/points/list");
        },
        onError: () => {
            alert("삭제 실패");
        },
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formEl = formRef.current;
        if (!formEl) return;
        const formData = new FormData(formEl);
        updateMutation.mutate(formData);
    };

    const handleDelete = () => {
        if (confirm("정말 삭제하시겠습니까?")) {
            deleteMutation.mutate();
        }
    };

    // 초기값 설정
    useEffect(() => {
        if (!data || !formRef.current) return;
        const formEl = formRef.current;
        formEl.item.value = data.item;
        formEl.price.value = data.price.toString();
        formEl.description.value = data.description;
        formEl.productType.value = data.productType;
        // file input은 value 설정 안 됨
        // 기존 이미지 URL 숨겨진 input에 넣기
        const imgUrlInput = formEl.querySelector('input[name="imgUrl"]') as HTMLInputElement | null;
        if (imgUrlInput) {
            imgUrlInput.value = data.imgUrl ?? "";
        }
    }, [data]);

    return (
        <div className="bg-white p-6 rounded shadow max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">✏️ 상품 수정</h2>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">상품명</label>
                    <input
                        type="text"
                        name="item"
                        className="mt-1 w-full border px-3 py-2 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">가격</label>
                    <input
                        type="number"
                        name="price"
                        className="mt-1 w-full border px-3 py-2 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">설명</label>
                    <textarea
                        name="description"
                        rows={4}
                        className="mt-1 w-full border px-3 py-2 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">상품 타입</label>
                    <select
                        name="productType"
                        className="mt-1 w-full border px-3 py-2 rounded"
                        required
                    >
                        <option value="">선택</option>
                        {Object.entries(PointProductType).map(([key, value]) => (
                            <option key={key} value={key}>
                                {value}
                            </option>
                        ))}
                    </select>
                </div>

                {/*숨겨진 input 추가 - 수정안한 이미지 유지를 위해서*/}
                <input type="hidden" name="imgUrl" value={data?.imgUrl ?? ""} />

                <div>
                    <label className="block text-sm font-medium text-gray-700">이미지 파일</label>
                    <input
                        type="file"
                        name="imageFile"
                        accept="image/*"
                        className="mt-1 w-full"
                    />
                </div>


                <div className="flex gap-4">
                    <button
                        type="submit"
                        className="flex-1 bg-blue-300 text-white py-2 rounded hover:bg-blue-600"
                    >
                        수정
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="flex-1 bg-red-300 text-white py-2 rounded hover:bg-red-600"
                    >
                        삭제
                    </button>
                </div>
            </form>
        </div>
    );
}