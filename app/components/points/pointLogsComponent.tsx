import type { PointLogsDTO } from "~/types/points";
import {PointLogsDesc, PointLogsType} from "~/enums/points/points";
import { History } from "lucide-react";

interface Props {
    pointLogs: PointLogsDTO[];
}

export default function PointLogsComponent({ pointLogs }: Props) {

    // description 및 type enum-safe 변환 함수
    const getDescription = (descKey: string) => {
        return PointLogsDesc[descKey as keyof typeof PointLogsDesc] ?? descKey;
    };

    const getTypeText = (typeKey: string) => {
        return PointLogsType[typeKey as keyof typeof PointLogsType] ?? typeKey;
    };

    return (
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow px-4 pt-4 pb-6 relative space-y-4">
            <div className="flex justify-between items-center mb-4 mt-1.5">
                <h2 className="flex items-center gap-1 text-xl font-bold text-yellow-500 select-none leading-none">
                    <History className="w-6 h-6 leading-none ml-1.5" />
                    <span className="leading-none text-black ml-1.5">Point History</span>
                </h2>
            </div>

            <ul className="space-y-4">
                {pointLogs.length === 0 ? (
                    <li className="text-center text-gray-400 text-sm sm:text-base">
                        No point history available.
                    </li>

                ) : (
                    pointLogs.map((log) => (
                        <li
                            key={log.pointLogId}
                            className={`border-l-4 pl-4 p-4 rounded-lg shadow-sm bg-gray-50 ${
                                log.type === "EARN"
                                    ? "border-green-300"
                                    : log.type === "USE"
                                        ? "border-red-300"
                                        : "border-gray-300"
                            }`}
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-medium text-gray-700">
                                        {getDescription(log.description)}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {new Date(log.regDate).toLocaleString()} •{" "}
                                        <span className="text-gray-500">{getTypeText(log.type)}</span>
                                    </p>
                                </div>
                                <div>
                                      <span
                                          className={`inline-block px-3 py-1 rounded-full font-semibold text-sm shadow-sm ${
                                              log.type === "EARN"
                                                  ? "bg-green-100 text-green-600"
                                                  : log.type === "USE"
                                                      ? "bg-red-100 text-red-500"
                                                      : "bg-gray-100 text-gray-400"
                                          }`}
                                      >
                                            {log.type === "EARN" ? "+" : "-"}
                                      {log.amount.toLocaleString()}P
                                      </span>
                                </div>
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}
