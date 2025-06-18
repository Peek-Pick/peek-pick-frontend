import BottomNavComponent from "~/components/main/bottomNavComponent";
import CarouselComponent from "~/components/main/carouselComponent";
import MenuGrid from "~/components/main/menuGridComponent";
import {RankingComponent} from "~/components/main/RankingComponent";
import {RecommendComponent} from "~/components/main/RecommendComponent";

function appMainPage() {
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