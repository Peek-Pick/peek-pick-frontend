import { type ChangeEvent, type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { InquiryRequestDTO, InquiryType } from "~/types/inquiries";
import LoadingComponent from "~/components/common/loadingComponent";

interface Props {
    onSubmit: (dto: InquiryRequestDTO, files: FileList | null) => Promise<void>;
}

// 문의 유형 목록 (InquiryType에 맞추기)
const INQUIRY_TYPES: { value: InquiryType; label: string }[] = [
    { value: "ACCOUNT", label: "계정/로그인" },
    { value: "PRODUCT_ADD", label: "상품 추가" },
    { value: "POINT_REVIEW", label: "포인트/리뷰" },
    { value: "HOW_TO_USE", label: "사용 방법" },
    { value: "BUG", label: "오류/버그" },
    { value: "ETC", label: "기타 문의" },
];

function AddComponent({ onSubmit }: Props) {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [type, setType] = useState<InquiryType>("ACCOUNT");
    const [files, setFiles] = useState<FileList | null>(null);
    const [loading, setLoading] = useState(false);

    function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        setFiles(e.target.files);
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setLoading(true);

        const dto: InquiryRequestDTO = {
            title,
            content,
            type,
            imgUrls: [],
        };

        try {
            await onSubmit(dto, files);
        } catch (err) {
            console.error("문의 작성 중 오류:", err);
            alert("문의 작성에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <LoadingComponent isLoading={true} />; // 변경: 로딩 컴포넌트 사용
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto p-4">
            <h2 className="text-xl font-semibold">문의 작성</h2>

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

export default AddComponent;