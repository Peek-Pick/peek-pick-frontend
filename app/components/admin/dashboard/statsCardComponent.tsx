import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowUp,
    faArrowDown,
    faShoppingCart,
    faUsers,
    faStar,
    faChevronRight, faChevronLeft
} from "@fortawesome/free-solid-svg-icons";

interface StatusCardProps {
    values?: number[],
    goals?: number[],
    percents?: number[]
}

export default function StatsCardComponent({values, goals, percents}: StatusCardProps) {
    // 목표치 할당 퍼센트
    const progress = [
        (values[0] / goals[0]) * 100,
        (values[1] / goals[1]) * 100,
        (values[2] / goals[2]) * 100
    ];

    const stats = [
        {
            id: 1,
            title: "총 상품 수",
            value: values[0],
            icon: faShoppingCart,
            iconBg: "bg-blue-100 text-blue-600",
            trend: {
                up: percents[0] > 0,
                percent: `${Math.abs(percents[0]).toFixed(2)}%`,
            },
            progressStyle: { width: `${progress[0]}%`},
            progressColor: "bg-blue-600",
        },
        {
            id: 2,
            title: "사용자 수",
            value: values[1],
            icon: faUsers,
            iconBg: "bg-green-100 text-green-600",
            trend: {
                up: percents[1] > 0,
                percent: `${Math.abs(percents[1]).toFixed(2)}%`,
            },
            progressStyle: { width: `${progress[1]}%`},
            progressColor: "bg-green-600",
        },
        {
            id: 3,
            title: "리뷰 수",
            value: values[2],
            icon: faStar,
            iconBg: "bg-yellow-100 text-yellow-600",
            trend: {
                up: percents[2] > 0,
                percent: `${Math.abs(percents[2]).toFixed(2)}%`,
            },
            progressStyle: { width: `${progress[2]}%`},
            progressColor: "bg-yellow-600",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map(({id, title, value, icon, iconBg, trend, progressColor, progressStyle}) => (
                <div
                    key={id}
                    className="bg-white rounded-lg shadow-sm p-3 cursor-pointer hover:shadow-md hover:-translate-y-1 transition-transform"
                >
                    <div className="flex items-center mb-2 relative">
                        <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${iconBg}`}>
                            <FontAwesomeIcon icon={icon} className="w-4 h-4"/>
                        </div>
                        <span
                            className={`absolute top-2 right-2 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                                trend.up ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                        >
                        <FontAwesomeIcon
                            icon={trend.up ? faArrowUp : faArrowDown}
                            className="mr-1"
                        />
                            {trend.percent}
                    </span>
                    </div>

                    <h6 className="text-gray-500 text-sm mb-2">{title}</h6>
                    <h4 className="text-xl font-semibold mb-3">{value}</h4>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div style={progressStyle} className={`${progressColor} h-2 rounded-full`}></div>
                    </div>
                </div>
            ))}
        </div>
    );
}