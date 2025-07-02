import axiosInstanceAdmin from "~/instance/axiosInstanceAdmin";
import type {PagingResponse} from "~/types/common";

// 요청사항 필터 타입
export type Category = "문의" | "신고";

// 요청사항 필터에 맞는 DTO
export type CategoryDataMap = {
    "문의": AdminDashInquiryDTO;
    "신고": AdminDashReportDTO;
};

export const getAdminDashboardInquiryList = async (page: number): Promise<PagingResponse<AdminDashInquiryDTO>> => {
    const params: Record<string, string> = {
        page: String(page),
        sort: "regDate,desc",
    };

    const response = await axiosInstanceAdmin.get("admin/dashboard/inquiry", { params });
    return response.data;
};

export const getAdminDashboardReportList = async (page: number): Promise<PagingResponse<AdminDashReportDTO>> => {
    const params: Record<string, string> = {
        page: String(page),
        sort: "regDate,desc",
    };

    const response = await axiosInstanceAdmin.get("admin/dashboard/report", { params });
    return response.data;
};

export const getAdminDashboardChartReview = async (): Promise<AdminDashChart[]> => {
    const response = await axiosInstanceAdmin.get("admin/dashboard/chart/review");
    return response.data;
};


export const getAdminDashboardChartUser = async (): Promise<AdminDashChart[]> => {
    const response = await axiosInstanceAdmin.get("admin/dashboard/chart/user");
    return response.data;
};

export const getAdminDashboardChartNationality = async (): Promise<AdminDashChart[]> => {
    const response = await axiosInstanceAdmin.get("admin/dashboard/chart/nationality");
    return response.data;
};

export const getAdminDashboardStatus = async (): Promise<[number[], number[]]> => {
    const response = await axiosInstanceAdmin.get("admin/dashboard/status");
    return response.data;
};