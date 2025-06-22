import ChatComponent from "~/components/chatbot/chatComponent";
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

export default function AIChatBot() {
    const navigate = useNavigate()

    // 로딩 스피너 보여주기용 타임아웃
    const [isLoading, setIsLoading] = useState(true);

    // 2초 동안 로딩스피너
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="flex w-full items-center bg-white justify-center h-screen">
                <img
                    src="/loading/chatbotLoading.gif"
                    alt="Loading..."
                    className="w-32 h-32 animate-spin"
                />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen w-full bg-amber-50">
            {/* 헤더 */}
            <header className="flex items-center justify-between bg-emerald-500 text-white py-3 px-5 font-semibold text-xl shadow-md">
                <div>Ai ChatBot</div>
                <button
                    onClick={() => navigate(-1)}
                    className="text-base text-white text-semibold border-2 border-white px-2 py-1 rounded-2xl"
                >
                    나가기
                </button>
            </header>

            {/* 대화 영역 */}
            <ChatComponent />
        </div>
    );
}