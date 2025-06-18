import { useState } from 'react';
import { FaCamera } from 'react-icons/fa';
import { useTagSelector } from '~/hooks/tags/useTagSelector';
import { usePasswordChange } from '~/hooks/users/usePasswordChange';
import { useProfileImageUpload } from '~/hooks/users/useProfileImageUpload';
import { PasswordChangeSection } from '~/components/users/passwordChangeSection'
import { useNicknameChecker } from '~/hooks/users/useNicknameChecker';
import { useMyPageEdit } from '~/hooks/users/useMyPageEdit';
import {getCountryName} from "~/util/countryUtils";
import type {ProfileReadDTO} from "~/types/users";

interface EditProps {
    profile: ProfileReadDTO;
}

export default function MyPageEditComponent({profile}: EditProps) {

    const { selectedTags, toggleTag, groupedTags } = useTagSelector(profile.tagIdList);
    const passwordChange = usePasswordChange();
    // const {newNickname, setNewNickname, nicknameError, nicknameStatus, checkNickname,} = useNicknameChange();

    const [newNickname, setNewNickname] = useState("")
    const {isChecking, isAvailable, error:nicknameError} = useNicknameChecker(newNickname);

    const {handleSubmit: save} = useMyPageEdit();

    const [showAllTags, setShowAllTags] = useState(false);
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const isSocial = profile.isSocial; // API에서 받아올 값

    const { file, handleFileChange, previewUrl} = useProfileImageUpload(`/${profile.profileImgUrl}`);

    return (
        <div className="relative mb-8 max-w-2xl mx-auto">
            {/* 배경 헤더 */}
            <div className="bg-gradient-to-r from-yellow-200 to-green-300 h-40 rounded-xl" />

            {/* 프로필 사진 + 닉네임 + 이메일 */}
            <div className="text-center">
                <div className="relative inline-block -mt-16">
                    <img
                        src={previewUrl.startsWith('blob:') ? 
                                previewUrl : `http://localhost/${previewUrl}`}
                        alt="Profile"
                        className="w-28 h-28 rounded-full border-4 border-white bg-white"
                    />
                    <label className="absolute bottom-0 right-0 bg-emerald-400 text-white p-2 rounded-full cursor-pointer">
                        <FaCamera />
                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
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

                        {!showPasswordChange ? (
                            <button
                                onClick={() => setShowPasswordChange(true)}
                                className="text-sm text-emerald-600 hover:underline"
                            >
                                Change Your Password &gt;
                            </button>
                        ) : (
                            < PasswordChangeSection {...passwordChange} isSocial={isSocial} />
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
                                defaultValue={newNickname || profile.nickname}
                                className="w-full border rounded px-4 py-2"
                                onChange={(e) => setNewNickname(e.target.value)}
                            />
                            <div className="mt-3 flex items-center gap-2">
                                {/*<button*/}
                                {/*    onClick={isChecking}*/}
                                {/*    className="text-sm text-emerald-600 hover:underline"*/}
                                {/*>*/}
                                {/*    Check &gt;*/}
                                {/*</button>*/}
                                {newNickname !== profile.nickname && (
                                    <>
                                        {isChecking && (
                                            <p className="text-gray-500 text-sm mt-1">Checking...</p>
                                        )}
                                        {nicknameError && (
                                            <p className="text-red-500 text-sm mt-1 ml-1">{nicknameError}</p>
                                        )}
                                        {isAvailable && !nicknameError && (
                                            <p className="text-green-500 text-sm mt-1 ml-1">The nickname is available.</p>
                                        )}
                                    </>
                                )}
                            </div>
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
                                value={getCountryName(profile.nationality)}
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
                                    const tag = Object.values(groupedTags).flat().find(t => t.tagId === tagId);
                                    if (!tag) return null;
                                    return (
                                        <button
                                            key={tagId}
                                            onClick={() => toggleTag(tagId)}
                                            className="px-3 py-1 rounded-full text-sm bg-emerald-100 text-emerald-700 border border-emerald-300"
                                        >
                                            {tag.tagName} &times;
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
                                                    key={tag.tagId}
                                                    onClick={() => toggleTag(tag.tagId)}
                                                    className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                                                        selectedTags.includes(tag.tagId)
                                                            ? "bg-gray-200 text-gray-700 border-gray-400"
                                                            : "bg-white text-gray-600 border-gray-300"
                                                    }`}
                                                >
                                                    {tag.tagName}
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
                    <button
                        onClick={() => save(
                            passwordChange.newPassword,
                            newNickname || profile.nickname,
                            selectedTags,
                            file
                            )}
                        className="w-full bg-emerald-400 text-white py-2 rounded-lg hover:bg-emerald-500">
                        SAVE
                    </button>
                </div>
            </div>
        </div>

    );
}
