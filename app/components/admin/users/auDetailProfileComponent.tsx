import { useTagSelector } from "~/hooks/tags/useTagSelector";
import {getCountryName} from "~/util/countryUtils";


interface profileProps {
    isSocial: boolean;
    gender: string;
    nationality: string;
    birthDate: string;
    status: string;
    regDate: string;
    tagIdList: number[];
}

function AuDetailProfileComponent({isSocial, gender, nationality, birthDate, status, regDate, tagIdList}:profileProps) {

    const { selectedTags, allTags, loading } = useTagSelector(tagIdList);

    if (loading) return <p>Loading tags...</p>;

    const selectedTagObjects = allTags.filter(tag => selectedTags.includes(tag.tagId));

    // regDate 형식 바꾸기
    const styleRegDate = new Date(regDate).toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });


    return (
        <div className="flex flex-col overflow-x-auto ">
            {/*프로필 자리*/}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 min-w-[400px]">
                <div className="mb-4 border-b border-gray-200 py-4">
                    <h2 className="text-lg font-bold text-gray-700 dark:text-white">Profile Information</h2>
                </div>
                <div className="flex flex-col">
                    {[
                        { label: "Account Type", value: isSocial ? "Social" : "Local", type: "account" },
                        { label: "Gender", value: gender ?? "N/A", type: "gender" },
                        { label: "Nationality", value: getCountryName(nationality) ?? "N/A" },
                        { label: "BirthDate", value: birthDate ?? "N/A" },
                        { label: "Status", value: status ?? "N/A", type: "status" },
                        { label: "RegDate", value: styleRegDate ?? "N/A" },

                    ].map(({ label, value, type }) => (
                        <div className="flex items-center mb-4" key={label}>
                            <p className="text-md font-bold text-gray-500 dark:text-white mr-2">{label}:</p>
                            {getStyledComponent(type, value)}
                        </div>
                    ))}


                </div>
            </div>

            {/*태그 자리*/}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 my-4 min-w-[400px]">
                <div className="mb-4 ">
                    <h2 className="border-b border-gray-200 py-4 text-lg font-bold text-gray-700 dark:text-white">Selected Tags</h2>
                    <div className="flex flex-wrap gap-2 mb-4 mt-4">
                        {selectedTagObjects.length > 0 ? (
                            selectedTagObjects.map(tag => (
                                <span
                                    key={tag.tagId}
                                    className="overflow-x px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                                >
                                    {tag.tagName}
                                </span>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500">No tags selected.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuDetailProfileComponent;

const getStyledComponent = (type: string | undefined, value: string) => {
    if (type === "account") {
        return (
            <span
                className={`px-2 py-1 rounded-full text-sm font-medium ${
                    value === "Social"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-emerald-100 text-emerald-600"
                }`}
            >
                {value}
            </span>
        );
    }

    if (type === "gender") {
        return (
            <span
                className={`px-2 py-1 rounded-full text-sm font-medium ${
                    value.toLowerCase() === "male"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-pink-100 text-pink-700"
                }`}
            >
                {value}
            </span>
        );
    }

    if (type === "status") {
        return (
            <div className="flex gap-2">
                {["ACTIVE", "BANNED", "DELETED"].map((s) => (
                    <span
                        key={s}
                        className={`text-sm font-medium px-2 py-1 rounded-full border
                        ${value === s
                            ? s === "ACTIVE"
                                ? "bg-blue-100 text-blue-700 border-transparent"
                                : s === "BANNED"
                                    ? "bg-yellow-100 text-yellow-700 border-transparent"
                                    : "bg-red-100 text-red-700 border-transparent"
                            : "text-gray-400 border-gray-200"}
                    `}
                    >
                    {s}
                </span>
                ))}
            </div>
        );
    }

    // 기본 텍스트 렌더링
    return <p className="text-md text-gray-500">{value}</p>;
};


