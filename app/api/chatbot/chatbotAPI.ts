
import axiosInstance from "~/instance/axiosInstance";

// ChatGPT 질문 보내기 (OpenAI API 직접 호출)
export const question = async (userMessage: string) => {

    const response = await axiosInstance.post(
        'chatbot/ask',
        userMessage,
        {
            headers: {
                'Content-Type': 'text/plain',
            },
            responseType: 'text'  // 명시적으로 text 받기
        }
    );
    try {
        return JSON.parse(response.data); // JSON 형식이면 객체로
    } catch {
        return response.data; // JSON 아니면 그냥 문자열 반환
    }
};