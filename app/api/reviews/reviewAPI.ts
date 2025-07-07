import axiosInstance from "~/instance/axiosInstance";

const host = `http://localhost:8080/api/v1/reviews`
const host_tag = `http://localhost:8080/api/v1/tags`

export const addReview = async (formData: FormData) => {
    return await axiosInstance.post(`${host}`, formData);
}

export const modifyReview = async (reviewId: number, formData: FormData) => {
    return await axiosInstance.put(`${host}/${reviewId}`, formData );
};

export const deleteReview = async (reviewId: number) => {
    return await axiosInstance.delete(`${host}/${reviewId}`);
};

export const toggleReview = async (reviewId: number) => {
    return await axiosInstance.post(`${host}/${reviewId}/like`, null,);
};

export const reportReview = async (reviewId: number, dto: ReviewReportDTO) => {
    return await axiosInstance.post(`${host}/${reviewId}/report`, dto, { headers: { "Content-Type": "application/json" } });
};

//다국어
export const getReview = async (reviewId: number, lang: string = "en") => {
    return await axiosInstance.get(`${host}/${reviewId}`, {params: {lang}});
}

//다국어
export const getUserReviews = async (page: number, lang: string = "en") => {
    const params = new URLSearchParams({page: String(page), lang});
    return await axiosInstance.get(`${host}?${params.toString()}`);
}

export const getUserReviewsCount = async (): Promise<number> => {
    const response = await axiosInstance.get(`${host}/count`);
    return response.data;
};

//다국어
export const getProductPreviews = async(productId: number, lang: string = "en") => {
    const response = await axiosInstance.get(`${host}/preview/${productId}`, {params: {lang}})
    return response.data.content;
}

//다국어
export const getProductReviews = async (productId: number, page: number, sortBy: string, lang: string = "en") => {
    const params = new URLSearchParams({
        productId: String(productId),
        page: String(page),
        lang
    });
    params.append("sort", `${sortBy},desc`);
    params.append("sort", "regDate,desc");

    return await axiosInstance.get(`${host}?${params.toString()}`);
};

export const getProductReviewsCount = async (productId: number): Promise<number> => {
    const response = await axiosInstance.get(`${host}/count/${productId}`);
    return response.data;
};

//다국어 -> 얘 안씀?
export const getTags = async (lang: string = "en") => {
    return await axiosInstance.get(`${host_tag}`, {params: {lang}})
}

export const getProductIdByBarcode = async (barcode: string) => {
    return await axiosInstance.get(`${host}/barcode`, {params: { barcode }});
}

//다국어
export const getReviewSummary = async (productId: number, lang: string = "en"): Promise<aiReviewDTO> => {
    const response=  await axiosInstance.get(`${host}/summary/${productId}`, {params: {lang}});
    console.log("ai response Data : ", response.data)
    return response.data;
}