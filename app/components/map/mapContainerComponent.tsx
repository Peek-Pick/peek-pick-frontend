
import { useEffect, useState } from 'react';
import { GoogleMap, Marker, useLoadScript} from '@react-google-maps/api';
import StoreSearchComponent from "~/components/map/storeSearchComponent";
import { EyeSlashIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import StoreInfoWindowComponent from "~/components/map/storeInfoWindowComponent";
import MapLoadingComponent from "~/util/loading/mapLoadingComponent";
import usePolyline from "~/hooks/map/usePolyline";
import {getDirections} from "~/api/mapAPI";
import {useMapSearch} from "~/hooks/map/useMapSearch";
import {ErrorComponent} from "~/util/loading/errorComponent";


// 사용할 라이브러리
const libraries = ['places'];

const MapContainerComponent: React.FC = () => {

    const [currentPosition, setCurrentPosition] = useState<google.maps.LatLngLiteral | null>(null); // 현재 위치 저장용 상태
    const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);  // 지도 인스턴스 참조용
    const [storeMarkers, setStoreMarkers] = useState<google.maps.places.PlaceResult[]>([]); // 표시할 편의점 마커 배열
    const [showNearbyStores, setShowNearbyStores] = useState(false); // 버튼으로 주변 편의점 표시할지 여부
    const [selectedStore, setSelectedStore] = useState<google.maps.places.PlaceResult | null>(null); // 마커 클릭 시 선택된 장소 정보 저장
    const [selectedPosition, setSelectedPosition] = useState<google.maps.LatLngLiteral | null>(null); // 클릭된 마커 위치 저장 (InfoWindow 위치용)
    const [path, setPath] = useState<google.maps.LatLngLiteral[]>([]); //경로
    const [isNavigating, setIsNavigating] = useState(false); //길찾기 진행 상태
    const [startPosition, setStartPosition] = useState<google.maps.LatLngLiteral | null>(null); // 길찾기 시작점


    usePolyline(mapRef, path); // path가 변경시 실행됨

    const { handleSearch } = useMapSearch(mapRef, currentPosition, setStoreMarkers);

    // 구글 맵 API 스크립트 로드
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
        language:"en", // 언어 설정 (현재 영어)
        libraries: libraries as any,
    });

    // 현재 위치 가져오기
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // 위치 정보를 상태에 저장
                    setCurrentPosition({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                () => {
                    console.error('위치 정보를 가져오지 못했습니다.');
                }
            );
        }
    }, []);

    // 주변 편의점 표시
    useEffect(() => {
        if (!mapRef || !currentPosition) return;

        if (!showNearbyStores) {
            // 숨김 상태면 마커 초기화
            setStoreMarkers([]);
            return;
        }

        const service = new google.maps.places.PlacesService(mapRef);

        const request: google.maps.places.PlaceSearchRequest = {
            location: currentPosition,
            radius: 1000, // 1km 반경
            type: 'convenience_store',
        };

        service.nearbySearch(request, (results, status) => {

            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                setStoreMarkers(results);

                // bounds 처리
                const bounds = new google.maps.LatLngBounds();
                bounds.extend(new google.maps.LatLng(currentPosition.lat, currentPosition.lng));
                results.forEach((place) => {
                    const location = place.geometry?.location;
                    if (location) {
                        bounds.extend(location);
                    }
                });
                mapRef.fitBounds(bounds);
            }
        });
    }, [mapRef, currentPosition, showNearbyStores]);

    // 길찾기 함수
    const handleDirection = async (destination: google.maps.LatLngLiteral) => {
        if (!currentPosition) return;

        setStartPosition(currentPosition); // 출발지 고정

        const result = await getDirections(currentPosition, destination);
        if (result) {
            setPath(result);
            setIsNavigating(true);  // 길찾기 시작 표시
            setShowNearbyStores(false);

            // bounds 처리
            const bounds = new google.maps.LatLngBounds();
            bounds.extend(result[0]); // 출발지
            bounds.extend(result[result.length - 1]); // 도착지
            mapRef?.fitBounds(bounds);
        } else {
            alert("길찾기 경로를 가져올 수 없습니다.");
        }
    };

    //길찾기 사용자 위치 추적
    useEffect(() => {
        if (!navigator.geolocation) return;

        // watchPosition: 위치가 바뀔 때마다 콜백 실행됨
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                // 위치가 업데이트되면 currentPosition 상태에 저장
                setCurrentPosition({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            (error) => {
                // 위치 정보 가져오다가 에러 발생 시 콘솔에 출력
                console.error('현재 위치를 추적하는 중 오류 발생:', error);
            },
            {
                enableHighAccuracy: true, // GPS 등 정확한 위치 사용 권장
                maximumAge: 1000,         // 1초 이내에 캐시된 위치면 재사용 가능
                timeout: 5000,            // 위치 정보를 얻기까지 최대 5초 대기
            }
        );

        // 컴포넌트 언마운트 시 위치 추적 해제해서 리소스 낭비 방지
        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    }, []);

    // InfoWindow 외 부분 클릭시 꺼짐
    useEffect(() => {
        const handleClickOutside = () => {
            setSelectedStore(null);
            setSelectedPosition(null);
        };

        document.body.addEventListener("click", handleClickOutside);
        return () => {
            document.body.removeEventListener("click", handleClickOutside);
        };
    }, []);

    // 로드 에러 또는 로딩 중인 경우 처리
    if (loadError) return <ErrorComponent />;

    if (!isLoaded || !currentPosition) {
        return (
            <MapLoadingComponent/>
        );
    }

    return (
        <div className="w-full h-[80vh] sm:h-[90vh] lg:h-[75vh] relative">
            {/*검색창 컴포넌트*/}
            <StoreSearchComponent onSearch={handleSearch} />

            {/* 구글맵 컴포넌트 */}
            <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={currentPosition}
                zoom={16}
                onLoad={(map) => setMapRef(map)}
            >
                {/* 현재위치 마커 */}
                {!isNavigating && <Marker position={currentPosition} />}

                {/* 편의점 마커들 */}
                {!isNavigating && storeMarkers.map((place, idx) => {
                    const pos = {
                        lat: place.geometry?.location?.lat() || 0,
                        lng: place.geometry?.location?.lng() || 0,
                    };

                    return (
                        <Marker
                            key={idx}
                            position={pos}
                            icon={{
                                url: "/icons/map_shop.png",
                                scaledSize: new google.maps.Size(30, 30),
                            }}
                            onClick={() => {
                                if (!mapRef || !place.place_id) return;

                                const service = new google.maps.places.PlacesService(mapRef);
                                service.getDetails(
                                    {
                                        placeId: place.place_id,
                                        language: 'en',
                                        fields: ['name', 'geometry', 'formatted_address', 'formatted_phone_number', 'opening_hours', 'reviews', 'photos', 'rating', 'user_ratings_total'],
                                    },
                                    (detailedPlace, status) => {
                                        if (status === google.maps.places.PlacesServiceStatus.OK && detailedPlace) {
                                            setSelectedStore(detailedPlace);
                                            setSelectedPosition({
                                                lat: detailedPlace.geometry?.location?.lat() || 0,
                                                lng: detailedPlace.geometry?.location?.lng() || 0,
                                            });
                                        } else {
                                            alert('상세정보를 불러올 수 없습니다.');
                                        }
                                    }
                                );
                            }}
                        />
                    );
                })}

                {/* 선택된 마커가 있으면 InfoWindow 표시 */}
                {selectedStore && selectedPosition && !isNavigating && (
                    <StoreInfoWindowComponent
                        position={selectedPosition}
                        selectedStore={selectedStore}
                        onClose={() => {
                            setSelectedStore(null);
                            setSelectedPosition(null);
                        }}
                        onRoute={handleDirection}
                    >
                    </StoreInfoWindowComponent>
                )}

                {/* 길찾기 - 출발지, 현재위치, 도착지 마커 */}
                {isNavigating && (
                    <>
                        {startPosition && (
                            <Marker
                                position={startPosition}
                                icon={{
                                    url: "https://img.icons8.com/office/40/000000/marker.png",
                                    scaledSize: new google.maps.Size(40, 40),
                                }}
                                title="출발지"
                            />
                        )}

                        {currentPosition && (
                            <Marker
                                position={currentPosition}
                                icon={{
                                    url: "/icons/map_directions_marker.png",
                                    scaledSize: new google.maps.Size(60, 95),
                                }}
                                title="내 위치"
                                animation={google.maps.Animation.DROP}
                            />
                        )}

                        {path.length >= 2 && (
                            <Marker
                                position={path[path.length - 1]}
                                icon={{
                                    url: "https://img.icons8.com/color/48/000000/finish-flag.png",
                                    scaledSize: new google.maps.Size(40, 40),
                                }}
                                animation={google.maps.Animation.DROP}
                                title="도착지"
                            />
                        )}
                    </>
                )}

                {/* 주변 편의점 표시 버튼 or 길찾기 종료 버튼 */}
                {isNavigating ? (
                    <button
                        onClick={() => {
                            setIsNavigating(false);
                            setPath([])
                        }}
                        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10 w-12 h-12 bg-red-300 text-white p-2 rounded-full shadow-md hover:bg-red-700/90 transition backdrop-blur-sm"
                        title="Stop Navigation"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                ) : (
                    <button
                        onClick={() => setShowNearbyStores(!showNearbyStores)}
                        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-gray-100 transition"
                        title={showNearbyStores ? "Hide Nearby Convenience Stores" : "Show Nearby Convenience Stores"}
                    >
                        {showNearbyStores ? <EyeSlashIcon /> : <BuildingStorefrontIcon />}
                    </button>
                )}
                
            </GoogleMap>


        </div>

    );
};

export default MapContainerComponent;