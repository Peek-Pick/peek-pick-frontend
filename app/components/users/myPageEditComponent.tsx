import { useState } from 'react';
import { FaCamera } from 'react-icons/fa';
import { useTagSelector } from '~/hooks/tags/useTagSelector';
import { useGetProfile } from '~/hooks/users/useGetProfile';

export default function MyPageEditComponent() {

    const { data: profile, loading, error } = useGetProfile()
    const { selectedTags, toggleTag, groupedTags } = useTagSelector(profile.tagIdList);
    const [showAllTags, setShowAllTags] = useState(false);
    const isSocial = profile.isSocial; // API에서 받아올 값

    if (loading) return <p>로딩 중...</p>;
    if (error) return <p>에러 발생: {error}</p>;
    if (!profile) return null;

    console.log("프로필 데이터 불러오기 : ", profile)

    return (
        <div className="relative mb-8 max-w-2xl mx-auto">
            {/* 배경 헤더 */}
            <div className="bg-gradient-to-r from-yellow-200 to-green-300 h-40 rounded-xl" />

            {/* 프로필 사진 + 닉네임 + 이메일 */}
            <div className="text-center">
                <div className="relative inline-block -mt-16">
                    <img
                        src={`/${profile.profileImgUrl}`}
                        alt="Profile"
                        className="w-28 h-28 rounded-full border-4 border-white bg-white"
                    />
                    <button className="absolute bottom-0 right-0 bg-emerald-400 text-white p-2 rounded-full">
                        <FaCamera />
                    </button>
                </div>
                <h3 className="mt-4 mb-1 text-xl font-semibold">{profile.nickname}</h3>
                <p className="text-gray-500 mb-3">{profile.email}</p>
            </div>

            {/* 폼 영역 */}
            <div className="px-4 space-y-6 mt-6">
                {/* 계정 정보 */}
                <div className="rounded-xl shadow-sm overflow-hidden mb-6">
                    <h4 className="text-lg font-semibold bg-emerald-400 px-3 py-2 text-white">
                        Account
                    </h4>
                    <div className="p-6 bg-white space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-600">Email</label>
                            <input
                                type="email"
                                value={profile.email}
                                disabled
                                className="w-full bg-gray-50 border rounded px-4 py-2 cursor-not-allowed"
                            />
                        </div>

                        {!isSocial && (
                            <>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Current Password</label>
                                    <input
                                        type="password"
                                        placeholder="Enter current password"
                                        className="w-full border rounded px-4 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">New Password</label>
                                    <input
                                        type="password"
                                        placeholder="Enter new password"
                                        className="w-full border rounded px-4 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Confirm New Password</label>
                                    <input
                                        type="password"
                                        placeholder="Re-enter new password"
                                        className="w-full border rounded px-4 py-2"
                                    />
                                </div>
                            </>
                        )}

                        {isSocial && (
                            <p className="text-sm text-gray-500">Password changes are not available for social accounts.</p>
                        )}
                    </div>
                </div>

                {/* 프로필 정보 */}
                <div className="rounded-xl shadow-sm overflow-hidden mb-6">
                    <h4 className="text-lg font-semibold bg-emerald-400 px-3 py-2 text-white">
                        Profile Information
                    </h4>
                    <div className="p-6 bg-white space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-600">Nickname</label>
                            <input
                                type="text"
                                defaultValue={profile.nickname}
                                className="w-full border rounded px-4 py-2"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">Gender</label>
                            <input
                                type="text"
                                value={profile.gender}
                                disabled
                                className="w-full bg-gray-100 border rounded px-4 py-2 cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">Nationality</label>
                            <input
                                type="text"
                                value={profile.nationality}
                                disabled
                                className="w-full bg-gray-100 border rounded px-4 py-2 cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                            <input
                                type="date"
                                value={profile.birthDate}
                                disabled
                                className="w-full bg-gray-100 border rounded px-4 py-2 cursor-not-allowed"
                            />
                        </div>
                    </div>
                </div>

                {/* 태그 섹션 */}
                <div className="rounded-xl shadow-sm overflow-hidden mb-6">
                    <h4 className="text-lg font-semibold bg-emerald-400 px-3 py-2 text-white">
                        Interests / Tags
                    </h4>
                    <div className="p-6 bg-white">
                        {/* 선택된 태그 */}
                        <p className="font-medium text-gray-700 mb-2 text-sm sm:text-base">Selected Tags</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {selectedTags.length > 0 ? (
                                selectedTags.map(tagId => {
                                    const tag = Object.values(groupedTags).flat().find(t => t.tag_id === tagId);
                                    if (!tag) return null;
                                    return (
                                        <button
                                            key={tagId}
                                            onClick={() => toggleTag(tagId)}
                                            className="px-3 py-1 rounded-full text-sm bg-emerald-100 text-emerald-700 border border-emerald-300"
                                        >
                                            {tag.tag_name} &times;
                                        </button>
                                    );
                                })
                            ) : (
                                <p className="text-sm text-gray-500">No tags selected.</p>
                            )}
                        </div>

                        {/* 태그 추가하기 토글 버튼 */}
                        <button
                            onClick={() => setShowAllTags(prev => !prev)}
                            className="text-sm text-emerald-600 hover:underline mb-4 mt-4"
                        >
                            {showAllTags ? "Hide Tags ▲" : "Add Tags ▼"}
                        </button>

                        {/* 전체 태그 목록 */}
                        {showAllTags && (
                            <div className="space-y-4 max-h-60 overflow-y-auto border-t pt-4">
                                {Object.entries(groupedTags).map(([category, tagList]) => (
                                    <div key={category}>
                                        <p className="text-sm font-semibold text-gray-600 mb-2">{category}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {tagList.map(tag => (
                                                <button
                                                    key={tag.tag_id}
                                                    onClick={() => toggleTag(tag.tag_id)}
                                                    className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                                                        selectedTags.includes(tag.tag_id)
                                                            ? "bg-gray-200 text-gray-700 border-gray-400"
                                                            : "bg-white text-gray-600 border-gray-300"
                                                    }`}
                                                >
                                                    {tag.tag_name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>




                {/* 저장 버튼 */}
                <div className="pt-4">
                    <button className="w-full bg-emerald-400 text-white py-2 rounded-lg hover:bg-emerald-500">
                        SAVE
                    </button>
                </div>
            </div>
        </div>
    );
}
