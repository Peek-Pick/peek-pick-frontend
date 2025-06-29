import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import '~/util/swal/customSwal.css';
import {softDeleteAccount} from "~/api/users/myPageAPI";

export function useAccountDelete() {
    const deleteMutation = useMutation({
        mutationFn: softDeleteAccount,
        onSuccess: () => {
            Swal.fire({
                title: "Your account has been successfully deleted.",
                icon: "success",
                confirmButtonText: "OK",
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
                title: "Account Deletion Failed",
                icon: "error",
                confirmButtonText: "OK",
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
            title: "Are You Sure You Want to Delete Your Account?",
            text: "This action is permanent and cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete Account",
            cancelButtonText: "Cancel",
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