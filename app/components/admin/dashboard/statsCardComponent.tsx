import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";

//통계 카드 렌더링하는 컴포넌트
export default function StatsCardComponent({
                                     title,
                                     value,
                                     icon,
                                     iconBg,
                                     trend,
                                     progress,
                                     progressColor,
                                 }: {
    title: string;
    value: string;
    icon: any;
    iconBg: string;
    trend: { up: boolean; percent: string };
    progress: string;
    progressColor: string;
}) {
    
    return (
        <div className="bg-white rounded-lg shadow-sm p-5 cursor-pointer hover:shadow-md hover:-translate-y-1 transition-transform">
            <div className="flex items-center mb-3 relative">
                <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${iconBg}`}>
                    <FontAwesomeIcon icon={icon} className="text-xl" />
                </div>
                <span
                    className={`absolute top-3 right-3 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
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
            <h4 className="text-2xl font-semibold mb-3">{value}</h4>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div className={`${progressColor} ${progress} h-2 rounded-full`}></div>
            </div>
        </div>
    );
}
