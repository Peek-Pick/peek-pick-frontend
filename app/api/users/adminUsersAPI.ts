import axiosInstance from "~/instance/axiosInstance";

const host = "http://localhost:8080/api/v1/admin/users";

// 사용자 목록 조회
export async function getUserList(page: number, size: number) {
    const res = await axiosInstance.get(`${host}/list?page=${page}&size=${size}`)
    return res.data
}