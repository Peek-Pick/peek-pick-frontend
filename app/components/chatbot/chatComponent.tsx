import {useState, useEffect, useRef } from 'react';
import type { JSX } from 'react';
import { FiSend } from 'react-icons/fi';
import {question, resetMemory} from "~/api/chatbot/chatbotAPI";
import WelcomeComponent from "~/components/chatbot/welcomeComponent";
import ProductRecommendComponent from "~/components/chatbot/productRecommendComponent";

export default function ChatComponent() {
    // 챗봇 답변 텍스트
    const [messages, setMessages] = useState<{ content: string | JSX.Element; isFromChatbot: boolean }[]>([]);

    // 사용자 입력 텍스트
    const [inputValue, setInputValue] = useState<string>('');

    //  실제로 타이핑되어 보여지는 텍스트
    const [displayedMessage, setDisplayedMessage] = useState<string>('');

    // 챗봇이 타이핑 중인지 아닌지 (애니메이션 효과)
    const [isTyping, setIsTyping] = useState<boolean>(false);

    // 챗봇 응답 대기 여부 (사용자 입력 비활성화 효과)
    const [isWaitingForReply, setIsWaitingForReply] = useState<boolean>(false);

    // 자동 아래 스크롤 ref
    const scrollRef = useRef<HTMLDivElement>(null);

    // 자동 아래 스크롤
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping, displayedMessage]);

    useEffect(() => {
        if (isTyping) {
            // 가장 최근 메세지 - 챗봇 응답
            const lastMessage = messages[messages.length - 1];

            if (typeof lastMessage.content === 'string') {
                const fullText = lastMessage.content;
                let currentDisplayed = '';

                const interval = setInterval(() => {
                    if (currentDisplayed.length < fullText.length) {
                        // 아직 전체 메시지를 다 표시하지 않은 경우
                        currentDisplayed += lastMessage.content[currentDisplayed.length];
                        setDisplayedMessage(currentDisplayed);
                    } else {
                        // 다 표시되면 애니메이션 종료
                        clearInterval(interval);
                        setIsTyping(false);
                    }
                }, 30); // 30ms 간격
                return () => clearInterval(interval);
            } else {
                // JSX인 경우는 그냥 한 번에 보여주기 (애니메이션 생략)
                setDisplayedMessage('');
                setIsTyping(false);
            }
        }
    }, [isTyping, messages]);


    // 페이지 진입 시 메모리 초기화
    useEffect(() => {
        resetMemory();
        console.log("ChatPage 마운트됨");
    }, []);

    // 에러시 언어 감지
    const detectLanguage = (text: string) => {
        if (/^[a-zA-Z\s.,!?']+$/.test(text)) return 'en';
        if (/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(text)) return 'ko';
        if (/[ぁ-んァ-ン]/.test(text)) return 'ja';
        if (/[一-龥]/.test(text)) return 'zh';
        return 'en'; // fallback
    };

    // 사용자 질문(메세지) 전송 및 응답 처리 함수
    const handleSendMessage = async (customInput?: string) => {
        const trimmed = (customInput ?? inputValue).trim();
        if (!trimmed) return;

        // 대화 내역에 질문 추가하기
        setMessages((prev) => [...prev, { content: trimmed, isFromChatbot: false }]);
        setInputValue('');
        setIsWaitingForReply(true);

        try {
            // api 호출
            const response = await question(trimmed);

            const botReply = response || '답변을 불러올 수 없습니다.';

            if (typeof botReply === 'string' || botReply === null || Object.keys(botReply).length === 0) {
                // 그냥 문자열 답변 (예: 에러 메시지 등)
                setMessages((prev) => [...prev, { content: botReply, isFromChatbot: true }]);
            } else {
                // JSON 객체일 경우 React 컴포넌트로 렌더링
                setMessages((prev) => [
                    ...prev,
                    { content: <ProductRecommendComponent product={response} />, isFromChatbot: true },
                ]);
            }

            setDisplayedMessage('');
            setIsTyping(true);
        } catch (error) {
            console.error('챗봇 오류:', error);

            // 마지막 사용자 언어 감지해서, 오류 메시지 해당언어로 반환
            const lastUserMessageRaw = messages.filter(m => !m.isFromChatbot).pop()?.content ?? "";
            const lastUserMessage = typeof lastUserMessageRaw === "string" ? lastUserMessageRaw : "";
            const userLang = detectLanguage(lastUserMessage);
            const errorMessages = {
                en: "💡 The system is busy now. Please try again in a moment!",
                ko: "💡 지금 요청이 몰려 잠시 대답이 어려워요. 잠시 후 다시 시도해 주세요!",
                ja: "💡 現在リクエストが集中しており、少し後で再試行してください！",
                zh: "💡 当前请求过多，请稍后再试！"
            };
            const errorMessage = errorMessages[userLang];

            setMessages((prev) =>
                [...prev, { content: errorMessage, isFromChatbot: true }]
            );
        } finally {
            setIsWaitingForReply(false);
        }
    };

    return (
        <>
            {/* 웰컴 카드 영역 */}
            {messages.length === 0 && (
                <WelcomeComponent handleSendMessage={handleSendMessage} />
            )}

            {/* 메시지 영역 */}
            <main className="w-full flex flex-col overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-blue-100"
                  ref={scrollRef} style={{ height: 'calc(86vh)' }}>

                {messages.map((msg, index) => {
                    // 메세지 전송, 답변 시각
                    const messageTime = new Date().toLocaleTimeString([], {
                        hour: '2-digit', minute: '2-digit',});

                    return (
                        <div key={index} className={`max-w-[85%] ${msg.isFromChatbot ? 'self-start' : 'self-end'}`}>
                            {/* 메시지 상단 정보: 챗봇은 프로필+이름+시간 / 사용자는 시간만 */}
                            <div className="mb-2 px-1 flex items-center space-x-3 text-sm text-gray-500">
                                {msg.isFromChatbot ? (
                                    <>
                                        <img src="/mascot.png" alt="AI"
                                             className="w-9 h-9 rounded-full border"
                                        />
                                        <span className="font-semibold text-gray-700">김비서</span>
                                        <span>{messageTime}</span>
                                    </>
                                ) : (
                                    <span className="ml-auto text-right">{messageTime}</span>
                                )}
                            </div>

                            {/* 💬 말풍선 */}
                            <div
                                className={`flex items-start px-4 py-3 rounded-3xl break-words whitespace-pre-wrap
                                    ${msg.isFromChatbot
                                    ? 'bg-white text-gray-600 rounded-tl-none shadow-md'
                                    : 'bg-zinc-800 text-white rounded-tr-none shadow-md'}
                                `}
                                style={{ wordBreak: 'break-word', fontSize: '1rem' }}
                            >
                                <span>
                                    {msg.isFromChatbot && isTyping && index === messages.length - 1
                                        ? displayedMessage
                                        : msg.content}
                                </span>
                            </div>
                        </div>
                    );
                })}

                {/* 챗봇 답변 대기 */}
                {isWaitingForReply && (
                    <div className="max-w-[85%] self-start bg-white text-gray-600 inline-flex items-center px-5 py-3 rounded-2xl rounded-tl-none shadow-lg animate-pulse">
                        <span style={{ fontSize: '1rem' }}>생각중...</span>
                    </div>
                )}
            </main>

            {/* 입력 영역 - 항상 하단 고정, 반응형으로 크기 확대 */}
            <footer className="h-[8vh] fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 px-4 py-4 flex items-center">
                <input
                    className="flex-1 border border-gray-300 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                    type="text"
                    placeholder="궁금한 내용을 입력해 주세요."
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        e.target.style.height = "auto";
                        e.target.style.height = `${Math.min(e.target.scrollHeight, 192)}px`;
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault(); // 줄바꿈 막기
                            handleSendMessage().then(() => {});
                        }
                    }}
                    disabled={isWaitingForReply}    /* 응답 대기 중엔 입력 비활성화 */
                    style={{ minWidth: '0' }}   /* input 내부에서 overflow 방지용 */
                    aria-label="채팅 입력창"
                />
                <button
                    onClick={() => handleSendMessage()}
                    disabled={isWaitingForReply || inputValue.trim() === ''}
                    className={`ml-4 transition-colors ${
                        isWaitingForReply || inputValue.trim() === ''
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-amber-600 hover:text-amber-800'
                    }`}
                    aria-label="메시지 전송"
                >
                    <FiSend className="w-7 h-7" />
                </button>
            </footer>
        </>
    );
}