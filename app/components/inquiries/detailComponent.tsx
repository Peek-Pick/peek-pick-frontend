import {useState} from "react";
import type {InquiryResponseDTO, InquiryType} from "~/types/inquiries";
import {deleteInquiry} from "~/api/inquiriesAPI";
import {Link} from "react-router-dom";
import ImageModalComponent from "~/components/common/ImageModalComponent";

const API_URL = import.meta.env.VITE_API_URL?.replace("/api/v1", "") ?? "http://localhost:8080";

const INQUIRY_TYPES: { value: InquiryType; label: string }[] = [
    {value: "ACCOUNT", label: "계정/로그인"},
    {value: "POINT_REVIEW", label: "포인트/리뷰"},
    {value: "PRODUCT_ADD", label: "상품 추가"},
    {value: "HOW_TO_USE", label: "사용 방법"},
    {value: "BUG", label: "오류/버그"},
    {value: "ETC", label: "기타 문의"},
];

interface Props {
    inquiry: InquiryResponseDTO & { userNickname: string };
    navigate: (to: string) => void;
}

export default function DetailComponent({inquiry, navigate}: Props) {
    const [modalImage, setModalImage] = useState<string | null>(null);
    const handleDelete = async () => {
        if (!confirm("정말 삭제하시겠습니까?")) return;
        await deleteInquiry(inquiry.inquiryId);
        navigate("/inquiries/list");
    };
    const typeLabel =
        INQUIRY_TYPES.find((t) => t.value === inquiry.type)?.label ?? inquiry.type;

    const formatDate = (iso: string) => {
        const d = new Date(iso);
        const now = new Date();
        const pad = (n: number) => n.toString().padStart(2, "0");

        const isToday =
            d.getFullYear() === now.getFullYear() &&
            d.getMonth() === now.getMonth() &&
            d.getDate() === now.getDate();

        if (isToday) {
            return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
        } else {
            const yy = d.getFullYear().toString().slice(-2);
            const mm = pad(d.getMonth() + 1);
            const dd = pad(d.getDate());
            return `${yy}.${mm}.${dd}`;
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-lg space-y-6">
            {/* 제목 */}
            <h1 className="text-3xl font-extrabold text-gray-800">{inquiry.title}</h1>

            {/* 메타 정보 */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">{typeLabel}</span>
                <span> 작성자:{" "}
                    <span className="font-medium text-gray-700">{inquiry.userNickname}</span>
                </span>
                <span> 등록일:{" "}
                    <span className="font-medium text-gray-700">{formatDate(inquiry.regDate)}</span>
                </span>
            </div>

            {/* 본문 */}
            <div className="prose prose-sm prose-gray">
                <p>{inquiry.content}</p>
            </div>

            {/* 이미지 그리드 */}
            {inquiry.imgUrls && inquiry.imgUrls.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                    {inquiry.imgUrls.map((url) => {
                        const src = url.startsWith("http") ? url : `${API_URL}${url}`;
                        return (
                            <button
                                key={url}
                                onClick={() => setModalImage(src)}
                                className="overflow-hidden rounded-lg border hover:shadow-md transition-shadow"
                            >
                                <img
                                    src={src}
                                    alt="첨부 이미지"
                                    className="w-full h-24 object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = "";
                                    }}
                                />
                            </button>
                        );
                    })}
                </div>
            )}

            {/* 액션 버튼 */}
            <div className="flex space-x-3">
                <button
                    onClick={() => navigate(`/inquiries/${inquiry.inquiryId}/edit`)}
                    className="flex-1 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                >
                    수정
                </button>
                <button
                    onClick={handleDelete}
                    className="flex-1 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
                >
                    삭제
                </button>
            </div>

            {/* 목록으로 */}
            <div className="text-right">
                <Link to="/inquiries/list" className="text-gray-500 hover:underline">
                    ← 목록으로
                </Link>
            </div>

            {/* 이미지 모달 */}
            {modalImage && (
                <ImageModalComponent
                    src={modalImage}
                    alt="첨부 이미지"
                    onClose={() => setModalImage(null)}
                />
            )}
        </div>
    );
}