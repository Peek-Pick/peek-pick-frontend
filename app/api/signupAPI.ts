import axios from "axios";
import type {ActionResult} from "~/types/common";

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

export async function SignupForm(data: SignupRequest): Promise<ActionResult<number>> {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const res = await axios.post<ActionResult<number>>(`${host}/signup`, data, {
        headers: {
            "Content-Type": "application/json",
        },
    });

    return res.data;
}

