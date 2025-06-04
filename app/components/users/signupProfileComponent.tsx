import { useSignupContext } from "~/contexts/signupContext";
import { useNavigate } from "react-router-dom";
import {useEffect} from "react";
import {useLocation} from "react-router";

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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-300 to-purple-400 px-4">
            <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold text-center mb-6">Tell us more about you</h2>

                <form className="space-y-4" onSubmit={moveToTagPage}>
                    <div>
                        <label className="block text-sm font-medium">Nickname</label>
                        <input
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Birthdate</label>
                        <input
                            type="date"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Gender</label>
                        <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md"
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
                            className="w-full px-4 py-2 border rounded-md"
                            required
                        >
                            <option value="">Select</option>
                            <option value="KR">대한민국</option>
                            <option value="JP">일본</option>
                            <option value="CN">중국</option>
                            <option value="US">미국</option>
                            <option value="ES">스페인</option>
                            <option value="VN">베트남</option>
                            <option value="TH">태국</option>
                            <option value="PH">필리핀</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 rounded-md transition"
                    >
                        Next
                    </button>
                </form>
            </div>
        </div>
    );
}