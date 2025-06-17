import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [
    "/carousel/review_event.png",
    "/carousel/bingsu.png",
    "/carousel/invitation.png",
    "/carousel/summer_event.png",
    "/carousel/best_photo_review.png",
];

export default function CarouselComponent() {
    const [current, setCurrent] = useState(0);
    const total = images.length;

    // 슬라이드 함수
    const nextSlide = () => setCurrent((prev) => (prev + 1) % total);
    const prevSlide = () => setCurrent((prev) => (prev - 1 + total) % total);

    // 자동 슬라이드
    useEffect(() => {
        const interval = setInterval(nextSlide, 5000); // 5초마다 전환
        return () => clearInterval(interval);
    }, [current]);

    return (
        <div className="relative w-full overflow-hidden h-[50vh]">
            {/* 이미지 슬라이드 */}
            <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${current * 100}%)` }}>
                {images.map((src, index) => (
                    <img
                        key={index}
                        src={src}
                        alt={`Slide ${index + 1}`}
                        className="w-full flex-shrink-0 object-cover h-[50vh]"
                    />
                ))}
            </div>

            {/* 이전 / 다음 버튼 */}
            <button
                onClick={prevSlide}
                className="absolute top-1/2 left-2 bg-white/50 hover:bg-white rounded-full p-2 shadow"
                aria-label="Previous slide"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute top-1/2 right-2 bg-white/50 hover:bg-white rounded-full p-2 shadow"
                aria-label="Next slide"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* 인디케이터 */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`w-3 h-3 rounded-full ${current === i ? "bg-white" : "bg-white/50"}`}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
