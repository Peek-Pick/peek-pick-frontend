import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProductPreviews, toggleReview, reportReview } from "~/api/reviews/reviewAPI";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProductIdByBarcode} from "~/api/reviews/reviewAPI"

interface PreviewProps {
    barcode: string;
}

enum ReportReason {
    POLITICS = "POLITICS",
    HATE = "HATE",
    DEFAMATION = "DEFAMATION",
    PROFANITY = "PROFANITY",
}

const ReportReasonDescriptions: Record<ReportReason, string> = {
    [ReportReason.POLITICS]: "정치",
    [ReportReason.HATE]: "혐오",
    [ReportReason.DEFAMATION]: "비방",
    [ReportReason.PROFANITY]: "욕설",
};

export default function PreviewComponent({ barcode }: PreviewProps) {
    // barcode로 productId 받아오기
    const [productId, setProductId] = useState<number | null>(null);

    useEffect(() => {
        if (!barcode) return;

        getProductIdByBarcode(barcode)
            .then((response) => {
                setProductId(Number(response.data));
                console.log(response.data)})
    }, [barcode]);

    const { data, isLoading, isError } = useQuery<ReviewDetailDTO[]>({
        queryKey: ["previews", productId],
        queryFn: () => getProductPreviews(productId!),
        enabled: Boolean(productId)
    });

    if (isLoading)
        return <p className="text-center p-4 text-base sm:text-lg">로딩 중입니다</p>;
    if (isError)
        return<p className="text-center p-4 text-red-500 text-base sm:text-lg">리뷰를 불러오지 못했습니다</p>
    if (!data || data.length === 0)
        return <p className="text-center p-4 text-gray-500 text-base sm:text-lg">아직 작성된 리뷰가 없습니다.</p>;

    return (
        <div className="w-full min-h-screen bg-gray-50 p-4 flex flex-col items-center">
            {/* 헤더: 타이틀 + 링크 */}
            <div className="flex justify-between items-center mb-4">
                <Link
                    to={`/reviews/product/${barcode}`}
                    className="text-sm text-blue-500 hover:underline"
                >
                    리뷰 전체보기
                </Link>
            </div>

            {/* 리뷰 목록 */}
            <div className="w-full max-w-md sm:max-w-xl md:max-w-3xl space-y-2">
                {data.map((review) => (
                    <ReviewItem key={review.review_id} review={review} productId={productId!} />
                ))}
            </div>
        </div>
    );
}

interface ReviewItemProps {
    review: ReviewDetailDTO;
    productId: number;
}

function ReviewItem({ review, productId }: ReviewItemProps) {
    const queryClient = useQueryClient();

    const [isReportOpen, setIsReportOpen] = useState(false);
    const [selectedReason, setSelectedReason] = useState<ReportReason | "">("");
    const [isReporting, setIsReporting] = useState(false);

    const reportMutation = useMutation({
        mutationFn: () =>
            reportReview(review.review_id, { review_id: review.review_id, reason: selectedReason as ReportReason }),
        onSuccess: () => {
            alert("신고가 접수되었습니다.");
            closeReport();
        },
        onError: () => {
            alert("이미 신고한 리뷰입니다.");
            closeReport();
        },
    });

    const toggleLikeMutation = useMutation({
        mutationFn: (id: number) => toggleReview(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["previews", productId] });
            queryClient.invalidateQueries({ queryKey: ["productReviews", productId] });
        },
        onError: () => {
            alert("좋아요 처리 중 오류가 발생했습니다");
        },
    });

    const openReport = () => setIsReportOpen(true);

    const closeReport = () => {
        setIsReportOpen(false);
        setSelectedReason("");
        setIsReporting(false);
    };

    const handleReport = () => {
        if (!selectedReason) return;

        setIsReporting(true);
        reportMutation.mutate();
    };

    return (
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

            {/* 좋아요 & 신고 */}
            <div className="flex justify-between items-center text-sm sm:text-base">
                <button
                    onClick={() => toggleLikeMutation.mutate(review.review_id)}
                    disabled={toggleLikeMutation.isPending}
                    className={`transition-colors duration-200 ${review.is_liked ? "text-red-500" : "text-gray-600"
                    }`}
                >
                    리뷰 좋아요 {review.is_liked ? '❤️' : '🤍'} {review.recommend_cnt}
                </button>
                <button onClick={openReport} className="text-red-500 hover:underline">신고하기</button>
            </div>

            {/* 신고 모달 */}
            {isReportOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-6 rounded shadow w-full max-w-xs sm:max-w-sm">
                        <h3 className="font-semibold mb-4 text-base sm:text-lg">신고 사유 선택</h3>
                        <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                            {Object.entries(ReportReasonDescriptions).map(([key, desc]) => (
                                <label key={key} className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="reportReason"
                                        value={key}
                                        checked={selectedReason === key}
                                        onChange={() => setSelectedReason(key as ReportReason)}
                                        className="mr-2"
                                    />
                                    <span className="text-sm sm:text-base">{desc}</span>
                                </label>
                            ))}
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={closeReport}
                                className="px-3 py-1 border rounded text-sm sm:text-base"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleReport}
                                disabled={!selectedReason || reportMutation.isPending}
                                className="px-3 py-1 bg-red-500 text-white rounded disabled:opacity-50 text-sm sm:text-base"
                            >
                                {isReporting ? "신고중..." : "신고하기"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}