
import { useState, useEffect } from 'react';


function KakaoMapComponent() {

    const kakao_map_key = import.meta.env.VITE_APP_KAKAO_MAP_KEY;

    useEffect(() => {
        const script = document.createElement('script');
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakao_map_key}&autoload=false`;
        script.async = true;
        script.onload = () => {
            window.kakao.maps.load(() => {
                const container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
                const options = {
                    center: new window.kakao.maps.LatLng(37.5665, 126.9780), //지도의 중심 좌표
                    level: 3,
                };
                const map = new window.kakao.maps.Map(container, options); //지도 생성 및 객체 리턴

                // 현재 위치 가져오기
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const lat = position.coords.latitude;
                            const lng = position.coords.longitude;
                            const userLocation = new window.kakao.maps.LatLng(lat, lng);

                            // 지도 중심 이동
                            map.setCenter(userLocation);

                            // 마커 표시
                            new window.kakao.maps.Marker({
                                map,
                                position: userLocation,
                                title: "현재 위치",
                            });
                        },
                        () => {
                            alert("위치 정보를 가져오지 못했습니다.");
                        }
                    );
                } else {
                    alert("이 브라우저는 위치 정보를 지원하지 않음");
                }
            });
        };
        document.head.appendChild(script);
    }, []);



    return <div id="map" style={{ width: '100vm', height: '90vh', minHeight: 300 }}></div>
}

export default KakaoMapComponent;
