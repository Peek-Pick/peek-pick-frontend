import { useCallback } from "react";

type Brand = {
    name: string;
    aliases: string[];
};

const brands = [
    { name: "CU", aliases: ["CU", "씨유"] },
    { name: "GS25", aliases: ["GS25", "GS 25", "GS", "지에스", "지에스25"] },
    { name: "7-Eleven", aliases: ["7-Eleven", "7ELEVEN", "7 일레븐", "7일레븐", "세븐일레븐", "세븐", "seveneleven", "seven-eleven", "seven_eleven", "seven"] },
    { name: "EMART24", aliases: ["EMART24", "Emart", "이마트24", "이마트"] },
];

// 검색어 브랜드, 장소 분리
const parseKeyword = (input: string): { brand?: Brand; location?: string } => {
    const tokens = input.trim().split(/\s+/);
    const upperTokens = tokens.map((t) => t.toUpperCase());

    const brand = brands.find(b =>
        b.aliases.some(alias => upperTokens.includes(alias.toUpperCase()))
    );
    const brandAliases = brand ? brand.aliases.map(a => a.toUpperCase()) : [];

    const locationTokens = tokens.filter(t => !brandAliases.includes(t.toUpperCase()));
    const location = locationTokens.join(" ");

    return { brand, location };
};

// 검색 훅
export const useMapSearch = (
    mapRef: google.maps.Map,
    currentPosition: google.maps.LatLngLiteral  | null,
    setStoreMarkers: (places: google.maps.places.PlaceResult[]) => void
) => {
    const handleSearch = useCallback(  // useCallback - 컴포넌트가 리렌더링될 때마다, 함수가 새로 만들어지는 걸 막아줌.
        (input: string) => {
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
                    return false;
                }

                setStoreMarkers(markers); //마커 상태 업데이트
                mapRef.fitBounds(bounds);
                return true;
            };

            // 1) 브랜드+위치 둘 다 있는 경우 → 위치 먼저 검색 후 주변 편의점 nearbySearch + 브랜드 필터
            if (brand && location) {
                service.textSearch({ query: location }, (locResults, locStatus) => {
                    if (locStatus === google.maps.places.PlacesServiceStatus.OK && locResults && locResults.length > 0) {
                        const loc = locResults[0].geometry?.location;
                        if (!loc) return alert("위치 정보를 찾을 수 없습니다.");

                        service.nearbySearch({ location: loc, radius: 1000, type: "convenience_store" }, (nearbyResults, nearbyStatus) => {
                            if (nearbyStatus === google.maps.places.PlacesServiceStatus.OK && nearbyResults) {
                                const filtered = nearbyResults.filter(p =>
                                    brand?.aliases?.some(alias =>
                                        p.name?.toUpperCase().includes(alias.toUpperCase())
                                    )
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
                            brand?.aliases?.some(alias =>
                                p.name?.toUpperCase().includes(alias.toUpperCase())
                            )
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
        },
        [mapRef, currentPosition, setStoreMarkers]
    );

    return { handleSearch };
};
