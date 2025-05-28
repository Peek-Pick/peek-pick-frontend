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
                review_id: review.review_id,
                reason: selectedReason,
            };
            await reportReview(review.review_id, dto);
            alert("신고가 접수되었습니다.");
            closeReport();
        } catch (err) {
            console.error(err);
            alert("이미 신고한 리뷰입니다.");
            closeReport();
        } finally {
            setIsReporting(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 p-4 flex flex-col items-center">
            <div className="w-full max-w-md sm:max-w-xl md:max-w-3xl space-y-2">
                <div className="w-full max-w-md sm:max-w-xl md:max-w-3xl mx-auto bg-white shadow-md rounded-lg space-y-3 p-4">
                    {/* 작성자 정보 */}
                    <div className="flex items-center space-x-3 mb-2">
                    <img src="/default.jpg" alt="프로필" className="w-10 h-10 rounded-full" />
                    <p className="font-semibold text-gray-800 text-sm sm:text-base">
                        {review.nickname ?? "사용자"}
                    </p>
                </div>

                {/* 별점과 작성일 */}
                <div className="flex justify-between items-center mb-4 text-xs sm:text-sm">
                    <div className="flex space-x-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={`text-lg ${i < review.score ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                        ))}
                    </div>
                    <p className="text-gray-500">
                        작성일: {new Date(review.reg_date).toLocaleDateString()}
                    </p>
                </div>

                {/* 이미지 */}
                {review.images?.length && (
                    <div
                        className="flex space-x-2 mb-4 overflow-x-auto no-scrollbar"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                        {review.images.map((img) => (
                            <img key={img.img_id} src={`http://localhost/s_${img.img_url}`}
                                 alt="리뷰이미지" className="w-24 h-24 sm:w-24 sm:h-24 rounded-lg object-cover flex-shrink-0"/>
                        ))}
                    </div>
                )}

                {/* 리뷰 텍스트 */}
                <p className="text-gray-800 whitespace-pre-wrap mb-4 text-base sm:text-lg">{review.comment}</p>


                {/* 태그 */}
                {review.tag_list?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {review.tag_list.map((tag) => (
                            <span
                                key={tag.tag_id}
                                className="px-3 py-1 bg-white border border-gray-200 rounded-md text-sm text-gray-800 shadow-sm hover:shadow-md transition duration-200"
                            >
                            #{tag.tag_name}
                        </span>
                        ))}
                    </div>
                )}

                {/* 추천수 + 신고하기 */}
                <div className="flex justify-between items-center text-sm sm:text-base">
                    <button
                        onClick={() => toggleLikeMutation.mutate()}
                        className={`text-sm ${review.is_liked ? "text-red-500" : "text-gray-600"}`}
                        disabled={toggleLikeMutation.isPending}
                    >
                        리뷰 좋아요 {review.is_liked ? "❤️" : "🤍"}{review.recommend_cnt}
                    </button>
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
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white p-6 rounded shadow w-full max-w-xs sm:max-w-sm">
                            <h3 className="font-semibold mb-4 text-base sm:text-lg">신고 사유 선택</h3>
                            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                                {(Object.keys(ReportReasonDescriptions) as ReportReason[]).map((r) => (
                                    <label key={r} className="flex items-center cursor-pointer">
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
                                    className="px-3 py-1 border rounded text-sm sm:text-base"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={handleReport}
                                    disabled={!selectedReason || isReporting}
                                    className="px-3 py-1 bg-red-500 text-white rounded disabled:opacity-50 text-sm sm:text-base"
                                >
                                    {isReporting ? "신고중..." : "신고하기"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
        </div>
    );
}