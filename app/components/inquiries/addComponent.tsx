import { type ChangeEvent, type FormEvent, useEffect, useRef, useState } from "react";
import { MessageCirclePlus } from "lucide-react";
import { INQUIRY_TYPES } from "~/enums/inquiries/inquiry";

interface AddComponentProps {
    onSubmit: (dto: InquiryRequestDTO, files: FileList | null) => Promise<void>;
    userEmail: string;
}

function AddComponent({ onSubmit, userEmail }: AddComponentProps) {
    const [content, setContent] = useState("");
    const [type, setType] = useState<InquiryType>("ACCOUNT");
    const [files, setFiles] = useState<FileList | null>(null);
    const [agree, setAgree] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        if (!agree) {
            alert("개인정보 수집 및 이용에 동의해 주세요.");
            return;
        }

        const dto: InquiryRequestDTO = {
            content,
            type,
            imgUrls: [],
        };

        await onSubmit(dto, files);
    }

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [content]);

    return (
        <div className="w-full max-w-2xl mx-auto px-4 bg-white rounded-2xl shadow pt-4 pb-6 relative space-y-4">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center space-x-2 mb-4 mt-1.5">
                    <MessageCirclePlus className="text-yellow-500" />
                    <h2 className="text-xl font-semibold text-gray-800">문의 작성</h2>
                </div>

                <div className="bg-white border rounded-2xl shadow-md px-4 py-6 space-y-4 w-full sm:min-h-[50vh]">
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
                        ref={textareaRef}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="문의 내용을 작성해주세요"
                        className="w-full border border-gray-300 p-3 rounded resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400 overflow-hidden leading-relaxed"
                        rows={1}
                        style={{ minHeight: "300px" }}
                        required
                    />

                    <div>
                        <label className="text-sm text-gray-600 mb-1 block">이미지 첨부</label>
                        <input
                            type="file"
                            multiple
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setFiles(e.target.files)}
                            className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                                file:rounded-md file:border-0 file:text-sm file:font-semibold
                                file:bg-yellow-500 file:text-white hover:file:bg-yellow-600 cursor-pointer"
                        />
                    </div>
                </div>

                <div>
                    <label className="block mb-1 font-semibold text-gray-700">이용자 이메일</label>
                    <input
                        type="email"
                        value={userEmail}
                        readOnly
                        className="w-full p-3 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
                    />
                </div>

                <div className="mt-4">
                    <label className="inline-flex items-center space-x-2 cursor-pointer select-none text-sm font-normal">
                        <input
                            type="checkbox"
                            checked={agree}
                            onChange={(e) => setAgree(e.target.checked)}
                            className="rounded border-gray-300 text-yellow-500 focus:ring-yellow-400"
                            required
                        />
                        <span>개인정보 수집 및 이용동의 (필수)</span>
                    </label>

                    <div
                        className="mt-2 w-full p-3 border border-gray-300 rounded bg-gray-100 text-gray-600 text-xs font-sans leading-relaxed whitespace-pre-line select-none"
                        style={{ userSelect: "none", pointerEvents: "none", boxShadow: "none" }}
                    >
                        문의 처리를 위해 이메일, 문의내용에 포함된 개인정보를 수집하며, 개인정보처리방침에 따라 3년후 파기됩니다.
                        개인정보 수집 및 이용을 거부할 수 있으며, 거부할 경우 문의가 불가합니다.
                    </div>
                </div>

                <div className="flex justify-end mt-6">
                    <button
                        type="submit"
                        disabled={!agree}
                        className={`w-full px-8 py-3 rounded-full font-semibold text-white transition 
                            ${agree ? "bg-yellow-500 hover:bg-yellow-600 cursor-pointer" : "bg-gray-300 cursor-not-allowed"}`}
                    >
                        문의 접수하기
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddComponent;