// src/components/common/FloatingActionButtons.tsx

import { ArrowUp, ArrowDown, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function BackButton() {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(-1)}
            className="fixed bottom-6 left-4 bg-white hover:bg-gray-100 text-gray-600 rounded-full p-3 shadow-md ring-1 ring-gray-300 transition-all duration-200 opacity-90 hover:opacity-100 z-50"
            aria-label="뒤로가기"
        >
            <ArrowLeft size={20} />
        </button>
    );
}

export function FloatingActionButtons() {
    const navigate = useNavigate();

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="fixed bottom-6 right-4 flex flex-col gap-3 z-50">
            <button
                onClick={scrollToTop}
                className="bg-white hover:bg-gray-100 text-gray-600 rounded-full p-3 shadow-md ring-1 ring-gray-300 transition-all duration-200 opacity-90 hover:opacity-100"
                aria-label="맨 위로"
            >
                <ArrowUp size={20} />
            </button>
        </div>
    );
}
