
interface HeaderProps {
    backgroundProfile: string;
    avatarImage: string;
    name: string;
    email: string;
}

const AuDetailHeaderComponent: React.FC<HeaderProps> = ({
                                           backgroundProfile,
                                           avatarImage,
                                           name,
                                           email,
                                       }) => {
    return (
        <div className="relative flex flex-col items-center mb-[70px] sm:mb-[205px] md:mb-[75px] px-0">
            {/* 배경 이미지 */}
            <img
                src="/BackgroundCard1.png"
                alt="Profile Background"
                className="w-full h-[300px] object-cover rounded-[25px]"
            />

            {/* 프로필 카드 */}
            <div
                className={`absolute top-[220px] sm:top-[380px] md:top-[250px] flex flex-col md:flex-row items-center justify-between w-[90%] max-w-[95%] px-6 py-6 rounded-[20px] shadow-md backdrop-blur-[50px] border-2 ${backgroundProfile} border-white/80 dark:border-white/30`}
            >
                <div className="flex flex-col md:flex-row items-center text-center md:text-left w-full">
                    <img
                        src={`http://localhost/${avatarImage}`}
                        alt="Avatar"
                        className="w-[80px] h-[80px] rounded-[15px] md:mr-[22px]"
                    />
                    <div className="flex flex-col mt-4 md:mt-0">
            <span className="text-lg md:text-xl font-bold text-gray-700 dark:text-white">
              {name}
            </span>
                        <span className="text-sm md:text-md font-semibold text-gray-400 dark:text-gray-300">
              {email}
            </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuDetailHeaderComponent;
