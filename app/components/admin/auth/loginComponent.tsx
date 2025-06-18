import { useNavigate } from "react-router-dom";
import { type FormEvent, useState } from "react";
import LoadingComponent from "~/components/common/loadingComponent";
import { getAdminToken } from "~/api/auth/authAPI";

function LoginComponent() {
    const navigate = useNavigate();
    const [aid, setAid] = useState('');
    const [apw, setApw] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await getAdminToken(aid, apw);
            navigate('/admin/dashboard');
        } catch (error) {
            console.error('로그인 실패', error);
            alert('로그인에 실패했습니다. 아이디 또는 비밀번호를 확인하세요.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* 로딩 오버레이: 항상 최상단에 배치 */}
            <LoadingComponent isLoading={isLoading} />

            <div
                className="bg-[#fefefe] relative flex flex-col items-center justify-start"
                style={{ fontFamily: "'Quicksand', sans-serif" }}
            >
                {/* 배경 이미지 */}
                <img
                    src="/BackgroundCard1.png"
                    alt="Profile Background"
                    className="w-full h-[250px] object-cover rounded-[20px]"
                />

                {/* 로그인 카드 */}
                <div
                    className="absolute top-[200px] w-[550px] max-w-2xl bg-white/70 backdrop-blur-[40px] border-2 border-white/80 dark:border-white/30 rounded-[16px] shadow-xl p-8 z-10"
                >
                    <h2 className="text-3xl font-semibold tracking-wide disabled:opacity-50 text-center text-[#1e3a8a] mb-8 leading-snug">
                        관리자 로그인
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6 text-gray-800 pb-2">
                        <div>
                            <label htmlFor="adminId" className="block text-sm font-semibold mb-2">
                                아이디
                            </label>
                            <input
                                id="adminId"
                                type="text"
                                value={aid}
                                onChange={(e) => setAid(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] text-sm"
                                placeholder="admin1234"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold mb-2">
                                비밀번호
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={apw}
                                onChange={(e) => setApw(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] text-sm"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#1e3a8a] text-white py-3 rounded-md shadow-md hover:bg-[#1e40af] transition duration-300 ease-in-out text-base font-bold tracking-wide disabled:opacity-50"
                        >
                            로그인
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default LoginComponent;