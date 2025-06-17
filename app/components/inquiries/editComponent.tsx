import {type ChangeEvent, type FormEvent, useState} from "react";
import { useNavigate } from "react-router-dom";
import { Edit2 } from "lucide-react";
import { deleteImages } from "~/api/inquiriesAPI";
import { useQueryClient } from "@tanstack/react-query";
import { INQUIRY_TYPES } from "~/enums/inquiries/inquiry";

interface EditComponentProps {
    initialData: InquiryResponseDTO;
    onSubmit: (dto: InquiryRequestDTO, files: FileList | null) => Promise<void>;
}

function EditComponent({ initialData, onSubmit }: EditComponentProps) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [title, setTitle] = useState(initialData.title);
    const [content, setContent] = useState(initialData.content);
    const [type, setType] = useState<InquiryType>(initialData.type);
    const [existingUrls, setExistingUrls] = useState<string[]>([...initialData.imgUrls]);
    const [files, setFiles] = useState<FileList | null>(null);

    const API_URL = import.meta.env.VITE_API_URL?.replace("/api/v1", "") ?? "http://localhost:8080";

    const handleDeleteImage = async (url: string) => {
        if (!confirm("해당 이미지를 삭제하시겠습니까?")) return;
        try {
            await deleteImages(initialData.inquiryId, [url]);
            setExistingUrls((prev) => prev.filter((img) => img !== url));
            await queryClient.invalidateQueries({ queryKey: ["inquiries"] });
        } catch (err) {
            console.error("이미지 삭제 실패:", err);
            alert("이미지 삭제에 실패했습니다.");
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const dto: InquiryRequestDTO = {
            title,
            content,
            type,
            imgUrls: existingUrls,
        };

        try {
            await onSubmit(dto, files);
        } catch (err) {
            console.error("문의 수정 중 오류:", err);
            alert("문의 수정에 실패했습니다.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="sm:max-w-xl mx-auto p-4 space-y-6">
            <div className="flex items-center space-x-2 mb-2">
                <Edit2 className="text-yellow-500" />
                <h2 className="text-xl font-semibold text-gray-800">문의 수정</h2>
            </div>

            <div className="bg-white border rounded-2xl shadow-md px-4 py-6 space-y-4 w-full min-h-[60vh] sm:min-h-[50vh]">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="제목을 입력하세요"
                    className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    required
                />

                <select
                    value={type}
                    onChange={(e) => setType(e.target.value as InquiryType)}
                    className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
                    placeholder="문의 내용을 작성해주세요"
                    className="w-full border border-gray-300 p-3 rounded h-64 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    required
                />

                {existingUrls.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-4">
                        {existingUrls.map((url) => {
                            const imgSrc = url.startsWith("http") ? url : `${API_URL}${url}`;
                            return (
                                <div key={url} className="relative w-24 h-24 rounded overflow-hidden border border-gray-300 shadow-sm">
                                    <img
                                        src={imgSrc}
                                        alt="첨부 이미지"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src = "";
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteImage(url)}
                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-bl px-1.5 py-0.5 text-xs hover:bg-red-600"
                                    >
                                        ×
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div>
                    <label className="text-sm text-gray-600 mb-1 block">새 이미지 첨부</label>
                    <input
                        type="file"
                        multiple
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setFiles(e.target.files)}
                        className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0 file:text-sm file:font-semibold
            file:bg-yellow-50 file:text-yellow-600 hover:file:bg-yellow-100"
                    />
                </div>
            </div>

            <div className="flex justify-end space-x-3">
                <button
                    type="submit"
                    className="px-5 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                >
                    저장
                </button>
                <button
                    type="button"
                    onClick={() => navigate("/inquiries/list")}
                    className="px-5 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
                >
                    취소
                </button>
            </div>
        </form>
    );
}

export default EditComponent;