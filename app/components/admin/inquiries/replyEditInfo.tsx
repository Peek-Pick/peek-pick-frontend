import { useEffect, useRef, useState } from "react";
import { fetchInquiryAnswer, updateInquiryAnswer } from "~/api/inquiries/inquiriesAPI";
import { useDeleteInquiryAnswer } from "~/hooks/inquiries/useInquiryMutation";

interface ReplyEditInfoProps {
    inquiryId: number;
    onSuccess: () => void;
}

const ReplyEditInfo = ({ inquiryId, onSuccess }: ReplyEditInfoProps) => {
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    const deleteReplyMutation = useDeleteInquiryAnswer();

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const fetchReplyContent = async () => {
            setIsLoading(true);
            setLoadError(null);
            try {
                const data = await fetchInquiryAnswer(inquiryId);
                setContent(data?.content ?? "");
            } catch (error: any) {
                setLoadError(error.message || "알 수 없는 오류가 발생했습니다.");
                setContent("");
            } finally {
                setIsLoading(false);
            }
        };
        fetchReplyContent();
    }, [inquiryId]);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [content]);

    const handleSubmit = async () => {
        if (!/[^\s]/.test(content)) {
            alert("답변 내용을 입력해주세요.");
            return;
        }
        if (!confirm("이 답변을 수정하시겠습니까?")) return;

        try {
            await updateInquiryAnswer(inquiryId, { content });
            alert("답변이 수정되었습니다.");
            onSuccess();
        } catch (error) {
            alert("답변 수정 중 오류가 발생했습니다.");
            console.error(error);
        }
    };

    const handleDelete = async () => {
        if (!confirm("이 답변을 삭제하시겠습니까? 삭제 후 복구할 수 없습니다.")) return;

        try {
            await deleteReplyMutation.mutateAsync(inquiryId);
            alert("답변이 삭제되었습니다.");
            onSuccess();
        } catch (error) {
            alert("답변 삭제 중 오류가 발생했습니다.");
            console.error(error);
        }
    };

    if (isLoading) {
        return (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                답변 내용을 불러오는 중입니다...
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="p-6 text-center text-red-500 dark:text-red-400">
                오류: {loadError}
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 h-full flex flex-col">
            <h2 className="text-lg font-bold text-gray-700 dark:text-white mb-6">답변 수정</h2>

            <div className="relative flex-grow">
        <textarea
            ref={textareaRef}
            className="w-full border border-gray-300 dark:border-gray-600 rounded p-3 pr-14 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white overflow-hidden"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="답변 내용을 수정하세요"
            disabled={isLoading}
            rows={1}
            style={{ minHeight: "300px" }}
        />
                <span className="absolute bottom-2 right-3 text-sm text-gray-400 dark:text-gray-500">
          {content.length}자
        </span>
            </div>

            <div className="flex justify-end mt-4 space-x-2">
                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    답변 수정
                </button>
                <button
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? "삭제 중..." : "답변 삭제"}
                </button>
            </div>
        </div>
    );
};

export default ReplyEditInfo;