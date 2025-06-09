export const countryCodeMap: Record<string, string> = {
    KR: "대한민국",
    JP: "일본",
    CN: "중국",
    US: "미국",
    ES: "스페인",
    VN: "베트남",
    TH: "태국",
    PH: "필리핀",
};

export function getCountryName(code: string | null | undefined): string {
    if (!code) return "N/A";
    return countryCodeMap[code.toUpperCase()] ?? "N/A";
}