import { useState } from "react"
import '~/util/swal/customSwal.css'
import Swal from "sweetalert2";
import { updateMyPage } from "~/api/users/myPageAPI";
import { useQueryClient } from "@tanstack/react-query";
import {useTranslation} from "react-i18next";

export const useMyPageEdit = () =>{
    // 국제화 적용
    const { t } = useTranslation();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const queryClient = useQueryClient();
    
    const handleSubmit = async (
        password: string,
        nickname: string,
        tagIdList: number[],
        profileImg:File|null
    ) => {
        const formData = new FormData();
        formData.append(
            "data",
            new Blob(
                [
                    JSON.stringify({
                        password,
                        nickname,
                        tagIdList,
                    }),
                ],
                {type: "application/json"}
            )
        )

        if (profileImg) {
            formData.append("file",profileImg);
        }

        try {
            setLoading(true)
            setError(null)
            setSuccess(false)

            await updateMyPage(formData)

            // 캐시 무효화
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['myPageEdit'] }),
            ]);

            setSuccess(true)

            // console.log("file:", profileImg);

            await Swal.fire({
                title: t('updatingProfileSuccess'),
                icon: "success",
                confirmButtonText: t('confirmOKButtonText'),
                customClass: {
                    popup: 'custom-popup',
                    title: 'custom-title',
                    actions: 'custom-actions',
                    confirmButton: 'custom-confirm-button',
                },
            });

            // navigate('/mypage')
            window.location.reload();

        } catch (e: any) {
            setError(e.response?.data?.message || "Failed to update profile.");

            Swal.fire({
                title: t('updatingProfileFail'),
                icon: "warning",
                confirmButtonText: t('confirmOKButtonText'),
                customClass: {
                    popup: 'custom-popup',
                    title: 'custom-title',
                    actions: 'custom-actions',
                    confirmButton: 'custom-confirm-button',
                },
            });

        } finally {
            setLoading(false);
        }
    }
    
    return {
        handleSubmit,
        loading,
        error,
        success,
    }
}