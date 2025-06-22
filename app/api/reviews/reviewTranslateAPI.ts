import axiosInstance from "~/instance/axiosInstance";

const host = `http://localhost:8080/api/v1/reviews/translate`

export const translateReview = async (reviewId: number) => {
    return await axiosInstance.get(`${host}/${reviewId}`);
}