import {type FormEvent, useEffect, useState} from "react";
import {getToken} from "~/api/auth/authAPI";
import {Link, useNavigate} from "react-router-dom";
import {FaGoogle} from "react-icons/fa";
import {getGoogleLoginLink} from "~/api/auth/googleAPI";
import {useAdminAuth} from "~/contexts/AdminAuthContext";
import {LoginLoading} from "~/util/loading/loginLoading";
import Swal from "sweetalert2";
import '~/util/swal/customSwal.css'
import {useTranslation} from "react-i18next";
import i18n from "i18next";
import { FaGlobe } from "react-icons/fa";

const LoginComponent = () => {
    // 국제화 적용
    const { t } = useTranslation();

    // 국제화 - 설정 언어
    const [showLangMenu, setShowLangMenu] = useState(false);
    const [language, setLanguage] = useState(i18n.language || "en");

    // 국제화 - 설정 언어 변경 핸들러
    const handleLanguageChange = (lang: string) => {
        i18n.changeLanguage(lang);
        setLanguage(lang);
        setShowLangMenu(false);
    };

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
            console.error(error);
            await Swal.fire({
                title: "Login failed. Please check your email or password.",
                icon: "error",
                confirmButtonText: "OK",
                customClass: {
                    popup: "custom-popup",
                    title: "custom-title",
                    actions: "custom-actions",
                    confirmButton: "custom-confirm-button",
                },
            });
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
            {/* 언어 선택 버튼 */}
            <div className="absolute top-5 right-5 z-20">
                <button
                    onClick={() => setShowLangMenu(!showLangMenu)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white bg-opacity-80 backdrop-blur-md rounded-full border shadow hover:shadow-md transition-all duration-200"
                >
                    <FaGlobe className="text-gray-600" />
                    <span className="text-sm text-gray-700 capitalize">
                        {language === "en" ? "English" : language === "ko" ? "한국어" : "日本語"}
                    </span>
                </button>

                {showLangMenu && (
                    <div className="mt-2 absolute right-0 bg-white border rounded-lg shadow-md w-32">
                        <button onClick={() => handleLanguageChange("en")}
                                className="block w-full px-4 py-2 text-sm hover:bg-gray-100 text-left"
                        >
                            English
                        </button>
                        <button onClick={() => handleLanguageChange("ko")}
                                className="block w-full px-4 py-2 text-sm hover:bg-gray-100 text-left"
                        >
                            한국어
                        </button>
                        <button onClick={() => handleLanguageChange("ja")}
                                className="block w-full px-4 py-2 text-sm hover:bg-gray-100 text-left"
                        >
                            日本語
                        </button>
                    </div>
                )}
            </div>

            {/* 로그인 카드 */}
            <div
                className="absolute top-20 w-[90%] max-w-xl bg-white/70 backdrop-blur-[40px] border-2 border-white/80 rounded-2xl shadow-xl p-8 z-10"
            >
                <h1 className="text-xl font-semibold tracking-wide text-center text-gray-500 mb leading-snug">
                    Log In to
                </h1>
                <h1 className="text-3xl font-semibold tracking-wide text-center text-yellow-500 mb-8 leading-snug">
                    Peek&Pick
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6 text-gray-800 pb-2">
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold mb-2">{t('loginFormEmail')}</label>
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
                        <label htmlFor="password" className="block text-sm font-semibold mb-2">{t('loginFormPassword')}</label>
                        <input
                            id="password"
                            type="password"
                            value={mpw}
                            onChange={(e) => setMpw(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                            placeholder="••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-300 text-white py-3 rounded-md shadow-md transition duration-300 ease-in-out text-base font-bold tracking-wide disabled:opacity-50"
                    >
                        {t('loginButton')}
                    </button>
                </form>

                <div className="text-center text-sm mt-4">
                    {t('signupGuid')}
                    <Link to="/signup" className="text-yellow-500 font-bold ml-1">
                        {t('signupButton')}
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
                            : "bg-white text-gray-500 border-gray-400 active:border-yellow-400 active:text-yellow-500"}
                            `}>
                        <FaGoogle className="w-5 h-5"/>
                        {t('loginWithGoogle')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginComponent;