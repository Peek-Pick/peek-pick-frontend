import BottomNavComponent from "~/components/main/bottomNavComponent";
import CarouselComponent from "~/components/main/carouselComponent";
import MenuGrid from "~/components/main/menuGridComponent";
import {RankingComponent} from "~/components/main/RankingComponent";
import {RecommendComponent} from "~/components/main/RecommendComponent";
import {useEffect, useState} from "react";
import {MainLoading} from "~/util/loading/mainLoading";
import {useAuthContext} from "~/hooks/auth/useAuthContext";
import RecommendSkeleton from "~/components/main/RecommendSkeleton";
import {useTranslation} from "react-i18next";

function appMainPage() {
    // 국제화 적용
    const { i18n } = useTranslation();

    const [showLoading, setShowLoading] = useState(true);

    const { isLoggedIn, isLoading:checkingLogged } = useAuthContext();

    // 세션 스토리지를 체크해서 최초 방문이면 스피너 보여주기
    useEffect(() => {
        // window가 존재하는지 확인
        // SSR 환경에서는 window가 undefined일 수 있어서 확인 필요
        if (typeof window !== "undefined") {

            const hasVisited = sessionStorage.getItem("hasVisitedMain");

            if (hasVisited) {
                setShowLoading(false);
            } else {
                // 최초 방문이면 스피너를 보여주고, 이후엔 다시 안 보이도록 세션스토리지에 기록
                sessionStorage.setItem("hasVisitedMain", "true");

                const timer = setTimeout(() => setShowLoading(false), 3000);

                return () => clearTimeout(timer);
            }
        }
    }, []);

    // 로딩 상태일 때 스피너 표시
    if (showLoading) {
        return (
            <MainLoading />
        );
    }

    // console.log(isLoggedIn)
    return (
        <div>
            <CarouselComponent/>
            <MenuGrid />

            {checkingLogged ? (
                <>
                    <RecommendSkeleton msg={"Top Ranking"} />
                    <RecommendSkeleton msg={"Top Picks for you"} />
                </>
            ) : isLoggedIn ? (
                <>
                <RankingComponent />
                <RecommendComponent />
                </>
            ) : (
                <>
                <RecommendSkeleton msg={"Top Ranking"} />
                <RecommendSkeleton msg={"Top Picks for you"} />
                </>
            )}
            <BottomNavComponent/>
        </div>
    );
}

export default appMainPage;