import { useEffect, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface FloatingHeartProps {
    x: number;
    y: number;
}

export default function FloatingHearts({ x, y }: FloatingHeartProps) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => setVisible(false), 1300); // 1초 후 사라지게
        return () => clearTimeout(timeout);
    }, []);

    return (
        <div
            className={`absolute pointer-events-none z-50 w-60 h-60 transition-opacity duration-700 ease-out ${
                visible ? "opacity-100" : "opacity-0"
            }`}
            style={{ left: x, top: y }}
        >
            <DotLottieReact
                src="https://lottie.host/aba4b68b-eb72-4487-a9d7-53343bd4b640/zrDbRR0n8E.lottie"
                loop={false}
                autoplay
                speed={1.5}
            />
        </div>
    );
}