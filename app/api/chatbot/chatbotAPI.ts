import axios from "axios";

// ChatGPT 질문 보내기 (OpenAI API 직접 호출)
export const question = async (question: string): Promise<any> => {
    // ✅ 여기 본인의 OpenAI API 키를 넣으세요 (테스트용)
    const apiKey = '';

    const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: question }],
            temperature: 0.7,
        },
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
        }
    );

    return {
        response: {
            answer: response.data.choices[0].message.content.trim(),
        },
    };
};