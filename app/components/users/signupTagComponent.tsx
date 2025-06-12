import { useSignupContext } from "~/contexts/signupContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {SignupForm} from "~/api/signupAPI";
import { useTagSelector } from "~/hooks/tags/useTagSelector";

export default function SignupTagComponent() {

    const navigate = useNavigate();

    const { email, password, nickname, birthDate, gender, nationality, tags, setTags } = useSignupContext();
    const { selectedTags, groupedTags, loading } = useTagSelector()
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

            // console.log("서버로 보낼 데이터:", data);

            const response = await SignupForm(data);
            console.log("회원가입 완료", response);
            navigate('');          // 성공 시 인덱스 → 홈으로 이동
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-400 to-pink-400 px-4">
            <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold text-center mb-6">What are you interested in?</h2>

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
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
                    disabled={isSubmitting}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-md transition"
                >
                    {isSubmitting ? "Submitting..." : "Complete Signup"}
                </button>
            </div>
        </div>
    );
}