import { motion } from "framer-motion";

interface WelcomeProps {
    handleSendMessage: (message: string) => Promise<void>;
}

export default function WelcomeComponent({ handleSendMessage }: WelcomeProps) {
    // 웰컴 카드
    const faqSlides = [
        {
            title: '자주 묻는 질문',
            subtitle: '챗봇추천, 똑똑하게 리뷰하자!',
            items: ['리뷰 작성 방법', '별점 수정하기', '리뷰 삭제는 어떻게?'],
        },
        {
            title: '도전! 미션',
            subtitle: '리뷰 미션 참여하고 포인트 적립',
            items: ['오늘의 미션', '주간 랭킹', '리뷰 꿀팁'],
        },
        {
            title: '이벤트',
            subtitle: '지금 진행 중인 이벤트',
            items: ['포토리뷰 챌린지', '베스트 리뷰어', '꿀템 추천'],
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
                        <p>안녕하세요, <span className="text-yellow-600 font-bold">포빙빙</span>님!</p>
                        <p className="mb-4">Peek&Pick 챗봇입니다.</p>
                        <p className="text-sm text-gray-600">어떤 도움이 필요하신가요?</p>
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