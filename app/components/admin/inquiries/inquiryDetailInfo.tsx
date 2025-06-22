import { useState } from "react";
import ImageModalComponent from "~/components/common/ImageModalComponent";

interface InquiryDetailInfoProps {
    data?: InquiryResponseDTO;
}

const API_URL = import.meta.env.VITE_API_URL?.replace("/api/v1", "") ?? "http://localhost";

const InquiryDetailInfo = ({ data }: InquiryDetailInfoProps) => {
    const [modalImage, setModalImage] = useState<string | null>(null);
    if (!data) return null;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
            <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-700 dark:text-white">문의 내용</h2>
            </div>

            {/* 본문 */}
            <div className="prose prose-sm prose-gray mt-2 max-w-none whitespace-pre-wrap">
                {data.content.split('\n').map((line, idx) => (
                    <span key={idx}>
                        {line}
                        <br />
                    </span>
                ))}
            </div>

            {/* 점선 구분선 (이미지가 있을 때만 표시) */}
            {data.imgUrls && data.imgUrls.length > 0 && (
                <hr className="border-t border-dashed border-gray-200 dark:border-gray-600 my-4" />
            )}

            {/* 이미지 그리드 */}
            {data.imgUrls && data.imgUrls.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 pt-2">
                    {data.imgUrls.map((url) => {
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
};

export default InquiryDetailInfo;