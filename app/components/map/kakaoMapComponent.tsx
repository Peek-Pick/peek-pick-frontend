
import { useEffect, useRef, useState } from "react";
import MapSearchComponent from "./mapSearchComponent";

type Place = {
    x: string;
    y: string;
    place_name: string;
};

function KakaoMapComponent() {
    const [keyword, setKeyword] = useState(""); // 검색어 상태
    const mapRef = useRef<kakao.maps.Map | null>(null); // 지도 객체 참조 저장
    const markersRef = useRef<kakao.maps.Marker[]>([]); // 마커 리스트 참조 저장

    const kakao_map_key = import.meta.env.VITE_APP_KAKAO_MAP_KEY;

    useEffect(() => {
        // 카카오 맵 SDK 동적 로딩
        const script = document.createElement('script');
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakao_map_key}&autoload=false&libraries=services`;
        script.async = true;
        script.onload = () => {
            window.kakao.maps.load(() => {
                // 지도 생성 및 초기 설정
                const container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
                const options = {
                    center: new window.kakao.maps.LatLng(37.5665, 126.9780), //지도의 중심 좌표
                    level: 3,
                };
                const map = new window.kakao.maps.Map(container, options); //지도 생성 및 객체 리턴
                mapRef.current = map; // 지도 객체 저장

                // 사용자 현재 위치 가져오기
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const lat = position.coords.latitude;
                            const lng = position.coords.longitude;
                            const userLocation = new window.kakao.maps.LatLng(lat, lng);

                            // 현재 위치로 지도 중심 이동
                            map.setCenter(userLocation);

                            // 현재 위치에 마커 표시
                            new window.kakao.maps.Marker({
                                map,
                                position: userLocation,
                                title: "현재 위치",
                            });

                            // 장소 검색 서비스 생성
                            const ps = new window.kakao.maps.services.Places();

                            // 현재 위치 기준 1km 내 편의점 검색 (카테고리: CS2)
                            ps.categorySearch(
                                "CS2",
                                (data: Place[], status: string, pagination: any) =>
                                    handleCategorySearch(undefined, map, status, data),
                                {
                                    location: userLocation,
                                    radius: 1000,
                                }
                            );
                        },
                    );
                }
            });
        };
        document.head.appendChild(script);
    }, []);


    // 기존 마커 제거 함수
    const clearMarkers = () => {
        markersRef.current.forEach((m) => m.setMap(null));
        markersRef.current = [];
    };

    //편의점 브랜드 목록
    const BRANDS = [
        { name: "CU", aliases: ["CU", "씨유"] },
        { name: "GS25", aliases: ["GS25", "지에스25"] },
        { name: "세븐일레븐", aliases: ["세븐일레븐", "SEVEN-ELEVEN", "SEVENELEVEN", "SEVEN_ELEVEN", "7ELEVEN", "7-ELEVEN", "7 ELEVEN"] },
        { name: "이마트24", aliases: ["이마트24", "EMART24"] },
    ];
    // 편의점 브랜드와 위치 분리
    const parseKeyword = (input: string) => {
        const tokens = input.trim().split(/\s+/);
        const upperTokens = tokens.map((t) => t.toUpperCase());

        let brandName: string | undefined;
        let matchedAlias: string | undefined;

        for (const brand of BRANDS) {
            for (const alias of brand.aliases) {
                if (upperTokens.includes(alias.toUpperCase())) {
                    brandName = brand.name;
                    matchedAlias = alias;
                    break;
                }
            }
            if (brandName) break;
        }

        const location = tokens
            .filter((t) => t.toUpperCase() !== matchedAlias?.toUpperCase())
            .join(" ");

        return { brand: brandName, location };
    };

    // 마커 생성 함수
    const createMarkers = (
        places: Array<{ x: string; y: string; place_name: string }>,
        brand: string | undefined,
        map: kakao.maps.Map
    ) => {
        const bounds = new window.kakao.maps.LatLngBounds();
        const markerImage = new window.kakao.maps.MarkerImage(
            "https://cdn-icons-png.flaticon.com/128/7561/7561269.png",
            new window.kakao.maps.Size(40, 40),
            { offset: new window.kakao.maps.Point(20, 40) }
        );

        places
            .filter((place) => {
                if (!brand) return true;
                return place.place_name.toUpperCase().includes(brand.toUpperCase());
            })
            .forEach((place) => {
                const pos = new window.kakao.maps.LatLng(place.y, place.x);
                const marker = new window.kakao.maps.Marker({
                    map,
                    position: pos,
                    title: place.place_name,
                    image: markerImage,
                });
                markersRef.current.push(marker);
                bounds.extend(pos);
            });

        map.setBounds(bounds);
    };

    // categorySearch 콜백 래핑 함수
    const handleCategorySearch = (
        brand: string | undefined,
        map: kakao.maps.Map,
        status: string,
        data: Array<{ x: string; y: string; place_name: string }>
    ) => {
        if (status === window.kakao.maps.services.Status.OK) {
            createMarkers(data, brand, map);
        } else {
            alert(brand ? `${brand} 주변에 해당 편의점이 없습니다.` : "해당 위치 주변에 편의점이 없습니다.");
        }
    };

    // 편의점 검색
    const handleSearch = () => {
        if (!mapRef.current || !window.kakao.maps.services) return;
        clearMarkers();

        const ps = new window.kakao.maps.services.Places();
        const { brand, location } = parseKeyword(keyword);

        // 1) 키워드가 브랜드 단독일 때 → 현재 위치 기준 브랜드 검색
        if (brand && !location) {
            if (!navigator.geolocation) {
                alert("현재 위치 정보를 사용할 수 없습니다.");
                return;
            }
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLocation = new window.kakao.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    mapRef.current!.setCenter(userLocation);

                    ps.categorySearch(
                        "CS2",
                        (data: Place[], status: string, pagination: any) =>
                            handleCategorySearch(brand, mapRef.current!, status, data),
                        {
                            location: userLocation,
                            radius: 1000,
                        }
                    );
                },
                () => {
                    alert("현재 위치 정보를 가져올 수 없습니다.");
                }
            );

            return;
        }

        // 2) 위치 포함된 일반 복합어 검색 (기존 로직)
        ps.keywordSearch(
            location,
            (
                data: Array<{ x: string; y: string; place_name: string }>,
                status: string,
                pagination: any
            ) => {
                if (status === window.kakao.maps.services.Status.OK) {
                    const firstPlace = data[0];
                    const centerLocation = new window.kakao.maps.LatLng(firstPlace.y, firstPlace.x);

                    mapRef.current!.setCenter(centerLocation);

                    ps.categorySearch(
                        "CS2",
                        (data: Place[], status: string, pagination: any) =>
                            handleCategorySearch(brand, mapRef.current!, status, data),
                        {
                            location: centerLocation,
                            radius: 1000,
                        }
                    );
                } else {
                    alert("검색 위치를 찾을 수 없습니다.");
                }
            }
        );
    };


    return (
        <>
            {/* 검색어 입력 컴포넌트 */}
            <MapSearchComponent
                keyword={keyword}
                setKeyword={setKeyword}
                onSearch={handleSearch}
            />
            {/* 지도가 표시될 영역 */}
            <div
                id="map"
                style={{
                    width: 'calc(100vw - 32px)', // 레이아웃 패딩 16px * 2 빼기
                    height: '70vh',
                    minHeight: 300,
                    margin: '0 auto',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                }}
            >
            </div></>
    );


}

export default KakaoMapComponent;
