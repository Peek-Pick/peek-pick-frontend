import { useQuery } from "@tanstack/react-query";
import MyPageComponent from "~/components/users/myPageComponent";
import BottomNavComponent from "~/components/main/bottomNavComponent";
import { getMyPage } from "~/api/users/myPageAPI";
import { getUserReviewsCount } from "~/api/reviews/reviewAPI";
import { getCouponCount } from "~/api/points/pointsAPI";
import { getWishlistCount } from "~/api/products/productsAPI";
import { getBarcodeHistoryCount } from "~/api/barcode/barcodeAPI";
import {UserLoading} from "~/util/loading/userLoading";
import {ErrorComponent} from "~/util/loading/errorComponent";

function useMyPageData() {
    return useQuery({
        queryKey: ['myPageData'],
        queryFn: async () => {
            const [myPageResult, reviewCount, couponCount, barcodeHistoryCount, wishlistCount] = await Promise.all([
                getMyPage(),
                getUserReviewsCount(),
                getCouponCount(),
                getBarcodeHistoryCount(),
                getWishlistCount(),
            ]);

            return {
                profileImgUrl: myPageResult.profileImgUrl,
                nickname: myPageResult.nickname,
                point: myPageResult.point,
                reviewCount,
                couponCount,
                barcodeHistoryCount,
                wishlistCount,
                ...myPageResult.quickStats,
            };
        }
    });
}

function MyPagePage() {
    const { data: myData, isLoading, isError } = useMyPageData();

    if (isLoading)
        return <UserLoading />;
    if (isError || !myData)
        return <ErrorComponent />;

    return (
        <div>
            <MyPageComponent myData={myData}/>
            <BottomNavComponent/>
        </div>
    );
}

export default MyPagePage;
