import {useState} from "react";
import type {UpdateUserStatus} from "~/types/users";
import {updateAdminUserStatus} from "~/api/users/adminUsersAPI";

export function useUserStatusUpdater() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string|null>(null)
    // const [success, setSuccess] = useState(false)

    const updateStatus = async ({userId, updateStatus}: UpdateUserStatus): Promise<boolean> =>{
        setLoading(true);
        setError(null);

        try {
            await updateAdminUserStatus(
                userId, {
                    status: updateStatus.status,
                    banUntil: updateStatus.status === "BANNED" ? updateStatus.banUntil : undefined
                })

                return true;
        } catch (err: any) {
            setError(err.response?.data?.message || "There was an error while updating the status.")
        } finally {
            setLoading(false)
        }
    }
    
    return {
        updateStatus,
        loading,
        error,
    }
}

