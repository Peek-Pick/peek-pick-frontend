export type Locale = "ko" | "en" | "ja" | "zh";

export interface CategoryItem {
    id: number;
    emoji: string;
    label: Record<Locale, string>;
}

/**
 * 카테고리 목록 (숫자 ID 및 다국어 라벨 포함)
 */
export const CATEGORY_LIST: CategoryItem[] = [
    {
        id: 1,
        emoji: "🍪",
        label: {
            ko: "과자류",
            en: "Snacks",
            ja: "スナック",
            zh: "零食"
        },
    },
    {
        id: 2,
        emoji: "🍙",
        label: {
            ko: "삼각김밥/김밥",
            en: "Kimbap/Onigiri",
            ja: "キンパ/おにぎり",
            zh: "紫菜包饭/饭团"
        },
    },
    {
        id: 3,
        emoji: "🍜",
        label: {
            ko: "면류",
            en: "Noodles",
            ja: "麺類",
            zh: "面类"
        },
    },
    {
        id: 4,
        emoji: "🥐",
        label: {
            ko: "빵/디저트",
            en: "Bread/Dessert",
            ja: "パン/デザート",
            zh: "面包/甜点"
        },
    },
    {
        id: 5,
        emoji: "🍦",
        label: {
            ko: "아이스크림",
            en: "Ice Cream",
            ja: "アイスクリーム",
            zh: "冰淇淋"
        },
    },
    {
        id: 6,
        emoji: "🍬",
        label: {
            ko: "캔디/껌",
            en: "Candy/Gum",
            ja: "キャンディ/ガム",
            zh: "糖果/口香糖"
        },
    },
    {
        id: 7,
        emoji: "🥤",
        label: {
            ko: "음료",
            en: "Drinks",
            ja: "飲料",
            zh: "饮料"
        },
    },
    {
        id: 8,
        emoji: "🥪",
        label: {
            ko: "샌드위치/햄버거",
            en: "Sandwich/Burger",
            ja: "サンドイッチ/ハンバーガー",
            zh: "三明治/汉堡"
        },
    },
    {
        id: 9,
        emoji: "🍱",
        label: {
            ko: "도시락",
            en: "Lunch Box",
            ja: "弁当",
            zh: "便当"
        },
    },
    {
        id: 10,
        emoji: "🍎",
        label: {
            ko: "과일/샐러드",
            en: "Fruit/Salad",
            ja: "フルーツ/サラダ",
            zh: "水果/沙拉"
        },
    },
    {
        id: 11,
        emoji: "😡",
        label: {
            ko: "즉석섭취식품",
            en: "Ready-to-Eat",
            ja: "すぐに食べられる",
            zh: "即食食品"
        },
    },
    {
        id: 12,
        emoji: "🍲",
        label: {
            ko: "즉석조리식품",
            en: "Instant to Cook",
            ja: "簡単な調理が必要",
            zh: "需简单加热"
        },
    },
    {
        id: 13,
        emoji: "🧂",
        label: {
            ko: "식재료",
            en: "Ingredients",
            ja: "材料",
            zh: "食材"
        },
    },
    {
        id: 14,
        emoji: "💪",
        label: {
            ko: "건강식품",
            en: "Health Food",
            ja: "健康食品",
            zh: "保健食品"
        },
    },
    {
        id: 15,
        emoji: "📦",
        label: {
            ko: "기타",
            en: "Other",
            ja: "その他",
            zh: "其他"
        },
    },
];

export function getLocalizedCategories(locale: Locale) {
    return CATEGORY_LIST.map(({ id, emoji, label }) => ({
        id,
        emoji,
        label: label[locale] ?? label["ko"],
    }));
}
