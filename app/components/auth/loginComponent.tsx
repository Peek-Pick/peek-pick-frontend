import React, {type FormEvent, useEffect, useState} from 'react';
import {setCookie} from "~/util/cookieUtil";
import {getToken} from "~/api/authAPI";
import {Link} from "react-router";
import {getGoogleLoginLink} from "~/api/googleAPI";


const LoginComponent = () => {

    const googleLink = getGoogleLoginLink();

    const [mem, setMem] = useState("");
    const [mpw, setMpw] = useState("");

    const handleSubmit = (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log("EMAIL:", mem, "PW:", mpw);

        getToken(mem, mpw).then((res) => {
            const accessToken = res[0]
            const refreshToken = res[1]

            setCookie('access_token', accessToken,1)
            setCookie('refresh_token', refreshToken, 7)

        })
    };

    return (
        <div className="flex justify-center items-center w-full h-full px-4 py-8">
            <div className="w-full max-w-sm bg-white shadow-lg rounded-2xl p-6 space-y-6">
                <h2 className="text-2xl font-bold text-center text-gray-800">로그인</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            이메일
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={mem}
                            onChange={(e) => setMem(e.target.value)}
                            className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            비밀번호
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={mpw}
                            onChange={(e) => setMpw(e.target.value)}
                            className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
                    >
                        로그인
                    </button>
                </form>

                {/* 회원가입 링크 */}
                <div className="text-center text-sm text-gray-600">
                    계정이 없으신가요?{' '}
                    <a href="/users/signup" className="text-blue-500 hover:underline font-medium">
                        회원가입
                    </a>
                </div>

                <div className="relative text-center text-sm text-gray-400">
                    <span className="bg-white px-2 relative z-10">간편로그인</span>
                    <div className="absolute top-1/2 left-0 w-full border-t border-gray-200 z-0" />
                </div>

                {/* Google 로그인 버튼(임시) */}
                <div id="googleSignInDiv" className="flex justify-center" />
                <Link to={googleLink}>구글</Link>

            </div>
        </div>
    );
};

export default LoginComponent;
