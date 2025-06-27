import { useNavigate } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function NotFoundPage() {

    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            {/* 로티 + 404 텍스트 가로 정렬 */}
            <div className="flex items-center space-x-2 mb-8">
                <div className="w-40 h-40">
                    <DotLottieReact
                        src="/loading/lottie_error.lottie"
                        loop
                        autoplay
                    />
                </div>
                {/*<div className="text-center">*/}
                {/*    <h1 className="text-6xl font-bold text-gray-400">404</h1>*/}
                {/*</div>*/}
            </div>

            {/* 버튼 두 개 세로 정렬 */}
            <div className="flex items-center justify-center space-x-3">
                <button
                    onClick={() => navigate(-1)}
                    className="px-6 py-2 bg-gray-400 shadow-sm  text-white font-semibold rounded-md transition"
                >
                    Go Back
                </button>
                <button
                    onClick={() => navigate("/main")}
                    className="px-6 py-2 bg-amber-400 text-white shadow-sm font-semibold rounded-md transition"
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
}
