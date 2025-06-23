import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle,faFlag, faDownload, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

interface Activity {
    title: string;
    time: string;
    desc: string;
    iconName: IconName;
    iconColor: string;
    category: Category;
    userImg?: string;
    ip?: string;
}

const iconMap = { faQuestionCircle, faFlag } as const;

type IconName = keyof typeof iconMap;

const activities: Activity[] = [
    {
        title: "Security Alert",
        time: "15 minutes ago",
        desc: "Multiple failed login attempts detected",
        iconName: "faQuestionCircle",
        iconColor: "bg-yellow-100 text-yellow-600",
        category: "신고"
    },
    {
        title: "System Update",
        time: "1 hour ago",
        desc: "System maintenance completed successfully",
        iconName: "faFlag",
        iconColor: "bg-cyan-100 text-cyan-600",
        category: "문의"
    }
];

export default function LogComponent() {
    const [filter, setFilter] = useState<Category>("전체");

    return (
        <div className="bg-light">
            <div className="container py-5">
                <div className="flex justify-center">
                    <div className="w-full max-w-6xl">
                        <div className="bg-white shadow-sm rounded-lg border-0">
                            <div className="p-6">
                                {/* 헤더 */}
                                <div className="flex justify-between items-center mb-4 ">
                                    <h4 className="flex mb-0 border-b-2 border-gray-300 pb-2 font-bold">요청사항</h4>
                                    <button className="btn btn-outline-secondary btn-sm ">
                                        {/* 엑셀 출력 */}
                                        <FontAwesomeIcon icon={faDownload}/> Export
                                    </button>
                                </div>

                                {/* 검색 및 필터 */}
                                <div className="grid md:grid-cols-2 gap-3 mb-4">
                                    <div className="search-box bg-white flex items-center px-4 py-3 rounded-md border border-gray-200">
                                        <FontAwesomeIcon
                                            icon={faSearch}
                                            style={{ width: '15px', height: '15px' }}
                                            className="mr-2"
                                        />
                                        <input
                                            type="text"
                                            className="border-0 w-3/4 focus:outline-none"
                                            placeholder="Search activities..."
                                        />
                                    </div>

                                    {/* 필터 버튼 */}
                                    <div className="flex flex-wrap gap-2 items-center">
                                        {["전체", "신고", "문의"].map((label) => (
                                            <button
                                                key={label}
                                                onClick={() => setFilter(label as Category)}
                                                className={`px-4 py-1 rounded-lg text-sm font-medium border transition-all duration-200
                          ${
                                                    filter === label
                                                        ? "bg-blue-600 text-white border-blue-600"
                                                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                                                }`}
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Activity Timeline */}
                                <div className="activity-timeline space-y-4">
                                    {activities.map((item, idx) => (
                                        <div key={idx}
                                             className="activity-item bg-white rounded-lg shadow-md p-4 transition-transform duration-300 hover:scale-[1.008] hover:shadow-lg"
                                        >
                                            <div className="flex gap-4">
                                                <div
                                                    className={`activity-icon ${item.iconColor} w-12 h-12 flex items-center justify-center rounded-full flex-shrink-0`}
                                                >
                                                    <FontAwesomeIcon icon={iconMap[item.iconName]} className="text-xl" />
                                                </div>
                                                <div className="flex-grow">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <h6 className="mb-0 font-semibold text-gray-900">{item.title}</h6>
                                                        <span className="text-sm text-gray-500">{item.time}</span>
                                                    </div>
                                                    <p className="text-gray-600 mb-2">{item.desc}</p>
                                                    {item.userImg && (
                                                        <div className="flex items-center gap-2">
                                                            <img
                                                                src={item.userImg}
                                                                alt="User"
                                                                className="w-8 h-8 rounded-full object-cover"
                                                            />
                                                            <span className="text-sm text-gray-500">IP: {item.ip}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
