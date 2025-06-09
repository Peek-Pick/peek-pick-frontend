import { useState, type ChangeEvent, type FormEvent } from "react";
import type { InquiryResponseDTO, InquiryRequestDTO } from "~/types/inquiries";
import type { InquiryType } from "~/types/inquiries";
import { useNavigate } from "react-router-dom";
import {deleteImages} from "~/api/inquiriesAPI";

const API_URL =
    import.meta.env.VITE_API_URL?.replace("/api/v1", "") ?? "http://localhost:8080";

interface Props {
    initialData: InquiryResponseDTO;
    onSubmit: (dto: InquiryRequestDTO, files: FileList | null) => Promise<void>;
}

const INQUIRY_TYPES: { value: InquiryType; label: string }[] = [
    { value: "ACCOUNT", label: "계정/로그인" },
    { value: "PRODUCT_ADD", label: "상품 추가" },
    { value: "POINT_REVIEW", label: "포인트/리뷰" },
    { value: "HOW_TO_USE", label: "사용 방법" },
    { value: "BUG", label: "오류/버그" },
    { value: "ETC", label: "기타 문의" },
];

function EditComponent({ initialData, onSubmit }: Props) {
    const navigate = useNavigate();
    const [title, setTitle] = useState(initialData.title);
    const [content, setContent] = useState(initialData.content);
    const [type, setType] = useState<InquiryType>(initialData.type);
    const [existingUrls, setExistingUrls] = useState<string[]>([...initialData.imgUrls]);
    const [newFiles, setNewFiles] = useState<FileList | null>(null);

    function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        setNewFiles(e.target.files);
    }

    const handleDeleteImage = async (url: string) => {
        await deleteImages(initialData.inquiryId, [url]);  // inquiryId는 props로 받음
        setExistingUrls(prev => prev.filter(img => img !== url));
    };

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        const dto: InquiryRequestDTO = {
            title,
            content,
            type,
            imgUrls: existingUrls,
        };

        await onSubmit(dto, newFiles);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto p-6 bg-white shadow-lg rounded-xl">
            <h2 className="text-2xl font-bold text-center text-gray-800">문의 수정</h2>

            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
            />

            <select
                value={type}
                onChange={(e) => setType(e.target.value as InquiryType)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                {INQUIRY_TYPES.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>

            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용"
                className="w-full border border-gray-300 p-3 rounded-lg h-40 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
            />

            {/* 기존 이미지 미리보기 */}
            {existingUrls.length > 0 && (
                <div className="flex flex-wrap gap-3">
                    {existingUrls.map((url) => {
                        const imgSrc = url.startsWith("http") ? url : `${API_URL}${url}`;
                        return (
                            <div key={url} className="relative w-24 h-24">
                                <img
                                    src={imgSrc}
                                    className="w-full h-full object-cover rounded border"
                                    alt="기존 첨부 이미지"
                                    onError={(e) => {
                                        e.currentTarget.src = "";
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => handleDeleteImage(url)}
                                    className="absolute top-[-8px] right-[-8px] bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center shadow-md hover:bg-red-600"
                                >
                                    ×
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />

            <div className="flex space-x-3 justify-center">
                <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700"
                >
                    저장
                </button>
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow hover:bg-gray-400"
                >
                    취소
                </button>
            </div>
        </form>
    );
}

export default EditComponent;