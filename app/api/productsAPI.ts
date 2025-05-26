import axiosInstance from "~/instance/axiosInstance";
import type { ProductListDTO, PageResponse } from "~/types/products";


const host = "http://localhost:8080/api/v1/products";

// export async function listProducts(page: number, size: number, sort: string = "likeCount,DESC"): Promise<PageResponse<ProductListDTO>> {
//     const res = await axiosInstance.get<PageResponse<ProductListDTO>>(host, {params: { page, size, sort },});
//     return res.data;
// } 다른 API 코드와 형태는 같음. 페이징/정렬때문에 길이 길어져서 아래처럼 나눔

export async function listProducts(page: number, size: number, sort: string = "likeCount,DESC")
    : Promise<PageResponse<ProductListDTO>> {
    const res = await axiosInstance.get<PageResponse<ProductListDTO>>(
        `${host}/ranking`, {params: { page, size, sort },});
    return res.data;
}