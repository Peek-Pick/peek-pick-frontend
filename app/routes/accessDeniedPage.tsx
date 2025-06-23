import { useNavigate } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function AccessDeniedPage() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center text-center px-4 py-5 min-h-[80vh]">
            <div className="flex flex-col items-center text-center px-4">
                <div className="w-40 h-40">
                    <DotLottieReact
                        src="/loading/lottie_denied.lottie"
                        loop
                        autoplay
                    />
                </div>
                <h2 className="text-2xl font-bold text-red-500 mb-2">Access Denied</h2>
                <p className="text-gray-600 text-base">
                    You cannot access this page directly. <br />
                    Please follow the proper signup process.
                </p>
                <button
                    onClick={() => navigate("/signup")}
                    className="mt-6 px-4 py-2 bg-gray-400 shadow-2xl hover:bg-amber-400 text-white font-semibold rounded-md transition"
                >
                    Go to Signup
                </button>
            </div>
        </div>
    );
}
