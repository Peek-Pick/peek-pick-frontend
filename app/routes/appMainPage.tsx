import BottomNavComponent from "~/components/main/bottomNavComponent";
import CarouselComponent from "~/components/main/carouselComponent";
import MenuGrid from "~/components/main/menuGridComponent";
import {RankingComponent} from "~/components/main/RankingComponent";
import {RecommendComponent} from "~/components/main/RecommendComponent";
import {useEffect, useState} from "react";
import {MainLoading} from "~/util/loading/mainLoading";

function appMainPage() {

    // const [isLoading, setIsLoading] = useState(true);
    //
    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         setIsLoading(false);
    //     }, 1500); // 1.5초 로딩 예시
    //
    //     return () => clearTimeout(timer);
    // }, []);
    //
    // if (isLoading) {
    //     return <MainLoading />;
    // }
    return (
        <div>
            <CarouselComponent/>
            <MenuGrid />
            <RankingComponent />
            <RecommendComponent />
            <BottomNavComponent/>
        </div>
    );
}

export default appMainPage;