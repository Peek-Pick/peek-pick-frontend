import axiosInstance from "~/instance/axiosInstance";
import type {MyPageEditDTO, MyPageResponseDTO } from "~/types/users";

const host = "http://localhost:8080/api/v1/users";

export const getMyPage = async (): Promise<MyPageResponseDTO> => {
    const response = await axiosInstance.get(`${host}/mypage`, { withCredentials: true });
    return response.data;
};

export const getMyPageEdit = async (): Promise<MyPageEditDTO> => {
    const response = await axiosInstance.get(`${host}/mypage/edit`, { withCredentials: true });
    return response.data;
};