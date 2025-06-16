
import type {PointStoreAddDTO, PointStoreDTO, UpdateCouponFormData} from "~/types/points";
import axiosInstanceAdmin from "~/instance/axiosInstanceAdmin";


// 쿠폰 단건 조회
export async function readCoupon(pointstoreId: number | null): Promise<PointStoreDTO> {
    const response = await axiosInstanceAdmin.get(`/admin/points/${pointstoreId}`);
    return response.data;
}

// 쿠폰 목록 조회 (Admin)
export async function listAdminCoupon (page: number, category?: string, keyword?: string, hidden?: boolean) {
    const params: Record<string, string> = {
        page: String(page),
        sort: "regDate,desc",
    };

    if (category) params.category = category;
    if (keyword) params.keyword = keyword;
    if (hidden !== undefined) params.hidden = String(hidden);

    const response = await axiosInstanceAdmin.get(`admin/points`, {params});

    return response.data;
}


// 쿠폰 추가
export async function addCoupon(formData: UpdateCouponFormData): Promise<number> {
    // 1. 이미지 먼저 업로드해서 URL 받기
    const imgUrl = await uploadPointImage(formData.imageFile);

    // 2. 받은 이미지 URL을 포함한 DTO 생성
    const dto: PointStoreAddDTO = {
        item: formData.item,
        price: formData.price,
        description: formData.description,
        productType: formData.productType,
        imgUrl: imgUrl,
    };

    // 3. 포인트 쿠폰 등록 API 호출
    const response = await axiosInstanceAdmin.post<number>('/admin/points', dto);
    return response.data;
}

// 쿠폰 수정
export async function updateCoupon(pointstoreId: number, formData: UpdateCouponFormData ) {

    let imgUrl = formData.imgUrl || "";

    // 새 이미지가 있으면 업로드 후 URL 갱신
    if (formData.imageFile) {
        imgUrl = await uploadPointImage(formData.imageFile);
    }

    const dto: PointStoreAddDTO = {
        item: formData.item,
        price: formData.price,
        description: formData.description,
        productType: formData.productType,
        imgUrl: imgUrl,
    };

    await axiosInstanceAdmin.put(`/admin/points/${pointstoreId}`, dto);
}

// 쿠폰 삭제 (soft-delete)
export async function deleteCoupon(pointstoreId: number): Promise<void> {
    await axiosInstanceAdmin.patch(`/admin/points/${pointstoreId}`);
}

// 프론트 이미지 업로드
export async function uploadPointImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosInstanceAdmin.post<string>('/admin/points/upload', formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
}