import {
    FaStore, FaUserCog, FaCoins, FaAngleRight,
    FaHeart, FaPen, FaTicketAlt, FaBarcode,
    FaQuestionCircle, FaBell, FaUserShield, FaFileContract, FaIdBadge, FaUserAltSlash
} from 'react-icons/fa';
import { IoLanguage, IoLogOutOutline } from "react-icons/io5";
import { useNavigate } from "react-router";

import type { MypageData } from "~/types/users";
import {useAccountDelete} from "~/hooks/users/useAccountDelete";

// 타입 정의
interface MyPageProps {
    myData: MypageData;
}

export default function MyPageComponent({ myData }:MyPageProps) {

    const navigate = useNavigate();

    // 삭제 모달 불러오기
    const { openDeleteModal } = useAccountDelete();

    // 동적 quickStats
    const quickStats = [
        { icon: <FaHeart className="text-pink-500 text-2xl mb-2" />, label: 'Wishlisted Items', value: myData.wishlistedCount, to:'/mypage/favorites' },
        { icon: <FaPen className="text-blue-500 text-2xl mb-2" />, label: 'My Reviews', value: myData.reviewCount, to:'/reviews/user' },
        { icon: <FaTicketAlt className="text-yellow-500 text-2xl mb-2" />, label: 'Coupons', value: myData.couponCount, to:'/mypage/coupons' },
        { icon: <FaBarcode className="text-green-500 text-2xl mb-2" />, label: 'Barcode History', value: myData.barcodeHistoryCount, to:'/barcode/history' },
    ];

    const buttons = [
        { icon: IoLanguage, label: 'Language Settings', to: '' },
        { icon: FaQuestionCircle, label: 'Support', to: '' },
        { icon: FaBell, label: 'Notifications', to: '' },
        { icon: FaUserShield, label: 'Privacy Policy', to: '' },
        { icon: FaFileContract, label: 'Terms of Service', to: '' },
        { icon: FaIdBadge, label: 'Licenses', to: '' },
        { icon: IoLogOutOutline, label: 'Logout', to: '/logout' },
        { icon: FaUserAltSlash, label: 'Delete Account', onClick: openDeleteModal },
    ];

    return (
        <>
            {/* 커버 + 프로필 */}
            <div className="relative mb-8">
                <div className="bg-gradient-to-r from-yellow-200 to-green-300 h-40 rounded-xl relative" />
                <div className="text-center">
                    <div className="relative inline-block -mt-16">
                        <img
                            src={`http://localhost/${myData.profileImgUrl}`}
                            alt="Profile"
                            className="w-28 h-28 rounded-full border-4 border-white bg-white object-cover"
                        />
                    </div>
                    <h3 className="mt-4 mb-1 text-xl font-semibold">{myData.nickname}</h3>
                    <div className="flex justify-center mb-2">
                        <button
                            onClick={ ()=> navigate('/mypage/points/history')}
                            className="rounded flex items-center justify-center space-x-2 px-4 py-2 hover:bg-gray-100">
                            <FaCoins className="text-indigo-500 text-xl" />
                            <p className="text-gray-500">{myData.point.toLocaleString()} Beeplet</p>
                            <FaAngleRight className="text-gray-500 text-xl" />
                        </button>
                    </div>
                    <div className="flex justify-center gap-2">
                        <button
                            onClick={ ()=> navigate('/points/store/list')}
                            className="border border-amber-300 text-amber-300 px-4 py-1 flex items-center hover:bg-gray-100">
                            <FaStore className="mr-2" /> Point Store
                        </button>
                        <button
                            onClick={ ()=> navigate('/mypage/edit')}
                            className="bg-amber-300 hover:bg-amber-400 active:bg-amber-200 text-white px-4 py-1 rounded flex items-center">
                            <FaUserCog className="mr-2" /> Edit Profile
                        </button>
                    </div>
                </div>
            </div>

            {/* 퀵 통계 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 mb-6">
                {quickStats.map((item, index) => (
                    <button key={index}
                            onClick={ ()=> navigate(item.to)}
                            className="bg-white shadow hover:shadow-md transition rounded-xl p-4 flex flex-col items-center text-center w-full">
                        {item.icon}
                        <span className="text-lg font-semibold text-gray-800">{item.value}</span>
                        <p className="text-sm font-medium text-gray-600 mb-1">{item.label}</p>
                    </button>
                ))}
            </div>

            {/* 기능 버튼 */}
            <div className="p-4 space-y-2">
                {buttons.map(({ icon: Icon, label, to, onClick }, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            if (onClick) onClick();
                            else if (to) navigate(to);
                        }}
                        className="w-full flex items-center px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-600 text-base"
                    >
                    <Icon className="mr-2" />
                    <span>{label}</span>
                    </button>
                ))}
            </div>
        </>
    );
}