import {type FormEvent, useEffect, useState} from "react";
import {getToken} from "~/api/auth/authAPI";
import {Link, useNavigate} from "react-router-dom";
import {FaGoogle} from "react-icons/fa";
import LoadingComponent from "~/components/common/loadingComponent";
import {getGoogleLoginLink} from "~/api/auth/googleAPI";
import {useAdminAuth} from "~/contexts/AdminAuthContext";
import {LoginLoading} from "~/util/loading/loginLoading";

const LoginComponent = () => {
    const navigate = useNavigate();
    const [mem, setMem] = useState('');
    const [mpw, setMpw] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { logout } = useAdminAuth();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await Promise.all([
                getToken(mem, mpw),
                new Promise(res => setTimeout(res, 1500)),
            ]);
            logout();
            navigate('/main');
        } catch (error) {
            console.error('로그인 실패', error);
            alert('로그인에 실패했습니다. 이메일 또는 비밀번호를 확인하세요.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        setIsLoading(true);
        setTimeout(() => {
            const googleLink = getGoogleLoginLink();
            window.location.href = googleLink;
        }, 1500);   // 1.5초 타임아웃
    };

    if (isLoading)
        return <LoginLoading />

    return (
        <div
            className="max-w-2xl mx-auto shadow-xl relative rounded-[20px] flex flex-col items-center justify-start"
            style={{fontFamily: "'Quicksand', sans-serif"}}
        >

            {/* 로그인 카드 */}
            <div
                className="absolute top-20 w-[90%] max-w-xl bg-white/70 backdrop-blur-[40px] border-2 border-white/80 rounded-2xl shadow-xl p-8 z-10"
            >
                <h2 className="text-3xl font-semibold tracking-wide text-center text-gray-800 mb-8 leading-snug">
                    로그인
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6 text-gray-800 pb-2">
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold mb-2">이메일</label>
                        <input
                            id="email"
                            type="email"
                            value={mem}
                            onChange={(e) => setMem(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold mb-2">비밀번호</label>
                        <input
                            id="password"
                            type="password"
                            value={mpw}
                            onChange={(e) => setMpw(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-300 text-white py-3 rounded-md shadow-md transition duration-300 ease-in-out text-base font-bold tracking-wide disabled:opacity-50"
                    >
                        로그인
                    </button>
                </form>

                <div className="text-center text-sm mt-4">
                    계정이 없으신가요?
                    <Link to="/signup" className="text-yellow-500 font-bold ml-1">
                        회원가입
                    </Link>
                </div>

                <hr className="border-t border-dashed border-gray-300 my-6"/>

                <div className="flex justify-center">
                    <button
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border-2 text-sm font-medium transition
                            ${isLoading
                            ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
                            : "bg-white text-yellow-500 border-yellow-400 hover:border-yellow-500 hover:text-yellow-600 hover:bg-yellow-50 active:border-yellow-600"}
                            `}>
                        <FaGoogle className="w-5 h-5"/>
                        Google 로그인
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginComponent;