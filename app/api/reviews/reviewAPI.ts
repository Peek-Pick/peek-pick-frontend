import axiosInstance from "~/instance/axiosInstance";

const host = `http://localhost:8080/api/v1/reviews`

export const addReview = async (formData: FormData) => {
    return await axiosInstance.post(`${host}`, formData);
}

export const getUserReviewsCount = async (): Promise<number> => {
    const response = await axiosInstance.get(`${host}/count`);
    return response.data;
};

export const getUserReviews = async (page: number) => {
    const params = new URLSearchParams({page: String(page)});
    return await axiosInstance.get(`${host}?${params.toString()}`);
}

export const getProductReviews = async (productId: number, page: number) => {
    const params = new URLSearchParams({productId: String(productId), page: String(page)});
    return await axiosInstance.get(`${host}?${params.toString()}`);
}

export const getReview = async (reviewId: number) => {
    return await axiosInstance.get(`${host}/${reviewId}`);
}

export const toggleReview = async (reviewId: number) => {
    return await axiosInstance.post(`${host}/${reviewId}/like`, null,);
};

export const reportReview = async (reviewId: number, dto: ReviewReportDTO) => {
    return await axiosInstance.post(`${host}/${reviewId}/report`, dto, { headers: { "Content-Type": "application/json" } });
};

export const modifyReview = async (reviewId: number, formData: FormData) => {
    return await axiosInstance.put(`${host}/${reviewId}`, formData );
};

export const deleteReview = async (reviewId: number) => {
    return await axiosInstance.delete(`${host}/${reviewId}`);
};