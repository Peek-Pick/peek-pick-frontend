import { useQuery } from "@tanstack/react-query";
import {checkLoginAPI} from "~/api/auth/authAPI";

export function useAuthContext() {
    const { data: isLoggedIn = false, isLoading } = useQuery({
        queryKey: ["auth-check"],
        queryFn: checkLoginAPI,
        // staleTime: 1000 * 60 * 5, // 5분 캐싱
        retry: 0, // 로그인 안되어 있는 상황에서 불필요한 재시도 방지
    });

    return { isLoggedIn, isLoading };
}
