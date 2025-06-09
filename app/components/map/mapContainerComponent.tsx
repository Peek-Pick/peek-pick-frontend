
import { useEffect, useState } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import StoreSearchComponent from "~/components/map/storeSearchComponent";
import { EyeSlashIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import StoreInfoWindowComponent from "~/components/map/storeInfoWindowComponent";



// 지도 컨테이너 스타일
const containerStyle = {
    width: '100%',
    height: '500px',
};

// 사용할 라이브러리
const libraries = ['places'];

const MapContainerComponent: React.FC = () => {

    const [currentPosition, setCurrentPosition] = useState<google.maps.LatLngLiteral | null>(null); // 현재 위치 저장용 상태
    const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);  // 지도 인스턴스 참조용
    const [storeMarkers, setStoreMarkers] = useState<google.maps.places.PlaceResult[]>([]); // 표시할 편의점 마커 배열
    const [showNearbyStores, setShowNearbyStores] = useState(false); // 버튼으로 주변 편의점 표시할지 여부
    const [selectedStore, setSelectedStore] = useState<google.maps.places.PlaceResult | null>(null); // 마커 클릭 시 선택된 장소 정보 저장
    const [selectedPosition, setSelectedPosition] = useState<google.maps.LatLngLiteral | null>(null); // 클릭된 마커 위치 저장 (InfoWindow 위치용)
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태


    // 구글 맵 API 스크립트 로드
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
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
            }
        });
    }, [mapRef, currentPosition, showNearbyStores]);

    // 검색어 브랜드, 장소 분리
    const brands = ["CU", "GS25", "7-Eleven", "EMART24"];
    const parseKeyword = (input: string) => {
        const tokens = input.trim().split(/\s+/);
        const upperTokens = tokens.map((t) => t.toUpperCase());

        const brand = brands.find((b) => upperTokens.includes(b.toUpperCase()));
        const location = tokens.filter((t) => t.toUpperCase() !== (brand || "").toUpperCase()).join(" ");

        return { brand, location };
    };

    // 검색 함수
    const handleSearch = (input: string) => {
        if (!mapRef || !input || !currentPosition) return;

        const { brand, location } = parseKeyword(input);
        const service = new google.maps.places.PlacesService(mapRef);

        // 공통 로직: bounds + markers 헬퍼
        const fitBoundsWithMarkers = (places: google.maps.places.PlaceResult[]) => {
            const bounds = new google.maps.LatLngBounds();
            const markers: google.maps.places.PlaceResult[] = [];

            for (const place of places) {
                if (!place.geometry || !place.geometry.location) continue;
                bounds.extend(place.geometry.location);
                markers.push(place);
            }

            if (markers.length === 0) {
                alert("유효한 위치를 가진 장소가 없습니다.");
                return false;
            }

            setStoreMarkers(markers); //마커 상태 업데이트
            mapRef.fitBounds(bounds);
            return true;
        };

        // 1) 브랜드+위치 둘 다 있는 경우 → 위치 먼저 검색 후 주변 편의점 nearbySearch + 브랜드 필터
        if (brand && location) {
            // 위치 이름으로 장소 검색
            service.textSearch({ query: location }, (locResults, locStatus) => {
                if (locStatus === google.maps.places.PlacesServiceStatus.OK && locResults && locResults.length > 0) {
                    const loc = locResults[0].geometry?.location;
                    if (!loc) return alert("위치 정보를 찾을 수 없습니다.");

                    service.nearbySearch({ location: loc, radius: 1000, type: "convenience_store" }, (nearbyResults, nearbyStatus) => {
                        if (nearbyStatus === google.maps.places.PlacesServiceStatus.OK && nearbyResults) {
                            const filtered = nearbyResults.filter(p =>
                                p.name?.toUpperCase().includes(brand.toUpperCase())
                            );
                            if (!fitBoundsWithMarkers(filtered)) alert("해당 조건에 맞는 편의점이 없습니다.");
                        } else {
                            alert("근처 편의점 정보를 찾을 수 없습니다.");
                        }
                    });
                } else {
                    alert("위치 정보를 찾을 수 없습니다.");
                }
            });
            return;
        }

        // 2) 위치만 있는 경우 → 위치 먼저 검색 후 주변 편의점 전체 표시
        if (!brand && location) {
            service.textSearch({ query: location }, (locResults, locStatus) => {
                if (locStatus === google.maps.places.PlacesServiceStatus.OK && locResults && locResults.length > 0) {
                    const loc = locResults[0].geometry?.location;
                    if (!loc) return alert("위치 정보를 찾을 수 없습니다.");

                    service.nearbySearch({ location: loc, radius: 1000, type: "convenience_store" }, (nearbyResults, nearbyStatus) => {
                        if (nearbyStatus === google.maps.places.PlacesServiceStatus.OK && nearbyResults) {
                            if (!fitBoundsWithMarkers(nearbyResults)) alert("해당 조건에 맞는 편의점이 없습니다.");
                        } else {
                            alert("근처 편의점 정보를 찾을 수 없습니다.");
                        }
                    });
                } else {
                    alert("위치 정보를 찾을 수 없습니다.");
                }
            });
            return;
        }

        // 3) 브랜드만 있는 경우 → 현재 위치 기준 nearbySearch + 브랜드 필터
        if (brand && !location) {
            service.nearbySearch({ location: currentPosition, radius: 1000, type: "convenience_store" }, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                    const filtered = results.filter(p =>
                        p.name?.toUpperCase().includes(brand.toUpperCase())
                    );
                    if (!fitBoundsWithMarkers(filtered)) alert("해당 조건에 맞는 편의점이 없습니다.");
                } else {
                    alert("근처 편의점 정보를 찾을 수 없습니다.");
                }
            });
            return;
        }

        // 4) 그 외 → 입력값 그대로 textSearch
        service.textSearch({ query: input }, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
                if (!fitBoundsWithMarkers(results)) alert("유효한 위치를 가진 장소가 없습니다.");
            } else {
                alert("검색 결과가 없습니다.");
            }
        });
    };



    // 로드 에러 또는 로딩 중인 경우 처리
    if (loadError) return <div>지도를 불러오는 중 오류가 발생했습니다.</div>;

    if (!isLoaded || !currentPosition || isLoading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin shadow-md"></div>
            </div>
        );
    }

    return (
        <div className="relative">
            {/*검색창 컴포넌트*/}
            <StoreSearchComponent onSearch={handleSearch} />

            {/*주변 편의점 표시 버튼*/}
            <button
                onClick={() => setShowNearbyStores(!showNearbyStores)}
                className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-gray-100 transition"
                title={showNearbyStores ? "Hide Nearby Convenience Stores" : "Show Nearby Convenience Stores"}
            >
                {showNearbyStores ? <EyeSlashIcon /> : <BuildingStorefrontIcon />}
            </button>

            {/* 구글맵 컴포넌트 */}
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={currentPosition}
                zoom={15}
                onLoad={(map) => setMapRef(map)}
            >
                {/* 현재위치 마커 */}
                <Marker position={currentPosition} />

                {/* 편의점 마커들 */}
                {storeMarkers.map((place, idx) => {
                    const pos = {
                        lat: place.geometry?.location?.lat() || 0,
                        lng: place.geometry?.location?.lng() || 0,
                    };

                    return (
                        <Marker
                            key={idx}
                            position={pos}
                            icon={{
                                url: 'https://img.icons8.com/?size=100&id=9rCm9FIFH5qA&format=png&color=000000',
                                scaledSize: new google.maps.Size(20, 20),
                            }}
                            onClick={() => {
                                if (!mapRef || !place.place_id) return; // place_id 없으면 불가

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
                {selectedStore && selectedPosition && (
                    <StoreInfoWindowComponent
                        position={selectedPosition}
                        selectedStore={selectedStore}
                        onClose={() => {
                            setSelectedStore(null);
                            setSelectedPosition(null);
                        }}
                    />
                )}
            </GoogleMap>


        </div>

    );
};

export default MapContainerComponent;