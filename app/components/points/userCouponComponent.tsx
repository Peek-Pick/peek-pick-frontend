import type { UserCouponDTO } from "~/types/points";
import { CouponStatus } from "~/enums/points/points";

interface Props {
    coupons: UserCouponDTO[];
    header?: React.ReactNode;
}

export default function UserCouponComponent({ coupons, header }: Props) {

    console.log(coupons);

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
                            className="w-full sm:max-w-xs md:max-w-sm lg:max-w-md bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-1 p-3 flex flex-col items-center"
                        >
                            {/* 이미지 */}
                            <div className="w-65 h-48 sm:h-48 rounded-lg overflow-hidden mb-3">
                                <img
                                    src={`http://localhost/points/${coupon.couponImg}`}
                                    alt={coupon.itemName}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            </div>

                            {/* 이름 */}
                            <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-1 text-center">
                                {coupon.itemName}
                            </h3>

                            {/* 소멸일 */}
                            <p className="text-xs sm:text-sm text-gray-500 mb-0.5 text-center">
                                Expiry:{" "}
                                <span className="text-red-500 font-medium">
                                  {new Date(coupon.expiredAt).toLocaleDateString()}
                                </span>
                            </p>

                            {/* 상태 */}
                            <p className="text-xs sm:text-sm text-gray-500 text-center">
                                Status:{" "}
                                <span className="font-medium">
                                  {CouponStatus[coupon.status as keyof typeof CouponStatus]}
                                </span>
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
