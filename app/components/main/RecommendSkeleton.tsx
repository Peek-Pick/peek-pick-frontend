import { useNavigate } from "react-router-dom";

interface headerProps {
    msg: string,
}

export default function RecommendSkeleton({msg}:headerProps) {

    const navigate = useNavigate();

    const dummyArray = new Array(6).fill(0); // 6개 스켈레톤 카드

    return (
        <section className="px-4 py-4 bg-white">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-gray-500 ">
                    {msg}
                </h2>
            </div>

            <section className="relative px-4 py-4 bg-white">
                {/* 안내 메시지 오버레이 */}
                <div
                    className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 rounded-xl"
                    style={{ backgroundColor: "rgba(180, 180, 180, 0.3)" }}
                >
                    <p className="text-gray-700 text-m mb-4">
                        👋 Please log in to view.
                    </p>
                    <button
                        onClick={() => navigate("/login")}
                        className="px-4 py-2 bg-amber-300 text-white rounded transition"
                    >
                        Go to Login
                    </button>
                </div>

                {/* 스켈레톤 or 추천 상품 */}
                <div
                    className="overflow-x-auto no-scrollbar relative z-0"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    <div className="flex gap-2">
                        {dummyArray.map((_, index) => (
                            <div
                                key={index}
                                className="min-w-[160px] flex-shrink-0 bg-white border border-[#eee] rounded-xl shadow-md p-2"
                            >
                                <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-gray-300 animate-pulse" />
                                <div className="w-[140px] h-[140px] mb-3 bg-gray-200 rounded-md animate-pulse" />
                                <div className="h-4 bg-gray-200 rounded mb-2 w-full animate-pulse" />
                                <div className="flex items-center space-x-3 mb-1">
                                    <div className="flex items-center space-x-1">
                                        <div className="w-4 h-4 bg-gray-300 rounded-full animate-pulse" />
                                        <div className="w-6 h-3 bg-gray-200 rounded animate-pulse" />
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <div className="w-4 h-4 bg-gray-300 rounded-full animate-pulse" />
                                        <div className="w-6 h-3 bg-gray-200 rounded animate-pulse" />
                                    </div>
                                </div>
                                <div className="w-16 h-3 bg-gray-200 rounded mb-1 animate-pulse" />
                                <div className="w-12 h-3 bg-gray-200 rounded animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </section>
    );
}