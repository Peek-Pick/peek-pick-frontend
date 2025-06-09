
const PlatformSettings = ({ title, subtitle1, subtitle2 }: { title: string; subtitle1: string; subtitle2: string }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
            <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-700 dark:text-white">{title}</h2>
            </div>
            <div className="flex flex-col">
                <p className="text-sm font-semibold text-gray-500 mb-5">{subtitle1}</p>

                {[
                    "Email me when someone follows me",
                    "Email me when someone answers on my post",
                    "Email me when someone mentions me",
                ].map((text, index) => (
                    <div className="flex items-center mb-5" key={index}>
                        <input type="checkbox" className="toggle-checkbox mr-3 accent-teal-500" />
                        <p className="text-md text-gray-500 truncate">{text}</p>
                    </div>
                ))}

                <p className="text-sm font-semibold text-gray-500 my-6">{subtitle2}</p>

                {[
                    "New launches and projects",
                    "Monthly product changes",
                    "Subscribe to newsletter",
                ].map((text, index) => (
                    <div className="flex items-center mb-5" key={index}>
                        <input type="checkbox" className="toggle-checkbox mr-3 accent-teal-500" />
                        <p className="text-md text-gray-500 truncate">{text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlatformSettings;
