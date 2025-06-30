// components/reviews/AISummarySection.tsx

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Info } from "lucide-react";
import Swal from "sweetalert2";
import '~/util/swal/customAISwal.css';
import { useState } from "react";
import {useTranslation} from "react-i18next";

interface Props {
    aiReview: aiReviewDTO;
}

export default function AISummarySection({ aiReview }: Props) {
    // 국제화 적용
    const { t } = useTranslation();

    const [isNegative, setIsNegative] = useState(false);

    return (
        <div className="relative">
            {/* AI 리뷰 헤더 */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <span className="w-16 h-14">
                        <DotLottieReact
                            src="/loading/lottie_ai_review.lottie"
                            loop
                            autoplay
                            speed={1.5}
                        />
                    </span>
                    <p className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                        {t('aiSummaryTitle')}
                    </p>
                </div>

                {/* 긍정 리뷰 비율 */}
                <p className="text-sm text-red-400 flex items-center gap-1">
                    <span className="text-sm">Positive</span>
                    <span className="font-semibold text-lg">{aiReview.percent}%</span>
                </p>
            </div>

            {/* 요약 내용 */}
            <div className="text-sm rounded-xl mb-4 bg-gray-50">
                {/* 탭 토글 */}
                <div className="flex text-sm justify-center rounded-t-xl shadow-sm">
                    <button
                        className={`w-1/2 py-2 text-sm font-medium transition-colors ${
                            !isNegative
                                ? "text-red-500 border-b-2 border-red-500 font-bold"
                                : "text-gray-400 hover:text-gray-600"
                        }`}
                        onClick={() => setIsNegative(false)}
                    >
                        {t('positiveReview')}
                    </button>
                    <button
                        className={`w-1/2 py-2 text-sm font-medium transition-colors ${
                            isNegative
                                ? "text-blue-500 border-b-2 border-blue-500 font-bold"
                                : "text-gray-400 hover:text-gray-600"
                        }`}
                        onClick={() => setIsNegative(true)}
                    >
                        {t('negativeReview')}
                    </button>
                </div>

                {/* 실제 요약 내용 */}
                <div className="text-sm text-gray-700 bg-gray-100 rounded-b-xl p-4 leading-relaxed shadow-sm">
                    {isNegative ? aiReview.negativeSummary : aiReview.positiveSummary}
                </div>
            </div>
        </div>
    );
}
