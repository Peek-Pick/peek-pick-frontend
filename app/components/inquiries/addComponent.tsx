import { type ChangeEvent, type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCirclePlus } from "lucide-react";
import {INQUIRY_TYPES} from "~/enums/inquiries/inquiry";

interface AddComponentProps {
    onSubmit: (dto: InquiryRequestDTO, files: FileList | null) => Promise<void>;
}

function AddComponent({ onSubmit }: AddComponentProps) {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [type, setType] = useState<InquiryType>("ACCOUNT");
    const [files, setFiles] = useState<FileList | null>(null);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        const dto: InquiryRequestDTO = {
            title,
            content,
            type,
            imgUrls: [],
        };

        await onSubmit(dto, files); // 위임
    }

    return (
        <form onSubmit={handleSubmit} className="sm:max-w-xl mx-auto p-4 space-y-6">
            <div className="flex items-center space-x-2 mb-2">
                <MessageCirclePlus className="text-yellow-500" />
                <h2 className="text-xl font-semibold text-gray-800">문의 작성</h2>
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

                <div>
                    <label className="text-sm text-gray-600 mb-1 block">이미지 첨부</label>
                    <input
                        type="file"
                        multiple
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setFiles(e.target.files)
                        }
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

export default AddComponent;