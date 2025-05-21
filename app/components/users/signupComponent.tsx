export default function SignupComponent() {


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md space-y-6">
                <h2 className="text-2xl font-bold text-center text-gray-800">회원가입</h2>

                {/* 이메일 입력 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                    <input
                        type="email"
                        placeholder="example@email.com"
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {/* 비밀번호 입력 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
                    <input
                        type="password"
                        placeholder="비밀번호 입력"
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {/* 비밀번호 확인 입력 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호 확인</label>
                    <input
                        type="password"
                        placeholder="비밀번호 재입력"
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {/* 제출 버튼 */}
                <button
                    type="button"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-xl transition"
                >
                    가입하기
                </button>
            </div>
        </div>
    );
}
