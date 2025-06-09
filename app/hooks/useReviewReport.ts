import { useMutation } from "@tanstack/react-query";
import { reportReview } from "~/api/reviews/reviewAPI";
import { useState } from "react";
import Swal from "sweetalert2"
import '~/util/customSwal.css'

export enum ReportReason {
    POLITICS = "POLITICS",
    HATE = "HATE",
    DEFAMATION = "DEFAMATION",
    PROFANITY = "PROFANITY",
}

export const ReportReasonDescriptions: Record<ReportReason, string> = {
    [ReportReason.POLITICS]: "정치",
    [ReportReason.HATE]: "혐오",
    [ReportReason.DEFAMATION]: "비방",
    [ReportReason.PROFANITY]: "욕설",
};

export function useReviewReport(reviewId: number) {
    const [selectedReason, setSelectedReason] = useState<ReportReason | "">("");
    
    // 신고 뮤테이션
    const reportMutation = useMutation({
        mutationFn: () =>
            reportReview(reviewId, {reviewId: reviewId, reason: selectedReason as ReportReason}),
        onSuccess: () => {
            Swal.fire({
                title: "신고가 완료되었습니다",
                icon: "success",
                confirmButtonText: "확인",
                customClass: {
                    popup: 'custom-popup',
                    title: 'custom-title',
                    actions: 'custom-actions',
                    confirmButton: 'custom-confirm-button',
                },
            })
        },
        onError: () => {
            Swal.fire({
                title: "이미 신고한 리뷰입니다",
                icon: "warning",
                confirmButtonText: "확인",
                customClass: {
                    popup: 'custom-popup',
                    title: 'custom-title',
                    actions: 'custom-actions',
                    confirmButton: 'custom-confirm-button',
                },
            })
        },
    });

    // 모달을 띄우고 뮤테이션 호출
    const openReportModal = async () => {
        const inputOptions = Object.entries(ReportReasonDescriptions).reduce<
            Record<string, string>
        >((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});

        // Swal radio 모달
        const { value: selected } = await Swal.fire({
            title: "신고 사유 선택",
            input: "radio",
            inputOptions,
            inputValidator: (v) => (v ? null : "신고 사유를 선택해주세요!"),
            showCancelButton: true,
            confirmButtonText: "신고하기",
            cancelButtonText: "취소",
            customClass: {
                popup: "custom-popup",
                title: "custom-title",
                actions: "custom-actions",
                confirmButton: "custom-confirm-button",
                cancelButton: "custom-cancel-button",
            },
            buttonsStyling: false,
        });

        if (selected) {
            setSelectedReason(selected as ReportReason);
            reportMutation.mutate();
        }
    };

    return {openReportModal};
}