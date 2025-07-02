export const countryCodeMap: Record<string, string> = {
    KR: "Korea",
    JP: "Japan",
    CN: "CHINA",
    US: "USA",
    ES: "Spain",
    VN: "Vietnam",
    TH: "Thailand",
    PH: "Philippines",
};

export function getCountryName(code: string | null | undefined): string {
    if (!code) return "N/A";
    return countryCodeMap[code.toUpperCase()] ?? "N/A";
}