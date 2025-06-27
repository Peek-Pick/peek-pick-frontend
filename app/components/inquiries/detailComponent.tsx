import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageModalComponent from "~/components/common/ImageModalComponent";
import { Edit, MoreVertical, Trash, Check, Hourglass } from "lucide-react";
import { useDeleteInquiry } from "~/hooks/inquiries/useInquiryMutation";
import { INQUIRY_TYPES } from "~/enums/inquiries/inquiry";
import { InquiryLoading } from "~/util/loading/inquiryLoading";
import Swal from "sweetalert2";
import '~/util/swal/customSwal.css'

const API_URL = import.meta.env.VITE_API_URL?.replace("/api/v1", "") ?? "http://localhost";

interface Props {
    inquiry?: InquiryResponseDTO & { userNickname: string };
    navigate: (to: string) => void;
    isLoading: boolean;
}

function DetailComponent({ inquiry, navigate: navigateProp, isLoading }: Props) {
    if (isLoading) return <InquiryLoading />;
    if (!inquiry)
        return (
            <p className="text-center p-4 text-red-500 text-base sm:text-lg">
                Failed to load inquiry data.
            </p>
        );

    const [modalImage, setModalImage] = useState<string | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const deleteInquiryMutation = useDeleteInquiry();
    const navigate = useNavigate();

    const handleDelete = async () => {
        const result =
            await Swal.fire({
                title: "Are you sure you want to delete your inquiry?",
                text: "Once deleted, the changes cannot be undone.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Delete",
                cancelButtonText: "Cancel",
                    customClass: {
                        popup: "custom-popup",
                        title: "custom-title",
                        actions: "custom-actions",
                        confirmButton: "custom-confirm-button",
                    },
            });

        if (!result.isConfirmed) return;

        try {
            await deleteInquiryMutation.mutateAsync(inquiry.inquiryId);
            await Swal.fire({
                title: "Inquiry deleted successfully",
                icon: "success",
                confirmButtonText: "OK",
                customClass: {
                    popup: 'custom-popup',
                    title: 'custom-title',
                    actions: 'custom-actions',
                    confirmButton: 'custom-confirm-button',
                },
            });
            navigate("/inquiries/list");
        } catch (error) {
            console.error("Delete failed:", error);
            await Swal.fire({
                title: "Failed to delete inquiry",
                icon: "error",
                confirmButtonText: "OK",
                customClass: {
                    popup: 'custom-popup',
                    title: 'custom-title',
                    actions: 'custom-actions',
                    confirmButton: 'custom-confirm-button',
                },
            });
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };
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

        return isToday
            ? `${pad(d.getHours())}:${pad(d.getMinutes())}`
            : `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    const isAnswered = inquiry.status === "ANSWERED";
    const statusLabel = isAnswered ? "Answered" : "Waiting";

    return (
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow px-4 pt-4 pb-6 space-y-4 relative">
            {modalImage && (
                <ImageModalComponent src={modalImage} alt="Attached Image" onClose={() => setModalImage(null)} />
            )}
            {/* Top Navigation */}
            <div className="flex items-center justify-between text-gray-600">
                <button
                    onClick={() => {
                        if (window.history.length > 1) navigate(-1);
                        else navigate("/inquiries/list");
                    }}
                    className="text-yellow-500 hover:text-yellow-600 p-1"
                    aria-label="Back"
                >
                    <svg className="w-6 h-6 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* Center: Inquiry Type */}
                <div className="flex-1 text-center text-sm text-yellow-500 font-semibold truncate py-0.5">{typeLabel}</div>

                {/* Right: More Menu */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setMenuOpen((prev) => !prev)}
                        className="text-yellow-500 hover:text-yellow-600 p-1"
                        aria-label="More options"
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
                                Modify
                            </button>
                            <button
                                className="w-full px-3 py-2 text-left hover:bg-gray-100 text-red-600 flex items-center gap-2"
                                onClick={handleDelete}
                            >
                                <Trash className="w-4 h-4" />
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Profile, Nickname & Status */}
            <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center gap-2">
                    <img
                        src={`http://localhost/${inquiry.userProfileImgUrl}`}
                        alt="Profile"
                        className="w-11 h-11 rounded-full object-cover border border-gray-300"
                    />
                    <span className="font-semibold text-base ml-0.5">{inquiry.userNickname}</span>
                </div>
                <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 font-semibold text-xs transition-colors ${
                        isAnswered
                            ? "bg-yellow-400 hover:bg-yellow-500 text-white"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-500"
                    }`}
                >
          {isAnswered ? <Check className="w-3.5 h-3.5" /> : <Hourglass className="w-3.5 h-3.5" />}
                    {statusLabel}
        </span>
            </div>

            {/* Created and Modified Dates */}
            <div className="flex justify-end text-xs text-gray-500 mb-2.5 gap-2 leading-none">
        <span>
          Created: <span className="bg-gray-100 px-0.5 py-0.5 text-gray-700">{formatDate(inquiry.regDate)}</span>
        </span>
                {inquiry.modDate !== inquiry.regDate && (
                    <span>
            Modified: <span className="bg-gray-100 px-0.5 py-0.5 text-gray-700">{formatDate(inquiry.modDate)}</span>
          </span>
                )}
            </div>

            <hr className="border-t border-gray-200" />

            {/* Content */}
            <div className="text-gray-800 whitespace-pre-line leading-relaxed mt-4">{inquiry.content}</div>

            {/* Images */}
            {inquiry.imgUrls?.length > 0 && (
                <>
                    <hr className="border-t border-dashed border-gray-300 my-4" />
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                        {inquiry.imgUrls.map((url) => {
                            const src = url.startsWith("http") ? url : `${API_URL}${url}`;
                            return (
                                <button
                                    key={url}
                                    onClick={() => setModalImage(src)}
                                    className="relative w-full aspect-square overflow-hidden rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
                                >
                                    <img
                                        src={src}
                                        alt="Attached Image"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src = "";
                                        }}
                                    />
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}

export default DetailComponent;