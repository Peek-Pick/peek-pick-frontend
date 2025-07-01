import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

const MenuGrid: React.FC = () => {
    // 국제화 적용
    const { t } = useTranslation();

    const navigate = useNavigate();

    const menus = [
        {
            icon: '/icons/main_barcode.png',
            label: t('mainBarcode'),
            to: '/barcode/scan',
        },
        {
            icon: '/icons/main_favorite.png',
            label: t('mainWishList'),
            to: '/mypage/favorites',
        },
        {
            icon: '/icons/main_event.png',
            label: t('mainEvent'),
            to: '/notices/list',
        },
        {
            icon: '/icons/main_map.png',
            label: t('mainNearbyStores'),
            to: '/map',
        },
        {
            icon: '/icons/main_chatbot.png',
            label: t('mainAIChatBot'),
            to: '/chatbot',
        },
        {
            icon: '/icons/main_ranking.png',
            label: t('mainRanking'),
            to: '/products/ranking',
        },
    ];

    return (
        <div className="container relative z-40 mx-auto mt-4 mb-4">
            <div className="grid grid-cols-3">
                {menus.map((menu, idx) => (
                    <button
                        key={idx}
                        onClick={() => navigate(menu.to)} // 또는 navigate(menu.to)
                        className="flex flex-col items-center justify-center py-6 shadow-sm bg-white hover:bg-gray-50"
                    >
                        <img src={menu.icon} alt={menu.label} className="w-10 h-10" />
                        <span className="pt-2 text-m font-medium text-gray-700">
              {menu.label}
            </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MenuGrid;
