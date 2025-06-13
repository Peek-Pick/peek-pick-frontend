import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import { PointProductType } from "~/enums/points/points";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import {addCoupon} from "~/api/points/adminPointsAPI";

export default function AddComponent() {
    const navigate = useNavigate();
    const formRef = useRef<HTMLFormElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [selectedFileName, setSelectedFileName] = useState("파일을 선택하세요");
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (data: FormData) => addCoupon(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["points"] }); //추가 후 목록 최신화
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
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFileName(e.target.files[0].name);
        } else {
            setSelectedFileName("파일을 선택하세요");
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6 text-gray-800 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-6 border-b pb-2 flex items-center gap-2">
                <FontAwesomeIcon icon={faPlus} />
                상품 등록
            </h2>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                        상품명
                    </label>
                    <input
                        type="text"
                        name="item"
                        className="w-full border border-gray-200 rounded-md px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                        가격
                    </label>
                    <input
                        type="number"
                        name="price"
                        className="w-full border border-gray-200 rounded-md px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                        설명
                    </label>
                    <textarea
                        name="description"
                        rows={4}
                        className="w-full border border-gray-200 rounded-md px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 whitespace-pre-line leading-relaxed"
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                        상품 타입
                    </label>
                    <select
                        name="productType"
                        className="w-full border border-gray-200 rounded-md px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
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

                {/* 이미지 업로드 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">이미지 파일</label>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100 hover:text-gray-800 transition"
                        >
                            파일 선택
                        </button>
                        <span className="text-gray-600 truncate max-w-xs">{selectedFileName}</span>
                    </div>
                    <input
                        type="file"
                        name="imageFile"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="flex items-center gap-1 rounded-md bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700 shadow-sm hover:bg-purple-200 transition"
                    >
                        등록
                    </button>
                </div>
            </form>
        </div>
    );
}
