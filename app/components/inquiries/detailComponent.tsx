import type { InquiryResponseDTO } from "~/types/inquiries";
import { deleteInquiry } from "~/api/inquiriesAPI";
import { Link } from "react-router-dom";

const API_URL =
    import.meta.env.VITE_API_URL?.replace("/api/v1", "") ??
    "http://localhost:8080";

interface Props {
    inquiry: InquiryResponseDTO;
    navigate: (to: string) => void;
}

function DetailComponent({ inquiry, navigate }: Props) {
    const handleDelete = async () => {
        const ok = confirm("정말 삭제하시겠습니까?");
        if (!ok) return;
        await deleteInquiry(inquiry.inquiryId);
        navigate("/inquiries/list");
    };

    const handleEdit = () => {
        navigate(`/inquiries/${inquiry.inquiryId}/edit`);
    };

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">{inquiry.title}</h1>
            <p className="text-sm text-gray-600">
                유형: {inquiry.type} | 등록일:{" "}
                {new Date(inquiry.regDate).toLocaleString()}
            </p>
            <p>{inquiry.content}</p>

            {Array.isArray(inquiry.imgUrls) && inquiry.imgUrls.length > 0 && (
                <div className="flex space-x-2">
                    {inquiry.imgUrls
                        .filter((url): url is string => typeof url === "string" && url.trim() !== "")
                        .map((url) => {
                            const imgSrc = url.startsWith("http")
                                ? url
                                : `${API_URL}${url}`;

                            return (
                                <img
                                    key={url}
                                    src={imgSrc}
                                    className="w-24 h-24 object-cover rounded"
                                    alt="첨부 이미지"
                                    onError={(e) => {
                                        e.currentTarget.src = "";
                                    }}
                                />
                            );
                        })}
                </div>
            )}

            <div className="space-x-2">
                <button
                    onClick={handleEdit}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                    수정
                </button>
                <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded"
                >
                    삭제
                </button>
            </div>

            <div>
                <Link to="/inquiries/list" className="text-gray-600">
                    ← 목록으로
                </Link>
            </div>
        </div>
    );
}

export default DetailComponent;
