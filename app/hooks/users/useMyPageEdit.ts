import { useState } from "react"
import '~/util/customSwal.css'
import Swal from "sweetalert2";
import { updateMyPage } from "~/api/myPageAPI";

export const useMyPageEdit = () =>{

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    
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
            setSuccess(true)
            console.log("file:", profileImg);
            await Swal.fire({
                title: "수정이 완료되었습니다",
                icon: "success",
                confirmButtonText: "확인",
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
                title: "수정 중 오류가 발생했습니다",
                icon: "warning",
                confirmButtonText: "확인",
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