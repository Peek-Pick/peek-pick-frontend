import { FaFacebook, FaApple, FaGoogle } from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import {useSignupContext} from "~/contexts/signupContext";
import {Link} from "react-router";


export default function SignUpPage() {

    const {email, setEmail, password, setPassword} = useSignupContext()

    const navigate = useNavigate()

    const moveToProfileFormPage = (e: React.FormEvent) => {
        e.preventDefault();
        navigate('/signup/profile')
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-teal-400 to-blue-500 px-4">

            {/* Welcome Text */}
            <div className="flex flex-col text-center justify-center items-center mt-12 sm:mt-20 mb-4 sm:mb-6">
                <h1 className="text-4xl text-white font-bold">Welcome!</h1>
                <p className="text-white mt-2 mb-6 text-md max-w-lg">
                    Join us and get started!
                </p>
            </div>

            {/* Form Container */}
            <div className="flex justify-center w-full px-4 sm:px-0 mb-8 sm:mb-12">
                <div className="flex flex-col w-full max-w-md bg-white bg-opacity-90 p-6 sm:p-10 rounded-[15px] shadow-md">
                    <h2 className="text-xl font-bold text-center mb-6">Register With</h2>

                    {/* Social Icons */}
                    {[
                        // { Icon: FaFacebook, label: "Facebook" },
                        // { Icon: FaApple, label: "Apple" },
                        { Icon: FaGoogle, label: "Google" },
                    ].map(({ Icon, label }, index) => (
                        <div key={index} className="flex justify-center mb-2">
                            <div
                                className="w-full px-4 py-3 flex items-center justify-center border border-gray-300 rounded-[15px] cursor-pointer hover:bg-gray-100 transition gap-3"
                            >
                                <Icon className="w-6 h-6 sm:w-[30px] sm:h-[30px]" />
                                <span className="text-sm font-medium">{label}</span>
                            </div>
                        </div>
                    ))}


                    <p className="text-center text-gray-400 font-bold mb-6">or</p>

                    {/* Form */}
                    <form className="space-y-6">
                        <div>
                            <label className="block text-sm font-normal">Email</label>
                            <input
                                type="email"
                                name="email"
                                required
                                placeholder="Your email address"
                                className="w-full px-4 py-3 mt-1 rounded-[15px] border border-gray-300 text-sm"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-normal">Password</label>
                            <input
                                type="password"
                                name="password"
                                required
                                placeholder="Your password"
                                className="w-full px-4 py-3 mt-1 rounded-[15px] border border-gray-300 text-sm"
                                value={password ?? ""}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-amber-300 hover:bg-amber-400 active:bg-amber-200 text-white font-bold text-sm h-11 rounded-md transition"
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


    );
}
