import axios from "axios";
import type {ActionResult} from "~/types/common";
import axiosInstance from "~/instance/axiosInstance";

type SignupRequest = {
    email: string;
    password: string | null;
    nickname: string;
    gender: string;
    nationality: string;
    birthDate: string; // "2000-05-23" 형식
    profileImgUrl: string;
    tagIdList: number[];
    isSocial: boolean;
};

const host = "http://localhost:8080/api/v1/users";

// 회원가입
export async function SignupForm(data: SignupRequest): Promise<ActionResult<number>> {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const res = await axios.post<ActionResult<number>>(`${host}/signup`, data, {
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
        },
    });

    return res.data;
}

// 이메일 체크
export const checkEmail = async (email:string): Promise<{exists: boolean}> => {
    const res = await axiosInstance.get(`${host}/check-email`, {
        params: { email },
    });
    return res.data;
}

