import { useSignupContext } from "~/contexts/signupContext";
import { useNavigate } from "react-router-dom";
import {useEffect} from "react";
import {useLocation} from "react-router";
import {countryCodeMap} from "~/util/countryUtils";
import {SignupStepperHeader} from "~/components/users/signupStepperHeader";

export default function SignupProfileComponent() {
    const {
        nickname, setNickname,
        birthDate, setBirthDate,
        gender, setGender,
        nationality, setNationality,
        setEmail, setPassword
    } = useSignupContext();

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const emailFromState = location.state?.email;
        if (emailFromState) {
            setEmail(emailFromState);
            setPassword(null);
        }
    }, [location.state, setEmail]);

    const moveToTagPage = (e: React.FormEvent) => {
        e.preventDefault();
        navigate("/signup/tag");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-yellow-200 to-green-300 px-4">

            <div className="w-full px-4">
                <SignupStepperHeader currentStep={2} />
            </div>

            <div className="mb-20 w-full max-w-md bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold text-center mb-6">Tell us more about you</h2>

                <form className="space-y-4" onSubmit={moveToTagPage}>
                    <div>
                        <label className="block text-sm font-medium">Nickname</label>
                        <input
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            className="w-full px-4 py-3 mt-1 rounded-[15px] border border-gray-300 text-sm"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Birthdate</label>
                        <input
                            type="date"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            className="w-full px-4 py-3 mt-1 rounded-[15px] border border-gray-300 text-sm"
                            required
                            max={new Date().toISOString().split("T")[0]} // 오늘 날짜까지만 선택 가능
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Gender</label>
                        <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="w-full px-4 py-3 mt-1 rounded-[15px] border border-gray-300 text-sm"
                            required
                        >
                            <option value="">Select</option>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Nationality</label>
                        <select
                            value={nationality}
                            onChange={(e) => setNationality(e.target.value)}
                            className="w-full px-4 py-3 mt-1 rounded-[15px] border border-gray-300 text-sm"
                            required
                        >
                            {Object.entries(countryCodeMap).map(([code, name]) => (
                                <option key={code} value={code}>{name}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-amber-300 hover:bg-amber-400 active:bg-amber-200 text-white font-bold text-sm h-11 rounded-md transition"
                    >
                        Next
                    </button>
                </form>
            </div>
        </div>
    );
}