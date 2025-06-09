import axiosInstance from "~/instance/axiosInstance";

export const getAdminReviewList = async (page: number, category?: string, keyword?: string, hidden?: boolean) => {
    const params: Record<string, string> = {
        page: String(page),
        sort: "regDate,desc",
    };

    if (category) params.category = category;
    if (keyword) params.keyword = keyword;
    if (hidden !== undefined) params.hidden = String(hidden);

    const response = await axiosInstance.get(`admin/reviews`, {params});
    return response.data;
}

export const getAdminReviewDetail = async (reviewId: number) => {
    const response =  await axiosInstance.get(`admin/reviews/${reviewId}`);
    return response.data;
}

export const deleteAdminReview = async (reviewId: number) => {
    return await axiosInstance.delete(`admin/reviews/${reviewId}`);
};

export const getAdminReviewReportList = async (page: number, category?: string, keyword?: string, hidden?: boolean) => {
    const params: Record<string, string> = {
        page: String(page),
        sort: "regDate,desc",
    };

    if (category) params.category = category;
    if (keyword) params.keyword = keyword;
    if (hidden !== undefined) params.hidden = String(hidden);

    const response = await axiosInstance.get(`admin/reviews/report`, {params});
    return response.data;
}

export const toggleAdminReview = async (reviewId: number) => {
    return await axiosInstance.put(`admin/reviews/hide/${reviewId}`);
};