import axiosInstance from "~/instance/axiosInstance";
import type {ProfileReadDTO, MyPageResponseDTO } from "~/types/users";
import type {ProductListDTO, PageResponse} from "~/types/products";


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
    return axiosInstance.put(`${host}/mypage/edit`, formData)
}

/**
 * 찜한(즐겨찾기) 상품 목록을 페이지 단위로 조회
 * - 백엔드: GET /api/v1/users/favorites?page={page}&size={size}
 * @param page 0부터 시작하는 페이지 번호
 * @param size 한 페이지당 상품 개수
 */
export async function getMyPageFavorite(
    page: number,
    size: number
): Promise<PageResponse<ProductListDTO>> {
    const res = await axiosInstance.get<PageResponse<ProductListDTO>>(
        `${host}/favorites`,
        {
            params: { page, size },
            withCredentials: true,
        }
    );
    return res.data;
}
