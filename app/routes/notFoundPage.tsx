import { useNavigate } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function NotFoundPage() {

    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-40 h-40">
                <DotLottieReact
                    src="/loading/lottie_error.lottie"
                    loop
                    autoplay
                />
            </div>
            <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-800">404</h1>
                <button
                    onClick={() => navigate("/main")}
                    className="mt-6 px-4 py-2 bg-gray-400 shadow-2xl hover:bg-amber-400 text-white font-semibold rounded-md transition"
                >
                    Go to Home
                </button>
            </div>
        </div>
    );
}
