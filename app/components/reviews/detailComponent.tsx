import {reportReview, toggleReview} from "~/api/reviews/reviewAPI";
import {useState} from "react";
import {useMutation, useQueryClient} from "@tanstack/react-query";

export interface ReviewProps {
    review?: ReviewDetailDTO
}

enum ReportReason {
    POLITICS = "POLITICS",
    HATE = "HATE",
    DEFAMATION = "DEFAMATION",
    PROFANITY = "PROFANITY"
}

const ReportReasonDescriptions: Record<ReportReason, string> = {
    [ReportReason.POLITICS]: "정치",
    [ReportReason.HATE]: "혐오",
    [ReportReason.DEFAMATION]: "비방",
    [ReportReason.PROFANITY]: "욕설",
};

export default function DetailComponent({review}: ReviewProps) {
    if (!review) {
        return <div>리뷰 정보를 불러올 수 없습니다.</div>;
    }

    const [isReportOpen, setIsReportOpen] = useState(false);
    const [selectedReason, setSelectedReason] = useState<ReportReason | "">("");
    const [isReporting, setIsReporting] = useState(false);

    const queryClient = useQueryClient();

    const toggleLikeMutation = useMutation({
        mutationFn: () => toggleReview(review.review_id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["review"],
            });
        },
        onError: () => {
            alert("좋아요 처리 중 오류가 발생했습니다");
        }
    })

    const openReport = () => setIsReportOpen(true);

    const closeReport = () => {
        setSelectedReason("");
        setIsReportOpen(false);
    };

    const handleReport = async () => {
        if (!selectedReason) return;
        setIsReporting(true);
        try {
            const dto: ReviewReportDTO = {
                reviewId: review.review_id,
                reason: selectedReason,
            };
            await reportReview(review.review_id, dto);
            alert("신고가 접수되었습니다.");
            closeReport();
        } catch (err) {
            console.error(err);
            alert("이미 신고한 리뷰입니다.");
        } finally {
            setIsReporting(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 p-4">
            <div className="max-w-md w-full mx-auto bg-white shadow-md rounded-lg space-y-3 p-4">
                {/* 작성자 정보 */}
                <div className="flex items-center space-x-3">
                    <img
                        src={'/default.jpg'}
                        alt="프로필 이미지"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="text-sm">
                        <p className="font-semibold text-gray-800">{review.nickname}</p>
                        <p className="text-xs text-gray-500">
                            작성일: {new Date(review.reg_date).toLocaleDateString()}
                            {review.mod_date && review.mod_date !== review.reg_date && (
                                <><br />수정일: {new Date(review.mod_date).toLocaleDateString()}</>
                            )}
                        </p>
                    </div>
                </div>

                {/* 별점 */}
                <div className="flex items-center space-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <span
                            key={i}
                            className={`text-lg ${i < review.score ? 'text-yellow-400' : 'text-gray-300'}`}
                        >
                            ★
                        </span>
                    ))}
                </div>

                {/* 리뷰 텍스트 */}
                <p className="whitespace-pre-wrap text-sm text-gray-800">
                    {review.comment}
                </p>

                {/* 리뷰 이미지 */}
                {review.images && review.images.length > 0 && (
                    <div className="flex space-x-2 overflow-x-auto py-2">
                        {review.images.map((img, idx) => (
                            <img
                                key={idx}
                                src={'/example.jpg'}
                                alt={`리뷰 이미지 ${idx + 1}`}
                                className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                            />
                        ))}
                    </div>
                )}

                {/* 추천수 + 신고하기 */}
                <div className="flex justify-between items-center text-sm text-gray-600 pt-2">
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => toggleLikeMutation.mutate()}
                            className={`text-sm ${review.is_liked ? "text-red-500" : "text-gray-600"}`}
                            disabled={toggleLikeMutation.isPending}
                        >
                             리뷰 좋아요 {review.is_liked ? "❤️" : "🤍"}{review.recommend_cnt}
                        </button>
                    </div>
                    <button
                        className="text-red-500 hover:underline"
                        onClick={openReport}
                        type="button"
                    >
                        신고하기
                    </button>
                </div>

                {/* 신고 모달 */}
                {isReportOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-80 space-y-4">
                            <h3 className="text-lg font-semibold">신고 사유 선택</h3>
                            <div className="space-y-2">
                                {(Object.keys(ReportReasonDescriptions) as ReportReason[]).map((r) => (
                                    <label key={r} className="flex items-center">
                                        <input
                                            type="radio"
                                            name="reportReason"
                                            value={r}
                                            checked={selectedReason === r}
                                            onChange={() => setSelectedReason(r)}
                                            className="mr-2"
                                        />
                                        <span>{ReportReasonDescriptions[r]}</span>
                                    </label>
                                ))}
                            </div>
                            <div className="flex justify-end space-x-2 pt-4">
                                <button
                                    onClick={closeReport}
                                    className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={handleReport}
                                    disabled={!selectedReason || isReporting}
                                    className="px-3 py-1 text-sm bg-red-500 text-white rounded disabled:opacity-50 hover:bg-red-600"
                                >
                                    {isReporting ? "신고중..." : "신고하기"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}