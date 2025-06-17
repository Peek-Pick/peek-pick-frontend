import { useState, useEffect, useRef } from "react";
import { useCreateInquiryAnswer } from "~/hooks/inquiries/useInquiryMutation";

interface ReplyAddInfoProps {
    inquiryId: number;
    onSuccess: () => void;
}

const ReplyAddInfo = ({ inquiryId, onSuccess }: ReplyAddInfoProps) => {
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const addReplyMutation = useCreateInquiryAnswer();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = async () => {
        const hasValidContent = /[^\s]/.test(content);
        if (!hasValidContent) {
            alert("답변 내용을 입력해주세요.");
            return;
        }

        const confirmed = confirm("이 답변을 등록하시겠습니까?");
        if (!confirmed) return;

        setIsSubmitting(true);
        try {
            await addReplyMutation.mutateAsync({
                inquiryId,
                data: { content },
            });
            alert("답변이 등록되었습니다.");
            setContent("");
            onSuccess();
        } catch (error) {
            alert("답변 등록 중 오류가 발생했습니다.");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [content]);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 flex flex-col h-full">
            <h2 className="text-lg font-bold text-gray-700 dark:text-white mb-6">답변 등록</h2>

            <div className="relative flex-grow mb-2">
                <textarea
                    ref={textareaRef}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded p-3 pr-14 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white overflow-hidden"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="답변 내용을 입력하세요"
                    disabled={isSubmitting}
                    rows={1}
                    style={{ minHeight: "300px" }}
                />
                <span className="absolute bottom-2 right-3 text-sm text-gray-400 dark:text-gray-500">
                    {content.length}자
                </span>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold  py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? "등록 중..." : "답변 등록"}
                </button>
            </div>
        </div>
    );
};

export default ReplyAddInfo;