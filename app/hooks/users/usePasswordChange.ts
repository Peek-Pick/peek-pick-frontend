import { useState } from "react";
import axiosInstance from "~/instance/axiosInstance";

interface UsePasswordChangeReturn {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    setCurrentPassword: (v: string) => void;
    setNewPassword: (v: string) => void;
    setConfirmPassword: (v: string) => void;
    errorMessage: string | null;
    loading: boolean;
    validateAndSubmit: (submitFn: (password: string) => Promise<void>) => Promise<boolean>;
}

export const usePasswordChange = (): UsePasswordChangeReturn => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const validateAndSubmit = async (submitFn: (password: string) => Promise<void>): Promise<boolean> => {
        setErrorMessage(null);

        if (!currentPassword || !newPassword || !confirmPassword) {
            setErrorMessage("All fields are required.");
            return false;
        }

        if (newPassword !== confirmPassword) {
            setErrorMessage("New password and confirmation do not match.");
            return false;
        }

        try {
            setLoading(true);
            // 현재 비밀번호 서버에 검증 요청
            await axiosInstance.post("/mypage/password/check", { password: currentPassword });

            // 검증 통과 → submitFn 실행
            await submitFn(newPassword);
            return true;
        } catch (error: any) {
            if (error.response?.status === 401 || error.response?.status === 400) {
                setErrorMessage("Current password is incorrect.");
            } else {
                setErrorMessage("An error occurred while validating password.");
            }
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        currentPassword,
        newPassword,
        confirmPassword,
        setCurrentPassword,
        setNewPassword,
        setConfirmPassword,
        errorMessage,
        loading,
        validateAndSubmit
    };
};
