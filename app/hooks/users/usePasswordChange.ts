import { useState } from "react";
import axiosInstance from "~/instance/axiosInstance";

export const usePasswordChange = () => {

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState<string | null>(null);
    const [checkStatus, setCheckStatus] = useState<"idle" | "checking" | "success" | "fail">("idle");

    // 현재 비밀번호 확인
    const checkCurrentPassword = async (): Promise<boolean> => {

        // 현재 비밀번호를 입력했나요?
        if (!currentPassword) {
            setError("Please enter your current password")
            return false;
        }

        // 입력한 현재 비밀번호와 저장되어있는 비밀번호 비교
        try {
            setCheckStatus("checking")
            setError(null);
            await axiosInstance.post("/users/check-password",{
                password: currentPassword
            });
            setCheckStatus("success")
            return true;
        } catch (e:any) {
            const msg = e.response?.data?.message || "Current password is incorrect."
            setError(msg)
            setCheckStatus("fail")
            return false;
        }
    }

    const checkNewPassword = (): boolean => {
        if (!newPassword || !confirmPassword) {
            setError("Please enter and confirm your new password.")
            return false
        }

        if (newPassword !== confirmPassword) {
            setError("New password and confirmation do not match.")
            return false
        }

        return true;
    }

    return {
        currentPassword,
        newPassword,
        confirmPassword,
        checkStatus,
        setCurrentPassword,
        setNewPassword,
        setConfirmPassword,
        error,
        checkCurrentPassword,
        checkNewPassword
    }
};
