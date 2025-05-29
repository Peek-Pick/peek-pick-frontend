import type { UserCouponDTO } from "~/types/points";
import { CouponStatus } from "~/enums/points/points";

interface Props {
    coupons: UserCouponDTO[];
    page: number;
    size: number;
    totalElements: number;
    setPage: (page: number) => void;
    header?: React.ReactNode;
}

export default function UserCouponComponent({
                                                coupons,
                                                page,
                                                size,
                                                totalElements,
                                                setPage,
                                                header,
                                            }: Props) {
    const totalPages = Math.ceil(
        (Number.isFinite(totalElements) && totalElements >= 0 ? totalElements : 0) /
        (Number.isFinite(size) && size > 0 ? size : 1)
    );

    const onPageChange = (newPage: number) => {
        setPage(newPage);
    };

    return (
        <div className="bg-gray-50 py-6 px-3 sm:px-6">
            {header && <div className="mb-5">{header}</div>}

            {coupons.length === 0 ? (
                <p className="text-center text-gray-400 text-sm sm:text-base">
                    No coupons available.
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 justify-items-center">
                    {coupons.map((coupon, idx) => (
                        <div
                            key={`${coupon.couponId ?? "unknown"}-${idx}`}
                            className="w-full sm:max-w-xs md:max-w-sm lg:max-w-md bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-1 p-5 flex flex-col items-center text-center"
                        >
                            {/*이미지*/}
                            <div className="w-20 h-20 mb-4 rounded-xl overflow-hidden">
                                <img
                                    src={`http://localhost:8080/uploads/${coupon.couponImg}`}
                                    alt={coupon.itemName}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {/*이름*/}
                            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">
                                {coupon.itemName}
                            </h3>
                            {/*소멸일*/}
                            <p className="text-xs sm:text-sm text-gray-500 mb-1">
                                Expiry:{" "}
                                <span className="text-red-500 font-medium">
                                    {new Date(coupon.expiredAt).toLocaleDateString()}
                                </span>
                            </p>
                            {/*상태*/}
                            <p className="text-xs sm:text-sm text-gray-500">
                                Status:{" "}
                                <span className="font-medium">
                                    {CouponStatus[coupon.status as keyof typeof CouponStatus]}
                                </span>
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/*페이지네이션*/}
            <nav className="flex justify-center mt-6">
                <ul className="inline-flex items-center gap-1">
                    {/* 이전 버튼 */}
                    <li>
                        <button
                            type="button"
                            onClick={() => onPageChange(page - 1)}
                            disabled={page === 0}
                            className={`
                                w-9 h-9 flex items-center justify-center
                                font-medium text-gray-500 transition-colors duration-200 relative
                                ${page === 0 ? "cursor-not-allowed opacity-50" : "hover:text-yellow-500"}
                                focus:outline-none
                            `}
                            aria-disabled={page === 0}
                            aria-label="Previous page"
                        >
                            {/* 왼쪽 화살표 SVG */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    </li>

                    {/* 페이지 번호 */}
                    {[...Array(totalPages)].map((_, i) => {
                        const isActive = i === page;
                        return (
                            <li key={i}>
                                <button
                                    type="button"
                                    onClick={() => onPageChange(i)}
                                    aria-current={isActive ? "page" : undefined}
                                    className={`
                                        px-4 py-2 font-medium relative transition-colors duration-200
                                        ${isActive
                                        ? "text-gray-600 after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-yellow-500"
                                        : "text-gray-500 hover:text-yellow-500"
                                    }
                                        focus:outline-none
                                    `}
                                >
                                    {i + 1}
                                </button>
                            </li>
                        );
                    })}

                    {/* 다음 버튼 */}
                    <li>
                        <button
                            type="button"
                            onClick={() => onPageChange(page + 1)}
                            disabled={page === totalPages - 1}
                            className={`
                                w-9 h-9 flex items-center justify-center
                                font-medium text-gray-500 transition-colors duration-200 relative
                                ${page === totalPages - 1 ? "cursor-not-allowed opacity-50" : "hover:text-yellow-500"}
                                focus:outline-none
                            `}
                            aria-disabled={page === totalPages - 1}
                            aria-label="Next page"
                        >
                            {/* 오른쪽 화살표 SVG */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
