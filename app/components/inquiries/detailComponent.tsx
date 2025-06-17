import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageModalComponent from "~/components/common/ImageModalComponent";
import {Edit, MoreVertical, Trash} from "lucide-react";
import {useDeleteInquiry} from "~/hooks/inquiries/useInquiryMutation";
import {INQUIRY_TYPES} from "~/enums/inquiries/inquiry";

const API_URL = import.meta.env.VITE_API_URL?.replace("/api/v1", "") ?? "http://localhost:8080";

interface Props {
    inquiry: InquiryResponseDTO & { userNickname: string };
    navigate: (to: string) => void;
}

function DetailComponent({ inquiry, navigate: navigateProp }: Props) {
    const [modalImage, setModalImage] = useState<string | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const deleteInquiryMutation = useDeleteInquiry();
    const navigate = useNavigate();

    const handleDelete = async () => {
        if (!confirm("정말 삭제하시겠습니까?")) return;
        try {
            await deleteInquiryMutation.mutateAsync(inquiry.inquiryId);
            navigate("/inquiries/list");
        } catch (error) {
            alert("삭제 중 오류가 발생했습니다.");
        }
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const typeLabel = INQUIRY_TYPES.find((t) => t.value === inquiry.type)?.label ?? inquiry.type;

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
            const yyyy = d.getFullYear();
            const mm = pad(d.getMonth() + 1);
            const dd = pad(d.getDate());
            const hh = pad(d.getHours());
            const mi = pad(d.getMinutes());
            return `${yyyy}.${mm}.${dd} ${hh}:${mi}`;
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow px-4 pt-4 pb-6 relative space-y-4">
            {/* 상단 네비 영역 */}
            <div className="flex items-center justify-between text-gray-600">
                {/* 왼쪽: 뒤로가기 */}
                <button
                    onClick={() => {
                        if (window.history.length > 1) { navigate(-1); }
                        else { navigate("/inquiries/list"); }
                    }}
                    className="text-yellow-500 hover:text-yellow-600 p-1"
                    aria-label="목록으로"
                >
                    <span className="text-2xl w-6 h-6 flex items-center justify-center">&lt;</span>
                </button>

                {/* 중앙: 문의번호 */}
                <div className="flex-1 text-center text-sm text-gray-400 truncate py-0.5">
                    문의사항 #{inquiry.inquiryId}
                </div>

                {/* 오른쪽: 더보기 메뉴 */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setMenuOpen((prev) => !prev)}
                        className="text-yellow-500 hover:text-yellow-600 p-1"
                        aria-label="더보기"
                    >
                        <MoreVertical className="w-6 h-6" />
                    </button>
                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-28 bg-white border rounded shadow z-10">
                            <button
                                className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                                onClick={() => navigate(`/inquiries/${inquiry.inquiryId}/edit`)}
                            >
                                <Edit className="w-4 h-4" />
                                수정
                            </button>
                            <button
                                className="w-full px-3 py-2 text-left hover:bg-gray-100 text-red-600 flex items-center gap-2"
                                onClick={handleDelete}
                            >
                                <Trash className="w-4 h-4" />
                                삭제
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* 제목 및 메타 정보 */}
            <div className="mb-0.5 mt-1">
                <h1 className="text-lg sm:text-xl font-extrabold text-gray-900 break-words leading-tight">
                    <span className="text-yellow-500 mr-2">[{typeLabel}]</span>{inquiry.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3 mt-2 ml-1 text-sm text-gray-600">
                    <span className="font-semibold">{inquiry.userNickname}</span>
                    <span className="text-gray-300">|</span>
                    <span>작성일:
                        <span className="ml-1 bg-gray-200 rounded px-1.5 py-0.5">
                            {formatDate(inquiry.regDate)}
                        </span>
                    </span>

                    {inquiry.modDate !== inquiry.regDate && (
                        <>
                            <span>수정일:
                                <span className="ml-1 bg-gray-200 rounded px-1.5 py-0.5">
                                    {formatDate(inquiry.modDate)}
                                </span>
                            </span>
                        </>
                    )}
                </div>
            </div>

            <hr className="border-t border-gray-200 my-2" />
            {/* 본문 */}
            <div className="prose prose-sm prose-gray mt-5 max-w-none whitespace-pre-wrap">
                {inquiry.content.split('\n').map((line, idx) => (
                    <span key={idx}>{line}
                        <br />
                    </span>
                ))}
            </div>

            {/* 이미지 그리드 */}
            {inquiry.imgUrls && inquiry.imgUrls.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 pt-2">
                    {inquiry.imgUrls.map((url) => {
                        const src = url.startsWith("http") ? url : `${API_URL}${url}`;
                        return (
                            <button
                                key={url}
                                onClick={() => setModalImage(src)}
                                className="relative w-full aspect-square overflow-hidden rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
                                type="button"
                            >
                                <img
                                    src={src}
                                    alt="첨부 이미지"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = "";
                                    }}
                                />
                            </button>
                        );
                    })}
                </div>
            )}

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

export default DetailComponent