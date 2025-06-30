import { useState } from "react"
import '~/util/swal/customSwal.css'
import Swal from "sweetalert2";
import { updateMyPage } from "~/api/users/myPageAPI";
import { useQueryClient } from "@tanstack/react-query";

export const useMyPageEdit = () =>{

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
                title: "Profile updated successfully",
                icon: "success",
                confirmButtonText: "OK",
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
                title: "Failed to update profile",
                icon: "warning",
                confirmButtonText: "OK",
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