import {type FormEvent, useState} from 'react';
import {getToken} from "~/api/auth/authAPI";
import {Link, useNavigate} from "react-router-dom";
import {getGoogleLoginLink} from "~/api/auth/googleAPI";
import LoadingComponent from "~/components/common/loadingComponent";


const LoginComponent = () => {

    const navigate = useNavigate();
    const googleLink = getGoogleLoginLink();

    const [mem, setMem] = useState('');
    const [mpw, setMpw] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await getToken(mem, mpw);   // 백에서 HttpOnly 쿠키까지 내려줌
            navigate('');          // 성공 시 인덱스 → 홈으로 이동
        } catch (error) {
            console.error('로그인 실패', error);
            alert('로그인에 실패했습니다. 이메일 또는 비밀번호를 확인하세요.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* 로딩 오버레이 */}
            <LoadingComponent isLoading={isLoading} />

            <div className="flex justify-center items-center w-full h-full px-4 py-8">
                <div className="w-full max-w-sm bg-white shadow-lg rounded-2xl p-6 space-y-6">
                    <h2 className="text-2xl font-bold text-center text-gray-800">로그인</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                이메일
                            </label>
                            <input
                                id="email"
                                type="email"
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
                                id="password"
                                type="password"
                                value={mpw}
                                onChange={(e) => setMpw(e.target.value)}
                                className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition disabled:opacity-50"
                        >
                            로그인
                        </button>
                    </form>

                    <div className="text-center text-sm text-gray-600">
                        계정이 없으신가요?{' '}
                        <Link to="/signup" className="text-blue-500 hover:underline font-medium">
                            회원가입
                        </Link>
                    </div>

                    <div className="relative text-center text-sm text-gray-400">
                        <span className="bg-white px-2 relative z-10">간편로그인</span>
                        <div className="absolute top-1/2 left-0 w-full border-t border-gray-200 z-0" />
                    </div>

                    <div className="flex justify-center">
                        <Link
                            to={googleLink}
                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                        >
                            Google 로그인
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginComponent;
