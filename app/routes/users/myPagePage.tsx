import { useQuery } from "@tanstack/react-query";
import MyPageComponent from "~/components/users/myPageComponent";
import BottomNavComponent from "~/components/main/bottomNavComponent";
import { getMyPage } from "~/api/users/myPageAPI";
import { getUserReviewsCount } from "~/api/reviews/reviewAPI";
import {getCouponCount} from "~/api/points/pointsAPI";

function useMyPageData() {
    return useQuery({
        queryKey: ['myPageData'],
        queryFn: async () => {
            const [myPageResult, reviewCount, couponCount] = await Promise.all([
                getMyPage(),
                getUserReviewsCount(),
                getCouponCount(),
            ]);

            return {
                profileImgUrl: myPageResult.profileImgUrl,
                nickname: myPageResult.nickname,
                point: myPageResult.point,
                reviewCount,
                couponCount,
                ...myPageResult.quickStats,
            };
        },
        staleTime: 3 * 60 * 1000,
    });
}

function MyPagePage() {
    const { data: myData, isLoading, isError } = useMyPageData();

    if (isLoading) return <div className="p-4">불러오는 중...</div>;
    if (isError || !myData) return <div className="p-4">불러오기 실패</div>;

    return (
        <div>
            <MyPageComponent myData={myData}/>
            <BottomNavComponent/>
        </div>
    );
}

export default MyPagePage;
