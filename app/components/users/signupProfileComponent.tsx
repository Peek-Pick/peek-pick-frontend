import { useSignupContext } from "~/contexts/signupContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router";
import { countryCodeMap } from "~/util/countryUtils";
import { SignupStepperHeader } from "~/components/users/signupStepperHeader";
import { useNicknameChecker } from "~/hooks/users/useNicknameChecker";
import { useAutoNickname } from "~/hooks/users/useAutoNickname";
import { Sparkles } from "lucide-react";

export default function SignupProfileComponent() {
    const {
        nickname, setNickname,
        birthDate, setBirthDate,
        gender, setGender,
        nationality, setNationality,
        setEmail, setPassword
    } = useSignupContext();

    // 닉네임 중복 확인 커스텀 훅
    const {
        isChecking,
        isAvailable,
        error: nicknameError,
    } = useNicknameChecker(nickname);

    const { generateUniqueNickname } = useAutoNickname();

    const location = useLocation();
    const navigate = useNavigate();

    // 이전 페이지의 이메일/비밀번호 초기화
    useEffect(() => {
        const emailFromState = location.state?.email;
        if (emailFromState) {
            setEmail(emailFromState);
            setPassword(null);
        }
    }, [location.state, setEmail]);

    // 자동 닉네임 생성 버튼 핸들러
    const handleAutoNickname = async () => {
        const autoNick = await generateUniqueNickname();
        setNickname(autoNick)
    };

    // gender와 nationality가 초기 null이면 기본값 설정
    // useEffect(() => {
    //     if (!gender) setGender("MALE");
    //     if (!nationality) setNationality("KOR");
    // }, []);

    // 페이지 이동 핸들러
    const moveToTagPage = (e: React.FormEvent) => {
        e.preventDefault();
        if (isAvailable) navigate("/signup/tag");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-yellow-200 to-green-300 px-4">
            <div className="w-full px-4">
                <SignupStepperHeader currentStep={2} />
            </div>
            <div className="mb-20 w-full max-w-md bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold text-center mb-6">Tell us more about you</h2>
                <form className="space-y-4" onSubmit={moveToTagPage}>
                    {/* 닉네임 */}
                    <div>
                        <label className="block text-sm font-medium">Nickname</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                className="w-full px-4 pr-10 py-3 mt-1 rounded-[15px] border border-gray-300 text-sm"
                                placeholder="Enter your nickname"
                                required
                            />
                            {/* 자동 닉네임 생성 아이콘 버튼 (input 내부 오른쪽) */}
                            <button
                                type="button"
                                onClick={handleAutoNickname}
                                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-yellow-400 hover:text-yellow-500 active:text-yellow-600"
                                title="Generate nickname"
                            >
                                <Sparkles size={18} />
                            </button>
                        </div>
                        {isChecking && <p className="text-gray-500 text-sm mt-1">Checking...</p>}
                        {nicknameError && <p className="text-red-500 text-sm mt-1 ml-1">{nicknameError}</p>}
                        {isAvailable && <p className="text-green-500 text-sm mt-1 ml-1">The nickname is available.</p>}
                    </div>

                    {/* 생년월일 */}
                    <div>
                        <label className="block text-sm font-medium">Birthdate</label>
                        <input
                            type="date"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            className="w-full px-4 py-3 mt-1 rounded-[15px] border border-gray-300 text-sm"
                            required
                            max={new Date().toISOString().split("T")[0]}
                        />
                    </div>

                    {/* 성별 */}
                    <div>
                        <label className="block text-sm font-medium">Gender</label>
                        <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="w-full px-4 py-3 mt-1 rounded-[15px] border border-gray-300 text-sm"
                            required
                        >
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>

                    {/* 국적 */}
                    <div>
                        <label className="block text-sm font-medium">Nationality</label>
                        <select
                            value={nationality}
                            onChange={(e) => setNationality(e.target.value)}
                            className="w-full px-4 py-3 mt-1 rounded-[15px] border border-gray-300 text-sm"
                            required
                        >
                            {Object.entries(countryCodeMap).map(([code, name]) => (
                                <option key={code} value={code}>
                                    {name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Next 버튼 */}
                    <button
                        type="submit"
                        disabled={!isAvailable}
                        className={`
                            w-full h-11 rounded-md font-bold text-sm transition
                            ${isAvailable
                            ? "bg-amber-300 hover:bg-amber-400 active:bg-amber-200 text-white"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"}
                        `}
                    >
                        Next
                    </button>
                </form>
            </div>
        </div>
    );
}
