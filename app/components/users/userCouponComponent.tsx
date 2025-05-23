import type { UserCouponDTO } from "~/types/points/points";

interface Props {
    coupons: UserCouponDTO[];
    page: number;
    size: number;
    totalElements: number;
    setPage: (page: number) => void;
}

export default function UserCouponComponent({
                                                coupons,
                                                page,
                                                size,
                                                totalElements,
                                                setPage,
                                            }: Props) {
    const totalPages = Math.ceil(
        (Number.isFinite(totalElements) && totalElements >= 0 ? totalElements : 0) /
        (Number.isFinite(size) && size > 0 ? size : 1)
    );

    const onPageChange = (newPage: number) => {
        setPage(newPage);
    };

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">🎟️ 내 쿠폰함</h2>

            <div className="space-y-5">
                {coupons.map((coupon, idx) => (
                    <div
                        key={`${coupon.couponId ?? "unknown"}-${idx}`}
                        className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-gray-100 hover:bg-gray-200 transition rounded-xl p-4 shadow-sm"
                    >
                        <div className="flex items-center">
                            <img
                                src={`http://localhost:8080/uploads/${coupon.couponImg}`}
                                alt={coupon.itemName}
                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shadow mr-4"
                            />
                            <div>
                                <p className="text-base font-semibold text-gray-800">{coupon.itemName}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    유효기간:{" "}
                                    <span className="text-red-500 font-medium">
                                        {new Date(coupon.expiredAt).toLocaleDateString()}
                                    </span>
                                </p>
                            </div>
                        </div>
                        <button className="mt-3 sm:mt-0 px-4 py-1.5 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium rounded-lg transition">
                            사용하기
                        </button>
                    </div>
                ))}
            </div>

            {/* 페이징 UI */}
            <nav className="flex flex-wrap justify-center mt-8 gap-2">
                <button
                    disabled={page === 0}
                    onClick={() => onPageChange(page - 1)}
                    className="px-4 py-2 text-sm rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    이전
                </button>

                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={`page-btn-${i}`}
                        onClick={() => onPageChange(i)}
                        className={`px-4 py-2 text-sm rounded-lg border font-medium transition ${
                            i === page
                                ? "bg-blue-600 text-white"
                                : "bg-white hover:bg-gray-100 text-gray-700"
                        }`}
                    >
                        {i + 1}
                    </button>
                ))}

                <button
                    disabled={page >= totalPages - 1}
                    onClick={() => onPageChange(page + 1)}
                    className="px-4 py-2 text-sm rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    다음
                </button>
            </nav>
        </div>
    );
}
