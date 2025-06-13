import axiosInstance from "~/instance/axiosInstance";
import type { PageResponse, ProductListDTO, ProductDetailDTO } from "~/types/products";

const ADMIN_HOST = "http://localhost:8080/admin/products";

/** 관리자: 상품 목록 조회 */
export async function listAdminProducts(
    page: number,
    size: number,
    keyword?: string,
    sort: string = "productId,DESC"
): Promise<PageResponse<ProductListDTO>> {
    const params: Record<string, unknown> = { page, size, sort };
    if (keyword && keyword.trim()) params.keyword = keyword.trim();
    const res = await axiosInstance.get<PageResponse<ProductListDTO>>(ADMIN_HOST, { params });
    return res.data;
}

/** 관리자: 상품 생성 */
export async function createAdminProduct(
    payload: Omit<ProductDetailDTO, "productId" | "likeCount" | "reviewCount" | "score" | "isLiked">,
    image?: File,
    imageUrl?: string
): Promise<ProductDetailDTO> {
    const form = new FormData();
    form.append("barcode", payload.barcode);
    form.append("name", payload.name);
    if (payload.category) form.append("category", payload.category);
    if (payload.description) form.append("description", payload.description);
    if (payload.volume) form.append("volume", payload.volume);
    if (payload.ingredients) form.append("ingredients", payload.ingredients);
    if (payload.allergens) form.append("allergens", payload.allergens);
    if (payload.nutrition) form.append("nutrition", payload.nutrition);

    if (image) form.append("image", image);
    else if (imageUrl) form.append("imgUrl", imageUrl);

    const res = await axiosInstance.post<ProductDetailDTO>(
        ADMIN_HOST,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
    );
    return res.data;
}

/** 관리자: 상품 수정 (isDelete 포함) */
export async function updateAdminProduct(
    id: number,
    payload: Omit<ProductDetailDTO, "productId" | "likeCount" | "reviewCount" | "score" | "isLiked">,
    image?: File | null,
    imageUrl?: string | null,
    isDelete?: boolean
): Promise<ProductDetailDTO> {
    const form = new FormData();
    form.append("barcode", payload.barcode);
    form.append("name", payload.name);
    if (payload.category) form.append("category", payload.category);
    if (payload.description) form.append("description", payload.description);
    if (payload.volume) form.append("volume", payload.volume);
    if (payload.ingredients) form.append("ingredients", payload.ingredients);
    if (payload.allergens) form.append("allergens", payload.allergens);
    if (payload.nutrition) form.append("nutrition", payload.nutrition);

    if (image) form.append("image", image);
    else if (imageUrl) form.append("imgUrl", imageUrl);

    if (isDelete !== undefined) form.append("isDelete", String(isDelete));

    const res = await axiosInstance.put<ProductDetailDTO>(
        `${ADMIN_HOST}/${id}`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
    );
    return res.data;
}

/** 관리자: 상품 삭제 */
export async function deleteAdminProduct(id: number): Promise<void> {
    await axiosInstance.delete(`${ADMIN_HOST}/${id}`);
}

/** 관리자: 상품 상세 조회 */
export async function getAdminProductDetail(id: number): Promise<ProductDetailDTO> {
    const res = await axiosInstance.get<ProductDetailDTO>(`${ADMIN_HOST}/${id}`);
    return res.data;
}
