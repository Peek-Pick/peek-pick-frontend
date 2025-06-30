
import MapContainerComponent from "~/components/map/mapContainerComponent";
import {BackButton} from "~/util/button/FloatingActionButtons";

const MapPage = () => {
    return (
        <>
            <div>
                <MapContainerComponent/>
            </div>

            {/*<BottomNavComponent />*/}
            <BackButton />
        </>



    );
};

export default MapPage;
