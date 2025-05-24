import { useSignupContext } from "~/contexts/signupContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {useGetAllTags} from "~/hooks/useGetAllTags";
import {SignupForm} from "~/api/signupAPI";
import type {TagDTO} from "~/types/tag";


export default function SignupTagComponent() {

    const navigate = useNavigate();

    const { email, password, nickname, birthDate, gender, nationality, tags, setTags } = useSignupContext();
    const { allTags, loading } = useGetAllTags()

    const [isSubmitting, setIsSubmitting] = useState(false);

    // 태그를 클릭하면 해당 tag가 배열에 있는지 확인하고 추가하거나 제거
    const selectTag = (tag: string) => {
        setTags(tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag])
    };

    // 전체 form 제출
    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            console.log("모든 태그:", allTags);
            console.log("선택된 태그 이름:", tags);

            // 선택된 tag_name 에 해당하는 tag_id 들만 추출
            const tagIdList = allTags
                .filter(tag => tags.includes(tag.tag_name))
                .map(tag => tag.tag_id);

            console.log("선택된 태그 ID 리스트:", tagIdList);

            const data = {
                email,
                password,
                nickname,
                gender,
                nationality,
                birthDate: birthDate,
                profileImgUrl: "basicImg.jpg",
                tagIdList,
                isSocial: false,
            };

            console.log("서버로 보낼 데이터:", data);

            const response = await SignupForm(data);
            console.log("회원가입 완료", response);
            navigate("/login");
        } catch (error) {
            console.error("회원가입 실패", error);
            alert("회원가입 실패. 다시 시도해주세요.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // loading
    if (loading) return <p className="text-center mt-10">태그 목록 불러오는 중...</p>;

    // allTags: TagDTO[] → { [category]: TagDTO[] } 형태로 변환
    const groupedTags = allTags.reduce((acc, tag) => {
        if (!acc[tag.category]) acc[tag.category] = [];
        acc[tag.category].push(tag);
        return acc;
    }, {} as Record<string, TagDTO[]>);

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
                                        key={tag.tag_name}
                                        onClick={() => selectTag(tag.tag_name)}
                                        className={`px-3 py-1 rounded-full border text-sm shadow transition
              ${tags.includes(tag.tag_name)
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                    >
                                        {tag.tag_name}
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