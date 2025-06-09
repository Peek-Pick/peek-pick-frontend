import { useState } from "react";
import axiosInstance from "~/instance/axiosInstance";

export const useNicknameChange = () => {
    const [newNickname, setNewNickname] = useState("");
    const [nicknameError, setNicknameError] = useState<string | null>(null);
    const [nicknameStatus, setNicknameStatus] = useState<
        "idle" | "checking" | "success" | "fail"
    >("idle");

    const checkNickname = async (): Promise<boolean> => {
        if (!newNickname) {
            setNicknameError("Please enter your new nickname.");
            return false;
        }

        try {
            setNicknameStatus("checking");
            setNicknameError(null);
            await axiosInstance.post("/users/check-nickname", {
                nickname: newNickname,
            });
            setNicknameStatus("success");
            setNicknameError(null); // 성공 시 에러 초기화
            return true;
        } catch (e: any) {
            const msg =
                e.response?.data?.message || "This nickname is already in use.";
            setNicknameError(msg);
            setNicknameStatus("fail");
            return false;
        }
    };

    return {
        newNickname,
        setNewNickname,
        nicknameError,
        nicknameStatus,
        checkNickname,
    };
};
