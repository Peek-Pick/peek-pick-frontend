import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import '~/util/customSwal.css';
import {softDeleteAccount} from "~/api/users/myPageAPI";

export function useAccountDelete() {
    const deleteMutation = useMutation({
        mutationFn: softDeleteAccount,
        onSuccess: () => {
            Swal.fire({
                title: "계정이 삭제되었습니다.",
                icon: "success",
                confirmButtonText: "확인",
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
                title: "계정 삭제 실패",
                icon: "error",
                confirmButtonText: "확인",
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
        // const inputOptions = Object.entries(ReportReasonDescriptions).reduce<
        //     Record<string, string>
        // >((acc, [key, value]) => {
        //     acc[key] = value;
        //     return acc;
        // }, {});

        Swal.fire({
            title: "정말 탈퇴하시겠어요?",
            text: "계정은 복구되지 않습니다.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "탈퇴하기",
            cancelButtonText: "취소",
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