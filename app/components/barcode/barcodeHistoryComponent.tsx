import { useEffect, useState } from "react";
import type { ViewHistoryResponseDTO } from "~/types/viewHistory";
import { getBarcodeHistory } from "~/api/barcode/barcodeAPI";
import { useLocation, useNavigate } from "react-router-dom";
import { ReceiptText } from "lucide-react";
import { BarcodeLoading } from "~/util/loading/barcodeLoading";

function BarcodeHistoryComponent() {
    const [history, setHistory] = useState<ViewHistoryResponseDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from;

    useEffect(() => {
        async function fetchHistory() {
            setLoading(true);
            try {
                const response = await getBarcodeHistory();
                setHistory(response);
            } catch (error) {
                console.error("Failed to load barcode history:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchHistory();
    }, []);

    const handleDetail = (id: number) => {
        navigate(`/products/${id}`);
    };

    const handleReview = (barcode: number) => {
        navigate(`/reviews/add/${barcode}`);
    };

    if (loading) {
        return <BarcodeLoading />;
    }

    if (history.length === 0) {
        return <div className="p-4 text-center text-gray-400 text-sm">No barcode history found.</div>;
    }

    const total = history.length;

    const formatDateTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleString("en-GB", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        }).replace(/\. /g, ".").replace(".", ". ");
    };

    return (
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow px-4 pt-4 pb-6 space-y-6">
            {/* Title & Icon */}
            <div className="flex items-center gap-2">
                <ReceiptText className="w-6 h-6 text-yellow-500" />
                <h2 className="text-xl font-semibold">Recent Barcode History</h2>
            </div>

            <ul className="space-y-4">
                {history.map((item, idx) => {
                    const reversedIndex = total - idx;

                    return (
                        <li
                            key={item.viewId}
                            className="flex rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                        >
                            {/* Index */}
                            <div className="flex-shrink-0 w-14 bg-white flex items-center justify-center text-yellow-500 font-extrabold text-xl select-none">
                                {reversedIndex}
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-3 flex flex-col gap-2">
                                <div
                                    className="flex items-center gap-3 cursor-pointer"
                                    onClick={() => handleDetail(item.barcode)}
                                >
                                    <img
                                        src={`http://localhost${item.productImageUrl}`}
                                        alt={item.productName}
                                        className="w-14 h-14 object-cover rounded-md"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-black font-bold truncate">{item.productName}</p>
                                        <p className="text-xs text-gray-600">{formatDateTime(item.regDate)}</p>
                                    </div>
                                </div>

                                {item.isReview ? (
                                    <button
                                        className="bg-gray-200 text-gray-600 px-4 py-2 rounded w-full text-sm font-semibold border border-gray-200 cursor-not-allowed"
                                        disabled
                                    >
                                        Review already submitted
                                    </button>
                                ) : (
                                    <button
                                        className="bg-yellow-400 text-gray-800 hover:bg-yellow-400 px-4 py-2 rounded w-full text-sm font-semibold border border-white"
                                        onClick={() => handleReview(item.barcode)}
                                    >
                                        Write a Review
                                    </button>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ul>

            {/* Footer Note */}
            <div className="mt-3 px-3 py-3 bg-gray-100 text-gray-600 rounded text-xs leading-tight text-left">
                Your recent barcode scans are automatically stored in history, with a maximum of 20 items saved.
            </div>
        </div>
    );
}

export default BarcodeHistoryComponent;