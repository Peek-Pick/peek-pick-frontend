
import MapContainerComponent from "~/components/map/mapContainerComponent";
import {BackButton} from "~/util/button/FloatingActionButtons";
import MapLoadingComponent from "~/util/loading/mapLoadingComponent";
import {type Libraries, useLoadScript} from "@react-google-maps/api";
import i18n from "i18next";

const libraries: Libraries = ['places'];

const MapPage = () => {

    // 구글 맵 API 스크립트 로드
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
        language: i18n.language,
        libraries,
        version: 'weekly',
    });


    // 로드 에러 또는 로딩 중인 경우 처리
    if (loadError) return "지도 로딩 오류";

    if (!isLoaded) {
        return (
            <MapLoadingComponent/>
        );
    }


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
