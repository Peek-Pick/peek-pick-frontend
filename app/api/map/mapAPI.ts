import axiosInstance from "~/instance/axiosInstance";
import polyline from "@mapbox/polyline"; // 디코더

// Google Maps용 좌표 형식
export interface LatLng {
    lat: number;
    lng: number;
}

// 길찾기 경로 가져오기
export async function getDirections(start: LatLng, end: LatLng): Promise<LatLng[] | null> {
    const response = await axiosInstance.get("/map/directions", {
        params: {
            startLat: start.lat,
            startLng: start.lng,
            endLat: end.lat,
            endLng: end.lng,
        },
    });

    console.log('ORS 응답:', response.data);

    // ORS 응답에서 routes 배열 추출
    const routes = response.data?.routes;
    if (!routes || routes.length === 0) {
        console.warn("경로 없음:", response.data);
        return null;
    }

    // geometry 필드는 인코딩된 polyline 문자열임 → 디코딩 필요
    const encodedPolylines = routes[0].geometry;
    const decoded: [number, number][] = polyline.decode(encodedPolylines); // [lat, lng][]

    // Google Maps 형식인 { lat, lng } 객체 배열로 변환
    const path: LatLng[] = decoded.map(([lat, lng]) => ({ lat, lng }));

    return path;

}
