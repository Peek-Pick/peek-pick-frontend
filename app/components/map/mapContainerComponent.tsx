
import { useEffect, useState } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

import StoreSearchComponent from "~/components/map/storeSearchComponent";

// 지도 컨테이너 스타일
const containerStyle = {
    width: '100%',
    height: '500px',
};

// 사용할 라이브러리
const libraries = ['places'];

const MapContainerComponent: React.FC = () => {

    const [currentPosition, setCurrentPosition] = useState<google.maps.LatLngLiteral | null>(null); // 현재 위치 저장용 상태
    const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);
    const [storeMarkers, setStoreMarkers] = useState<google.maps.LatLngLiteral[]>([]);
    const [searchResult, setSearchResult] = useState<google.maps.LatLngLiteral | null>(null);


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
        if (mapRef && currentPosition) {
            const service = new google.maps.places.PlacesService(mapRef);

            const request: google.maps.places.PlaceSearchRequest = {
                location: currentPosition,
                radius: 1000, // 1km 반경
                type: 'convenience_store',
            };

            service.nearbySearch(request, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                    const markers = results.map((place) => ({
                        lat: place.geometry?.location?.lat() || 0,
                        lng: place.geometry?.location?.lng() || 0,
                    }));
                    setStoreMarkers(markers);
                }
            });
        }
    }, [mapRef, currentPosition]);

    const brands = ["CU", "GS25", "세븐일레븐"];
    // 검색어 브랜드, 장소 분리
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

        // bounds + markers 헬퍼
        const fitBoundsWithMarkers = (places: (google.maps.places.PlaceResult | google.maps.places.Place)[]) => {
            const bounds = new google.maps.LatLngBounds();
            const markers: google.maps.LatLngLiteral[] = [];

            for (const place of places) {
                if (!("geometry" in place) || !place.geometry || !place.geometry.location) continue; // geometry 또는 location 정보가 없으면 건너뜀

                const loc = place.geometry.location;
                bounds.extend(loc);
                markers.push({ lat: loc.lat(), lng: loc.lng() });
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
    if (!isLoaded || !currentPosition) return <div>지도를 불러오는 중...</div>;

    return (
        <>
            {/*편의점 검색 컴포넌트*/}
            <StoreSearchComponent onSearch={handleSearch} />

            <GoogleMap
                mapContainerStyle={containerStyle}
                center={currentPosition}
                zoom={15}
                onLoad={(map) => setMapRef(map)}
            >
                {/*현재위치 마커 표시*/}
                <Marker position={currentPosition} />
                {/* 편의점 마커들 */}
                {storeMarkers.map((pos, idx) => (
                    <Marker key={idx} position={pos}
                        icon={{
                            url: 'https://img.icons8.com/?size=100&id=9rCm9FIFH5qA&format=png&color=000000',
                            scaledSize: new google.maps.Size(20, 20),
                        }}
                    />
                ))}

                {searchResult && (
                    <Marker
                        position={searchResult}
                        icon={{
                            url: 'https://img.icons8.com/?size=100&id=9rCm9FIFH5qA&format=png&color=ff0000',
                            scaledSize: new google.maps.Size(30, 30),
                        }}
                    />
                )}
            </GoogleMap>
        </>

    );
};

export default MapContainerComponent;
