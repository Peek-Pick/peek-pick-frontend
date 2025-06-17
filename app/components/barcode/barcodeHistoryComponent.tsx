import { useEffect, useState } from "react";
import type { ViewHistoryResponseDTO } from "~/types/viewHistory";
import { getBarcodeHistory } from "~/api/barcodeAPI";
import { useNavigate } from "react-router-dom";
import LoadingComponent from "~/components/common/loadingComponent";

function BarcodeHistoryComponent() {
    const [history, setHistory] = useState<ViewHistoryResponseDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const nav = useNavigate();

    useEffect(() => {
        async function fetchHistory() {
            setLoading(true);
            try {
                const response = await getBarcodeHistory();
                setHistory(response);
            } catch (error) {
                console.error("바코드 조회 이력 불러오기 실패:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchHistory();
    }, []);

    const handleDetail = (id: number) => {
        nav(`/products/${id}`);
    };

    const handleReview = (barcode: number) => {
        nav(`/reviews/add/${barcode}`);
    };

    if (loading) {
        return <LoadingComponent isLoading={true} />;
    }
    if (history.length === 0) return <div className="p-4">바코드 조회 이력이 없습니다.</div>;

    return (
        <div className="p-4 space-y-4">
            <h2 className="text-xl font-semibold">최근 바코드 조회 내역</h2>
            <ul className="space-y-4">
                {history.map((item) => (
                    <li
                        key={item.viewId}
                        className="flex flex-col md:flex-row md:items-center justify-between border p-4 rounded shadow-sm gap-4"
                    >
                        <div className="flex items-center gap-4 cursor-pointer" onClick={() => handleDetail(item.barcode)}>
                            <img
                                src={item.productImageUrl}
                                alt={item.productName}
                                className="w-16 h-16 object-cover rounded"
                            />
                            <div>
                                <p className="font-semibold">{item.productName}</p>
                                <p className="text-sm text-gray-600">
                                    조회일시: {new Date(item.regDate).toLocaleString()}
                                </p>
                            </div>
                        </div>
                        <div>
                            {item.isReview ? (
                                <button
                                    className="bg-gray-300 text-gray-600 cursor-not-allowed px-4 py-2 rounded mt-2 md:mt-0"
                                    disabled
                                >
                                    이미 리뷰를 작성하였습니다
                                </button>
                            ) : (
                                <button
                                    className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded mt-2 md:mt-0"
                                    onClick={() => handleReview(item.barcode)}
                                >
                                    리뷰쓰기
                                </button>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default BarcodeHistoryComponent;