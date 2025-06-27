import { useQuery } from "@tanstack/react-query";
import { getMyPageEdit } from "~/api/users/myPageAPI";

export const useGetProfile = () => {
    return useQuery({
        queryKey: ['myProfile'],
        queryFn: getMyPageEdit,
        staleTime: 1000 * 60 * 5, // 5분 동안은 fresh
        retry: 1, // 실패 시 1회 재시도
    });
};