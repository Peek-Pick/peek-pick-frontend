import axiosInstance from "~/instance/axiosInstance";

export const getAdminReviewDetail = async (reviewId: number) => {
    const response =  await axiosInstance.get(`admin/reviews/${reviewId}`);
    return response.data;
}

export const getAdminReviewList = async (page: number) => {
    const params = new URLSearchParams({page: String(page)});
    params.append("sort", `regDate,desc`);

    const response =  await axiosInstance.get(`admin/reviews`, {params: {page}});
    return response.data;
}