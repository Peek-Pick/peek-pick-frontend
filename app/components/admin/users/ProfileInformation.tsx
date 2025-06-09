import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const ProfileInformation = ({
                                title,
                                description,
                                name,
                                mobile,
                                email,
                                location,
                            }: {
    title: string;
    description: string;
    name: string;
    mobile: string;
    email: string;
    location: string;
}) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 my-6">
            <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-700 dark:text-white">{title}</h2>
            </div>
            <div className="flex flex-col">
                <p className="text-md text-gray-500 mb-8">{description}</p>

                {[
                    { label: "Full Name", value: name },
                    { label: "Mobile", value: mobile },
                    { label: "Email", value: email },
                    { label: "Location", value: location },
                ].map((item, index) => (
                    <div className="flex items-center mb-4" key={index}>
                        <p className="text-md font-bold text-gray-700 dark:text-white mr-2">{item.label}:</p>
                        <p className="text-md text-gray-500">{item.value}</p>
                    </div>
                ))}

                <div className="flex items-center mb-4">
                    <p className="text-md font-bold text-gray-700 dark:text-white mr-2">Social Media:</p>
                    <div className="flex space-x-4 text-teal-500">
                        <a href="#" className="hover:text-teal-600">
                            <FaFacebook />
                        </a>
                        <a href="#" className="hover:text-teal-600">
                            <FaInstagram />
                        </a>
                        <a href="#" className="hover:text-teal-600">
                            <FaTwitter />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileInformation;
