import { useCallback } from "react";
import {CheckNickname} from "~/api/users/signupAPI";

// 10 * 11 * 90 = 9900가지 경우의 수

const adjectives = [
    "Brave", "Happy", "Clever", "Bright", "Silly", "Lively", "Gentle", "Shy", "Quick", "Bold"
]; // 10개

const animals = [
    "Tiger", "Penguin", "Fox", "Koala", "Panda", "Magpie", "Otter", "Sparrow", "Giant", "Eagle", "Seagull"
]; // 11개

const generateRandomNickname = () => {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const animal = animals[Math.floor(Math.random() * animals.length)];
    const num = Math.floor(Math.random() * 90) + 10; // 10 ~ 99
    return `${adj}${animal}${num}`;
};

export function useAutoNickname (){
    const generateUniqueNickname = useCallback(async (): Promise<string> => {
        let attempts = 0;

        while (attempts < 20) {
            const nickname = generateRandomNickname();
            const {exists} = await CheckNickname(nickname);

            if (!exists) return nickname;
            attempts++;
        }

        throw new Error("Failed to generate unique nickname after 20 attempts.");
    }, []);

    return { generateUniqueNickname };
};
