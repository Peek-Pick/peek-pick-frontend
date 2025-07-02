import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import '~/util/swal/customSwal.css';
import {softDeleteAccount} from "~/api/users/myPageAPI";
import {useTranslation} from "react-i18next";

export function useAccountDelete() {
    // 국제화 적용
    const { t } = useTranslation();

    const deleteMutation = useMutation({
        mutationFn: softDeleteAccount,
        onSuccess: () => {
            Swal.fire({
                title: t('deletingUserSuccess'),
                icon: "success",
                confirmButtonText: t('confirmOKButtonText'),
                customClass: {
                    popup: 'custom-popup',
                    title: 'custom-title',
                    actions: 'custom-actions',
                    confirmButton: 'custom-confirm-button',
                },
            }).then(() => {
                window.location.href = "/logout"; // 로그아웃 처리
            });
        },
        onError: () => {
            Swal.fire({
                title: t('deletingUserFail'),
                icon: "error",
                confirmButtonText: t('confirmOKButtonText'),
                customClass: {
                    popup: 'custom-popup',
                    title: 'custom-title',
                    actions: 'custom-actions',
                    confirmButton: 'custom-confirm-button',
                },
            });
        }
    });

    const openDeleteModal = () => {

        Swal.fire({
            title: t('deletingUserConfirm'),
            text: t('deletingUserWarning'),
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: t('confirmDeleteButtonText'),
            cancelButtonText: t('cancelButtonText'),
            customClass: {
                popup: "custom-popup",
                title: "custom-title",
                actions: "custom-actions",
                confirmButton: "custom-confirm-button",
                cancelButton: "custom-cancel-button",
            },
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMutation.mutate();
            }
        });
    };

    return { openDeleteModal };
}