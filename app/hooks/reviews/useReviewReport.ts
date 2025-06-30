import { useMutation } from "@tanstack/react-query";
import { reportReview } from "~/api/reviews/reviewAPI";
import { useState } from "react";
import Swal from "sweetalert2"
import '~/util/swal/customReportSwal.css'
import {useTranslation} from "react-i18next";

export enum ReportReason {
    POLITICS = "POLITICS",
    HATE = "HATE",
    DEFAMATION = "DEFAMATION",
    PROFANITY = "PROFANITY",
}

export function useReviewReport(reviewId: number) {
    const { t } = useTranslation(); // ✅ useTranslation은 여기서 사용해야 함
    const [selectedReason, setSelectedReason] = useState<ReportReason | "">("");

    const ReportReasonDescriptions: Record<ReportReason, string> = {
        [ReportReason.POLITICS]: t("reportReasons.POLITICS"),
        [ReportReason.HATE]: t("reportReasons.HATE"),
        [ReportReason.DEFAMATION]: t("reportReasons.DEFAMATION"),
        [ReportReason.PROFANITY]: t("reportReasons.PROFANITY"),
    };

    const reportMutation = useMutation({
        mutationFn: () => {
            Swal.fire({
                title: t('submittingReport'),
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
                title: t('submittingReportSuccess'),
                icon: "success",
                confirmButtonText: t('confirmOKButtonText'),
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
                title: t('submittingReportFail'),
                icon: "warning",
                confirmButtonText: t('confirmOKButtonText'),
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
            title: t('selectReportReason'),
            input: "radio",
            inputOptions,
            inputValidator: (v) => (v ? null : t('selectReportReasonConfirm')),
            showCancelButton: true,
            confirmButtonText: t('submittingReportButton'),
            cancelButtonText: t('cancelButtonText'),
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