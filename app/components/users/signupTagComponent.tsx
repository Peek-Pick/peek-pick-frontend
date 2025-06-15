import { useSignupContext } from "~/contexts/signupContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {SignupForm} from "~/api/signupAPI";
import { useTagSelector } from "~/hooks/tags/useTagSelector";
import {SignupStepperHeader} from "~/components/users/signupStepperHeader";

export default function SignupTagComponent() {

    const navigate = useNavigate();

    const { email, password, nickname, birthDate, gender, nationality, tags, setTags } = useSignupContext();
    const { groupedTags, loading } = useTagSelector(tags)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // 태그를 클릭하면 해당 tag가 배열에 있는지 확인하고 추가하거나 제거
    const selectTag = (tagId: number) => {
        setTags(tags.includes(tagId) ? tags.filter(id => id !== tagId) : [...tags, tagId])
    };

    // 전체 form 제출
    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            const data = {
                email,
                password,
                nickname,
                gender,
                nationality,
                birthDate: birthDate,
                profileImgUrl: "basicImg.jpg",
                tagIdList: tags,
                isSocial: false,
            };

            if (password == null) data.isSocial=true;

            console.log("✅ 최종 전송 데이터", data);

            const response = await SignupForm(data);
            console.log("회원가입 완료", response);
            navigate('/main');
        } catch (error) {
            console.error("회원가입 실패", error);
            alert("회원가입 실패. 다시 시도해주세요.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // loading
    if (loading) return <p className="text-center mt-10">태그 목록 불러오는 중...</p>;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-yellow-200 to-green-300 px-4">

            <div className="w-full px-4">
                <SignupStepperHeader currentStep={3} />
            </div>

            <div className="mb-20 w-full max-w-md bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-bold text-center mb-6">What are you interested in?</h2>

                <div className="space-y-6">
                    {Object.entries(groupedTags).map(([category, tagList]) => (
                        <div key={category}>
                            <h3 className="text-lg font-semibold mb-2 text-gray-700">{category}</h3>
                            <div className="flex flex-wrap gap-2">
                                {tagList.map(tag => (
                                    <button
                                        key={tag.tagName}
                                        onClick={() => selectTag(tag.tagId)}
                                        className={`px-3 py-1 rounded-full border text-sm shadow transition
                                        ${tags.includes(tag.tagId)
                                            ? "bg-emerald-50 text-emerald-500 border-emerald-200"
                                            : "bg-gray-100 text-gray-500 border-gray-400"
                                        }`}
                                    >
                                        {tag.tagName}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>


                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting} //중복 클릭 방지
                    className="mt-6 w-full bg-amber-300 hover:bg-amber-400 active:bg-amber-200 text-white font-bold text-sm h-11 rounded-md transition"
                >
                    {isSubmitting ? "Submitting..." : "Complete Signup"}
                </button>
            </div>
        </div>
    );
}