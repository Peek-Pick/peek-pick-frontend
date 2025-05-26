import { useRef } from "react";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { addCoupon } from "~/api/points/pointsAPI";
import {PointProductType} from "~/enums/points/points";

export default function AddComponent() {
    const navigate = useNavigate();
    const formRef = useRef<HTMLFormElement | null>(null);

    const mutation = useMutation({
        mutationFn: (data: FormData) => addCoupon(data),
        onSuccess: () => {
            alert("상품이 등록되었습니다.");
            navigate("/admin/points/list");
        },
        onError: () => {
            alert("등록에 실패했습니다.");
        },
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formEl = formRef.current;
        if (!formEl) return;

        const formData = new FormData(formEl);
        mutation.mutate(formData);


        console.log([...formData.entries()]);

    };


    return (
        <div className="bg-white p-6 rounded shadow max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">➕ 상품 등록</h2>
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
                <div>
                    <label className="block text-sm font-medium text-gray-700">이미지 파일</label>
                    <input
                        type="file"
                        name="imageFile"
                        accept="image/*"
                        className="mt-1 w-full"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-purple-300 text-white py-2 rounded hover:bg-green-600"
                >
                    상품 등록
                </button>
            </form>
        </div>
    );
}