import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import { PointProductType } from "~/enums/points/points";
import type { PointStoreDTO } from "~/types/points";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil } from '@fortawesome/free-solid-svg-icons'
import {deleteCoupon, updateCoupon} from "~/api/points/adminPointsAPI";

interface Props {
    idNumber: number | null;
    data: PointStoreDTO | undefined;
}

export default function EditComponent({ idNumber, data }: Props) {
    const navigate = useNavigate();
    const formRef = useRef<HTMLFormElement | null>(null);
    const [selectedFileName, setSelectedFileName] = useState<string>("파일을 선택하세요");
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const queryClient = useQueryClient();

    // 수정 뮤테이션
    const updateMutation = useMutation({
        mutationFn: (formData: FormData) => updateCoupon(idNumber ?? 0, formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["points"] }); //수정 후 목록 최신화
            alert("수정 완료!");
            navigate("/admin/points/list");
        },
        onError: () => {
            alert("수정 실패");
        },
    });

    // 삭제 뮤테이션
    const deleteMutation = useMutation({
        mutationFn: () => deleteCoupon(idNumber ?? 0),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["points"] }); //삭제 후 목록 최신화
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFileName(e.target.files[0].name);
        } else {
            setSelectedFileName("파일을 선택하세요");
        }
    };

    const handleDelete = () => {
        if (confirm("정말 삭제하시겠습니까?")) {
            deleteMutation.mutate();
        }
    };

    useEffect(() => {
        if (!data || !formRef.current) return;
        const formEl = formRef.current;
        formEl.item.value = data.item;
        formEl.price.value = data.price.toString();
        formEl.description.value = data.description;
        formEl.productType.value = data.productType;
        const imgUrlInput = formEl.querySelector(
            'input[name="imgUrl"]'
        ) as HTMLInputElement | null;
        if (imgUrlInput) {
            imgUrlInput.value = data.imgUrl ?? "";
        }
    }, [data]);

    return (
        <div className="bg-white shadow-md rounded-lg p-6 text-gray-800 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-6 border-b pb-2 flex items-center gap-2">
                <FontAwesomeIcon icon={faPencil} />
                상품 수정
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

                {/* 숨겨진 input - 이미지 유지용 */}
                <input type="hidden" name="imgUrl" value={data?.imgUrl ?? ""} />

                {/* 이미지 업로드 버튼 */}
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

                <div className="flex gap-2 justify-end">
                    <button
                        type="submit"
                        className="flex items-center gap-1 rounded-md bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm hover:bg-blue-200 transition"
                    >
                        수정
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="flex items-center gap-1 rounded-md bg-red-100 px-4 py-2 text-sm font-medium text-red-700 shadow-sm hover:bg-red-200 transition"
                    >
                        삭제
                    </button>
                </div>
            </form>
        </div>
    );
}
