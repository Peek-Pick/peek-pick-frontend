
interface Window {
    kakao: any;
}

declare namespace kakao {
    namespace maps {
        class Map {
            constructor(container: HTMLElement, options: any);
            setCenter(latlng: LatLng): void;
            setBounds(bounds: LatLngBounds): void;
        }

        class LatLng {
            constructor(lat: number, lng: number);
            getLat(): number;
            getLng(): number;
        }

        class LatLngBounds {
            constructor(sw?: LatLng, ne?: LatLng);
            extend(latlng: LatLng): void;
            getSouthWest(): LatLng;
            getNorthEast(): LatLng;
        }

        class Marker {
            constructor(options: MarkerOptions);
            setMap(map: Map | null): void;
            setPosition(position: LatLng): void;
        }

        class MarkerImage {
            constructor(src: string, size: Size, options?: MarkerImageOptions);
        }

        class Size {
            constructor(width: number, height: number);
            width: number;
            height: number;
        }

        class Point {
            constructor(x: number, y: number);
        }

        interface MarkerOptions {
            map?: Map;
            position: LatLng;
            title?: string;
            image?: MarkerImage;
        }
    }

    namespace maps.services {
        class Places {
            constructor();
            categorySearch(
                category: string,
                callback: (data: Array<{ x: string; y: string; place_name: string }>, status: string, pagination: any) => void,
                options?: any
            ): void;

            keywordSearch(
                keyword: string,
                callback: (data: Array<{ x: string; y: string; place_name: string }>, status: string, pagination: any) => void,
                options?: any
            ): void;
        }

        const Status: {
            OK: string;
            ZERO_RESULT: string;
            ERROR: string;
        };
    }
}