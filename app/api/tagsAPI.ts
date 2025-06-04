import axios from "axios";
import type { TagDTO } from "~/types/tag";

const host = "http://localhost:8080/api/v1/tags";

// 전체 태그 불러오기
export async function getAllTags(): Promise<TagDTO[]> {
    const res = await axios.get<TagDTO[]>(`${host}`);
    return res.data;
}
