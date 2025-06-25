import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

//기간 필터 드롭다운
export default function PeriodDropdownComponent({period, setPeriod,}: {
    period: string; setPeriod: (p: string) => void; }) {

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const periods = ["Today", "This Week", "This Month", "This Year"];

    return (
        <div className="relative inline-block text-left">
            <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="inline-flex justify-center items-center rounded-md border border-gray-300 bg-white px-4 py-2 gap-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
            >
                <FontAwesomeIcon icon={faCalendarAlt} style={{ width: '15px', height: '15px' }} />
                {period}
                <svg
                    className="-mr-1 ml-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.08 1.04l-4.25 4.65a.75.75 0 01-1.08 0l-4.25-4.65a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>
            {dropdownOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1">
                        {periods.map((item) => (
                            <button
                                key={item}
                                onClick={() => {
                                    setPeriod(item);
                                    setDropdownOpen(false);
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
