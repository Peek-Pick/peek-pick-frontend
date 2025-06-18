import { useMutation } from "@tanstack/react-query";
import { reportReview } from "~/api/reviews/reviewAPI";
import { useState } from "react";
import Swal from "sweetalert2"
import '~/util/swal/customReportSwal.css'

export enum ReportReason {
    POLITICS = "POLITICS",
    HATE = "HATE",
    DEFAMATION = "DEFAMATION",
    PROFANITY = "PROFANITY",
}

export const ReportReasonDescriptions: Record<ReportReason, string> = {
    [ReportReason.POLITICS]: "Political content",
    [ReportReason.HATE]: "Hate speech",
    [ReportReason.DEFAMATION]: "Defamation",
    [ReportReason.PROFANITY]: "Inappropriate language",
};

export function useReviewReport(reviewId: number) {
    const [selectedReason, setSelectedReason] = useState<ReportReason | "">("");

    const reportMutation = useMutation({
        mutationFn: () => {
            Swal.fire({
                title: "Submitting report...",
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading();
                },
                customClass: {
                    popup: 'custom-popup',
                    title: 'custom-title',
                    actions: 'custom-actions',
                    confirmButton: 'custom-confirm-button',
                }
            });

            return reportReview(reviewId, {
                reviewId: reviewId,
                reason: selectedReason as ReportReason
            });
        },
        onSuccess: () => {
            Swal.fire({
                title: "Report submitted successfully",
                icon: "success",
                confirmButtonText: "OK",
                customClass: {
                    popup: 'custom-popup',
                    title: 'custom-title',
                    actions: 'custom-actions',
                    confirmButton: 'custom-confirm-button',
                },
            });
        },
        onError: () => {
            Swal.fire({
                title: "You have already reported this review",
                icon: "warning",
                confirmButtonText: "OK",
                customClass: {
                    popup: 'custom-popup',
                    title: 'custom-title',
                    actions: 'custom-actions',
                    confirmButton: 'custom-confirm-button',
                },
            });
        },
    });

    const openReportModal = async () => {
        const inputOptions = Object.entries(ReportReasonDescriptions).reduce<
            Record<string, string>
        >((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});

        const { value: selected } = await Swal.fire({
            title: "Select a reason for reporting",
            input: "radio",
            inputOptions,
            inputValidator: (v) => (v ? null : "Please select a reason."),
            showCancelButton: true,
            confirmButtonText: "Submit Report",
            cancelButtonText: "Cancel",
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

    return { openReportModal };
}