import { useEffect, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const FloatingHearts = ({ x, y }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(false), 2400);
        return () => clearTimeout(timer);
    }, []);

    if (!visible) return null;

    return (
        <div
            className="absolute pointer-events-none z-50 w-60 h-60"
            style={{ left: x, top: y }}
        >
            <DotLottieReact
                src="https://lottie.host/aba4b68b-eb72-4487-a9d7-53343bd4b640/zrDbRR0n8E.lottie"
                loop
                speed={1.5}
                autoplay
            />
        </div>
    );
};

export default FloatingHearts;