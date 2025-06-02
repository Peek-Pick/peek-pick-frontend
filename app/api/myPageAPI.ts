import axiosInstance from "~/instance/axiosInstance";
import type {ProfileReadDTO, MyPageResponseDTO, ProfileEditDTO } from "~/types/users";

const host = "http://localhost:8080/api/v1/users";

// myPage 조회
export const getMyPage = async (): Promise<MyPageResponseDTO> => {
    const response = await axiosInstance.get(`${host}/mypage`, { withCredentials: true });
    return response.data;
};

// myPage Edit 조회
export const getMyPageEdit = async (): Promise<ProfileReadDTO> => {
    const response = await axiosInstance.get(`${host}/mypage/edit`, { withCredentials: true });
    return response.data;
};

//myPage Edit 수정
export const updateMyPage = async (formData: FormData)=> {
    return axiosInstance.put('/mypage/edit', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    })
}
