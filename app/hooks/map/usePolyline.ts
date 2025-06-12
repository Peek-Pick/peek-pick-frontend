import { useEffect, useRef } from 'react';


const usePolyline = (map: google.maps.Map | null, path: google.maps.LatLngLiteral[]) => {

    const polylineRef = useRef<google.maps.Polyline | null>(null);

    useEffect(() => {
        if (!map || path.length === 0) return;

        // 기존에 그려진 폴리라인이 있다면 지도에서 제거
        if (polylineRef.current) {
            polylineRef.current.setMap(null);
        }

        // 새 폴리라인 생성 및 지도에 추가
        polylineRef.current = new google.maps.Polyline({
            path,                  // 경로 데이터
            map,                   // 표시할 지도 인스턴스
            strokeColor: '#1976d2', // 선 색상 (파란색)
            strokeOpacity: 0.8,     // 선 투명도
            strokeWeight: 5,        // 선 두께
        });

        return () => {
            if (polylineRef.current) {
                polylineRef.current.setMap(null);
                polylineRef.current = null;
            }
        };
    }, [map, path]);
};

export default usePolyline;
