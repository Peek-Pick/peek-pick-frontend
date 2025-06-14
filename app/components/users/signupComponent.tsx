import { FaGoogle } from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import {useSignupContext} from "~/contexts/signupContext";
import {getGoogleLoginLink} from "~/api/googleAPI";
import {Link} from "react-router";
import {SignupStepperHeader} from "~/components/users/signupStepperHeader";
import {useEmailChecker} from "~/hooks/users/useEmailChecker";
import {usePasswordChange} from "~/hooks/users/usePasswordChange";


export default function SignUpPage() {

    const googleLink = getGoogleLoginLink();

    const navigate = useNavigate();

    const {email, setEmail, password, setPassword} = useSignupContext();

    // 이메일 중복 확인 커스텀 훅
    const {
        email:checkEmail,
        setEmail:setChekEmail,
        checkEmailDupl,
        isChecking,
        isValidFormat,
        isAvailable,
        error: emailError
    } = useEmailChecker();

    // 비밀번호 확인 커스텀 훅
    const {
        newPassword,
        confirmPassword,
        setNewPassword,
        setConfirmPassword,
        checkNewPassword,
        error: passwordError,
    } = usePasswordChange();

    // 실시간 비밀번호 유효성 체크
    const isValidPassword =
        !!newPassword && !!confirmPassword && newPassword === confirmPassword;

    const moveToProfileFormPage = (e: React.FormEvent) => {
        e.preventDefault();
        navigate('/signup/profile');
    }

    return (
        <>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-yellow-200 to-green-300 px-4">

            <div className="w-full px-4">
                <SignupStepperHeader currentStep={1} />
            </div>

            {/* Form Container */}
            <div className="flex justify-center w-full sm:px-0 mb-8 sm:mb-12">
                <div className="mb-20 w-full max-w-md bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-bold text-center mb-6">Register With</h2>

                    {/* Social Icons */}
                    {[
                        // { Icon: FaFacebook, label: "Facebook" },
                        // { Icon: FaApple, label: "Apple" },
                        { Icon: FaGoogle, label: "Google" },
                    ].map(({ Icon, label }, index) => (
                        <div key={index} className="flex justify-center mb-2">
                            <Link
                                to={googleLink}
                                className="w-full px-4 py-3 flex items-center justify-center border border-gray-300 rounded-[15px] cursor-pointer hover:bg-gray-100 transition gap-3"
                            >
                                <Icon className="w-6 h-6 sm:w-[30px] sm:h-[30px]" />
                                <span className="text-sm font-medium">{label}</span>
                            </Link>
                        </div>
                    ))}

                    <p className="text-center text-gray-400 font-bold mb-6">or</p>

                    {/* Form */}
                    <form className="space-y-6">

                        {/*이메일*/}
                        <div>
                            <label className="block text-sm font-normal">Email</label>
                            <input
                                type="email"
                                name="email"
                                required
                                placeholder="Your email address"
                                className="w-full px-4 py-3 mt-1 rounded-[15px] border border-gray-300 text-sm"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);           // context에 이메일 저장
                                    setChekEmail(e.target.value);       // emailCheck에 값 전달
                                }}
                                onBlur={checkEmailDupl}
                            />

                            {emailError && <p className="text-red-500 text-sm mt-1 ml-4">{emailError}</p>}
                            {isAvailable && <p className="text-green-500 text-sm mt-1 ml-4">The email is available.</p>}
                            {isChecking && <p className="text-gray-500 text-sm mt-1 ml-4">Checking...</p>}
                        </div>

                        {/*비밀번호 */}
                        <div>
                            <label className="block text-sm font-normal">Password</label>
                            <input
                                type="password"
                                name="password"
                                required
                                placeholder="Your password"
                                className="w-full px-4 py-3 mt-1 rounded-[15px] border border-gray-300 text-sm"
                                value={password ?? ""}
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                    setNewPassword(e.target.value)
                                }}
                            />
                            {/*비밀번호 확인*/}
                            <input
                                type="password"
                                required
                                placeholder="Confirm password"
                                className="w-full px-4 py-3 mt-3 rounded-[15px] border border-gray-300 text-sm"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />

                            {passwordError && (<p className="text-red-500 text-sm mt-1 ml-4">{passwordError}</p>)}
                            {!passwordError && newPassword && confirmPassword && !isValidPassword && (
                                <p className="text-red-500 text-sm mt-1 ml-4">
                                    Passwords do not match.
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={!isAvailable || !isValidPassword}
                            className={`
                                w-full h-11 rounded-md font-bold text-sm transition
                                ${isAvailable && isValidPassword
                                    ? "bg-amber-300 hover:bg-amber-400 active:bg-amber-200 text-white"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"}
                                `}
                            onClick={moveToProfileFormPage}
                        >
                            NEXT
                        </button>
                    </form>

                    {/* 로그인 안내 */}
                    <div className="mt-4 text-center">
                        <p className="text-gray-700 font-medium">
                            Already have an account?
                            <Link
                                to="/login"
                                className="text-amber-400 font-bold ml-1">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        </>

    );
}
