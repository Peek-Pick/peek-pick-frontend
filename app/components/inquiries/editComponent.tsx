import { useState, type ChangeEvent, type FormEvent } from "react";
import type { InquiryResponseDTO, InquiryRequestDTO } from "~/types/inquiries";
import type { InquiryType } from "~/types/inquiries";
import { useNavigate } from "react-router-dom";

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

export default function EditComponent({ initialData, onSubmit }: Props) {
    const navigate = useNavigate();
    const [title, setTitle] = useState(initialData.title);
    const [content, setContent] = useState(initialData.content);
    const [type, setType] = useState<InquiryType>(initialData.type);
    const [files, setFiles] = useState<FileList | null>(null);

    function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        setFiles(e.target.files);
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        const dto: InquiryRequestDTO = {
            title,
            content,
            type,
            imgUrls: initialData.imgUrls, // 기존에 저장된 URL 목록 그대로 전달
        };

        await onSubmit(dto, files);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto p-4">
            <h2 className="text-xl font-semibold">문의 수정</h2>

            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목"
                className="w-full border p-2 rounded"
                required
            />

            <select
                value={type}
                onChange={(e) => setType(e.target.value as InquiryType)}
                className="w-full border p-2 rounded"
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
                className="w-full border p-2 rounded h-40"
                required
            />

            {/* 기존에 저장된 이미지 미리보기 */}
            {initialData.imgUrls.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {initialData.imgUrls.map((url) => {
                        const imgSrc = url.startsWith("http")
                            ? url
                            : `${import.meta.env.VITE_API_URL}${url}`;
                        return (
                            <img
                                key={url}
                                src={imgSrc}
                                className="w-24 h-24 object-cover rounded border"
                                alt="기존 첨부 이미지"
                                onError={(e) => {
                                    e.currentTarget.src = "";
                                }}
                            />
                        );
                    })}
                </div>
            )}

            <input type="file" multiple onChange={handleFileChange} />

            <div className="flex space-x-2">
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                    저장
                </button>
                <button
                    type="button"
                    onClick={() => navigate("/inquiries/list")}
                    className="px-4 py-2 bg-gray-300 rounded"
                >
                    취소
                </button>
            </div>
        </form>
    );
}