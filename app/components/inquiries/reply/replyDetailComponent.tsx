import { useEffect, useState } from "react";
import { fetchInquiryAnswer } from "~/api/inquiries/inquiriesAPI";
import { useTranslation } from "react-i18next";

interface ReplyDetailProps {
    inquiryId: number;
}

function ReplyDetailComponent({ inquiryId }: ReplyDetailProps) {
    // 국제화
    const { t } = useTranslation();
    const [content, setContent] = useState<string | null>(null);
    const [modDate, setModDate] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetchInquiryAnswer(inquiryId);
                setContent(res?.content ?? null);
                setModDate(res?.regDate ?? null);
            } catch (e: any) {
                setError(e.message ?? t("inquiry.answer.loadFail"));
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [inquiryId, t]);

    const formatDate = (iso: string) => {
        const d = new Date(iso);
        const pad = (n: number) => n.toString().padStart(2, "0");
        return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    if (isLoading || error || !content) return null;

    return (
        <div className="max-w-3xl mx-auto bg-white rounded-2xl border-2 border-yellow-400 px-4 pt-4 pb-6 space-y-4 mt-6 shadow-sm">
            <div className="relative flex justify-between items-center mb-2.5">
                <div className="flex items-center gap-2">
                    <img
                        src="/icons/admin_icon_img.png"
                        alt="profile"
                        className="w-11 h-11 pt-0.5 pl-1 rounded-full object-cover overflow-visible bg-yellow-500 border border-gray-300"
                    />
                    <span className="font-semibold text-base ml-0.5">{t("inquiry.answer.admin")}</span>
                </div>

                <div className="absolute bottom-1 right-0 text-xs text-gray-500 gap-2 leading-none">
                    <span>
                        {t("inquiry.answer.posted")}
                        <span className="bg-gray-100 px-0.5 py-0.5 text-gray-700">
                            {modDate ? formatDate(modDate) : "-"}
                        </span>
                    </span>
                </div>
            </div>

            <hr className="border-t border-gray-200" />

            <div className="text-gray-800 whitespace-pre-line leading-relaxed mt-4">
                {content}
            </div>
        </div>
    );
}

export default ReplyDetailComponent;