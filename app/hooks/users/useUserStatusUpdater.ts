import {useState} from "react";
import type {UpdateUserStatus} from "~/types/users";
import {updateAdminUserStatus} from "~/api/users/adminUsersAPI";

export function useUserStatusUpdater() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string|null>(null)
    const [success, setSuccess] = useState(false)

    const updateStatus = async ({userId, updateStatus}: UpdateUserStatus) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await updateAdminUserStatus(
                userId, {
                status: updateStatus.status,
                banUntil: updateStatus.status === "BANNED" ? updateStatus.banUntil : undefined
                })

            setSuccess(true)
        } catch (err: any) {
            setError(err.response?.data?.message || "상태 변경 중 오류 발생")
        } finally {
            setLoading(false)
        }
    }

    return {
        updateStatus,
        loading,
        error,
        success
    }
}