import { motion } from "framer-motion";
import {useEffect, useState} from "react";
import {getMyPage} from "~/api/users/myPageAPI";

interface WelcomeProps {
    handleSendMessage: (message: string) => Promise<void>;
}

export default function WelcomeComponent({ handleSendMessage }: WelcomeProps) {

    const [nickname, setNickname] = useState<string>("User");

    useEffect(() => {
        const fetchNickname = async () => {
            try {
                const data = await getMyPage();
                setNickname(data.nickname);
            } catch (error) {
                console.error("닉네임 불러오기 실패:", error);
            }
        };

        fetchNickname();
    }, []);


    // 웰컴 카드
    const faqSlides = [
        {
            title: 'Barcode & Product',
            subtitle: 'Check product info and Request registration',
            items: ['Check product info by barcode', 'Request product registration', 'Troubleshoot barcode recognition'],
        },
        {
            title: 'Reviews & Points',
            subtitle: 'Point accumulation and Review management',
            items: ['How to write a review', 'Earn points with reviews', 'Report a review'],
        },
        {
            title: 'Convenience Features',
            subtitle: 'Chatbot, Map, Account management',
            items: ['How to use the AI chatbot', 'Find nearby convenience stores', 'Sign up and withdraw account'],
        },
    ];

    return (
        <>
            <section className="space-y-1">
                {/* 카드 + 멘트 */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="flex justify-between items-start px-6 pt-10 pb-6"
                >
                    <div className="leading-loose text-xl">
                        <p>Hello, <span className="text-yellow-600 font-bold">{nickname}</span>!</p>
                        <p className="text-base font-semibold">I am Peek&Pick chatbot.</p>
                        <p className="text-sm text-gray-600">How can I assist you today?</p>
                    </div>

                    {/* 마스코트 자리 */}
                    <motion.img
                        src="/mascot.png"
                        alt="챗봇 마스코트"
                        className="w-32 h-32 flex-shrink-0"
                        initial={{ opacity: 0, scale: 0.3, y: -100 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 15,
                            delay: 0.8
                        }}
                    />
                </motion.div>

                {/* FAQ 슬라이드*/}
                <motion.div
                    className="flex overflow-x-auto space-x-4 snap-x snap-mandatory scroll-smooth pb-2 px-4"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
                >
                    {faqSlides.map((slide, idx) => (
                        <div
                            key={idx}
                            className="min-w-[75%] sm:min-w-[55%] bg-white rounded-2xl shadow p-5 snap-center"
                        >
                            <h4 className="font-bold text-lg mb-1 underline decoration-yellow-400">
                                {slide.title}
                            </h4>
                            <p className="text-sm mb-4 text-gray-600">{slide.subtitle}</p>

                            {slide.items.map((q) => (
                                <button
                                    key={q}
                                    onClick={() => {
                                        handleSendMessage(q).then();
                                    }}
                                    className="w-full border border-yellow-300 rounded-lg py-2 mb-2 text-sm hover:bg-yellow-50"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    ))}
                </motion.div>
            </section>
        </>
    );
}