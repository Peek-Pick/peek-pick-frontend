import type { TagDTO } from "~/types/tag";
import axiosInstance from "~/instance/axiosInstance";

const host = "http://localhost:8080/api/v1/tags";

// 전체 태그 불러오기
export async function getAllTags(): Promise<TagDTO[]> {
    const res = await axiosInstance.get<TagDTO[]>(`${host}`);
    return res.data;
}
