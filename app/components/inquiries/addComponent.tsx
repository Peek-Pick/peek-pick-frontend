import { type ChangeEvent, type FormEvent, useEffect, useRef, useState } from "react";
import { MessageCirclePlus } from "lucide-react";
import { INQUIRY_TYPES } from "~/enums/inquiries/inquiry";
import { InquiryLoading } from "~/util/loading/inquiryLoading";
import Swal from "sweetalert2";
import '~/util/swal/customSwal.css'
import { useTranslation } from "react-i18next";

interface AddComponentProps {
    onSubmit: (dto: InquiryRequestDTO, files: FileList | null) => Promise<void>;
    userEmail: string;
    isLoading: boolean;
}

function AddComponent({ onSubmit, userEmail, isLoading }: AddComponentProps) {
    const { t } = useTranslation();
    const [content, setContent] = useState("");
    const [type, setType] = useState<InquiryType>("ACCOUNT");
    const [files, setFiles] = useState<FileList | null>(null);
    const [agree, setAgree] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [content]);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!agree) {
            await Swal.fire({
                title: t('inquiry.agreeAlertTitle'),
                icon: "warning",
                confirmButtonText: t('confirm'),
                customClass: {
                    popup: "custom-popup",
                    title: "custom-title",
                    actions: "custom-actions",
                    confirmButton: "custom-confirm-button",
                },
            });
            return;
        }

        const dto: InquiryRequestDTO = {
            content,
            type,
            imgUrls: [],
        };

        await onSubmit(dto, files);
    }

    if (isLoading) return <InquiryLoading />;

    return (
        <div className="w-full max-w-2xl mx-auto px-4 bg-white rounded-2xl shadow pt-4 pb-6 relative space-y-4">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center space-x-2 mb-4 mt-1.5">
                    <MessageCirclePlus className="text-yellow-500" />
                    <h2 className="text-xl font-semibold text-gray-800">
                        {t('inquiry.title')}
                    </h2>
                </div>

                <div className="bg-white border rounded-2xl shadow-md px-4 py-6 space-y-4 w-full sm:min-h-[50vh]">
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value as InquiryType)}
                        className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    >
                        {INQUIRY_TYPES.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {t(`inquiry.types.${opt.value}`)}
                            </option>
                        ))}
                    </select>

                    <textarea
                        ref={textareaRef}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={t('inquiry.placeholder')}
                        className="w-full border border-gray-300 p-3 rounded resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400 overflow-hidden leading-relaxed"
                        rows={1}
                        style={{ minHeight: "300px" }}
                        required
                    />

                    <div>
                        <label className="text-sm text-gray-600 mb-1 block">
                            {t('inquiry.attachImages')}
                        </label>
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
                    <label className="block mb-1 font-semibold text-gray-700">{t('inquiry.emailLabel')}</label>
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
                        <span>{t('inquiry.privacyAgreement')}</span>
                    </label>

                    <div
                        className="mt-2 w-full p-3 border border-gray-300 rounded bg-gray-100 text-gray-600 text-xs font-sans leading-relaxed whitespace-pre-line select-none"
                        style={{ userSelect: "none", pointerEvents: "none", boxShadow: "none" }}
                    >
                        {t('inquiry.privacyNotice')}
                    </div>
                </div>

                <div className="flex justify-end mt-6">
                    <button
                        type="submit"
                        disabled={!agree}
                        className={`w-full px-8 py-3 rounded-full font-semibold text-white transition 
                            ${agree ? "bg-yellow-500 hover:bg-yellow-600 cursor-pointer" : "bg-gray-300 cursor-not-allowed"}`}
                    >
                        {t('inquiry.submit')}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddComponent;