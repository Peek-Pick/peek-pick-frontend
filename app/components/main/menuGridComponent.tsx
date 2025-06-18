import {useNavigate} from "react-router-dom";

const MenuGrid: React.FC = () => {

    const navigate = useNavigate();

    const menus = [
        {
            icon: 'https://img.icons8.com/?size=100&id=13124&format=png&color=000000',
            label: 'Barcode',
            to: '/barcode/scan',
        },
        {
            icon: 'https://www.gstatic.com/android/keyboard/emojikitchen/20230821/u1fa77/u1fa77_u1fa84.png',
            label: 'WishList',
            to: '/mypage/favorites',
        },
        {
            icon: 'https://www.gstatic.com/android/keyboard/emojikitchen/20240206/u1f48c/u1f48c_u1f30c.png',
            label: 'Event',
            to: '/notices/list',
        },
        {
            icon: 'https://img.icons8.com/?size=100&id=ZInIxVkif7vO&format=png&color=000000',
            label: 'Nearby Stores',
            to: '/map',
        },
        {
            icon: 'https://img.icons8.com/?size=100&id=108832&format=png&color=000000',
            label: 'AI ChatBot',
            to: '/chatbot',
        },
        {
            icon: 'https://img.icons8.com/?size=100&id=O713QAUVtMnH&format=png&color=000000',
            label: 'Ranking',
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
