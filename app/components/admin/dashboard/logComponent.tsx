import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUserCheck,
    faShieldAlt,
    faCog,
    faExclamationCircle,
    faDownload,
    faFilter,
    faSearch,
    faChevronLeft,
    faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

const iconMap = {
    faUserCheck,
    faShieldAlt,
    faCog,
    faExclamationCircle,
    faDownload,
    faFilter,
    faSearch,
    faChevronLeft,
    faChevronRight,
} as const;  // readonly 키값으로 만듦

type IconName = keyof typeof iconMap;

interface Activity {
    title: string;
    time: string;
    desc: string;
    iconName: IconName;  // 여기서 타입을 IconName으로 제한
    iconColor: string;
    userImg?: string;
    ip?: string;
    warning?: boolean;
    progress?: boolean;
    error?: string;
}

const activities: Activity[] = [
    {
        title: "User Login Successful",
        time: "2 minutes ago",
        desc: "Successful login from Chrome on Windows",
        iconName: "faUserCheck",
        iconColor: "bg-green-100 text-green-600",
        userImg: "https://randomuser.me/api/portraits/men/40.jpg",
        ip: "192.168.1.1",
    },
    {
        title: "Security Alert",
        time: "15 minutes ago",
        desc: "Multiple failed login attempts detected",
        iconName: "faShieldAlt",
        iconColor: "bg-yellow-100 text-yellow-600",
        warning: true,
    },
    {
        title: "System Update",
        time: "1 hour ago",
        desc: "System maintenance completed successfully",
        iconName: "faCog",
        iconColor: "bg-cyan-100 text-cyan-600",
        progress: true,
    },
    {
        title: "Error Detected",
        time: "2 hours ago",
        desc: "API endpoint /api/users/create returned 500 error",
        iconName: "faExclamationCircle",
        iconColor: "bg-red-100 text-red-600",
        error: "Error: Database connection timeout",
    },
];

export default function LogComponent() {
    return (
        <div className="bg-light">
            <div className="container py-5">
                <div className="flex justify-center">
                    <div className="w-full max-w-6xl">
                        <div className="bg-white shadow-sm rounded-lg border-0">
                            <div className="p-6">
                                {/* Header */}
                                <div className="flex justify-between items-center mb-4 ">
                                    <h4 className="mb-0 border-b-2 border-gray-300 pb-2 font-bold">요청사항</h4>
                                    <div className="flex gap-2">
                                        <button className="btn btn-outline-secondary btn-sm ">
                                            <FontAwesomeIcon icon={faDownload} className="me-2" /> Export
                                        </button>
                                        <button className="btn btn-primary btn-sm">
                                            <FontAwesomeIcon icon={faFilter} className="me-2" /> Filter
                                        </button>
                                    </div>
                                </div>

                                {/* Search and Filter */}
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
                                    <div className="flex flex-wrap gap-2 items-center">
                                        {["전체", "상품 등록 요청", "신고", "문의"].map((label, i) => (
                                            <button
                                                key={label}
                                                className={`px-4 py-1 rounded-lg text-sm font-medium border transition-all duration-200
                                                ${i === 0
                                                    ? "bg-blue-300 text-white border-blue-300"
                                                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"}`}
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Activity Timeline */}
                                <div className="activity-timeline space-y-4">
                                    {activities.map((item, idx) => (
                                        <div
                                            key={idx}
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
                                <div className="flex justify-between items-center mt-4">
                                    <nav>
                                        <ul className="pagination pagination-sm mb-0 flex items-center gap-1">
                                            <li className="page-item disabled">
                                                <a className="page-link" href="#">
                                                    <FontAwesomeIcon icon={faChevronLeft} />
                                                </a>
                                            </li>
                                            <li className="page-item active">
                                                <a className="page-link" href="#">
                                                    1
                                                </a>
                                            </li>
                                            <li className="page-item">
                                                <a className="page-link" href="#">
                                                    2
                                                </a>
                                            </li>
                                            <li className="page-item">
                                                <a className="page-link" href="#">
                                                    3
                                                </a>
                                            </li>
                                            <li className="page-item">
                                                <a className="page-link" href="#">
                                                    <FontAwesomeIcon icon={faChevronRight} />
                                                </a>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
