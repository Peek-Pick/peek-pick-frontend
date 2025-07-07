import { ResponsiveLine } from "@nivo/line";
import { ResponsivePie } from "@nivo/pie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import type { Dispatch, SetStateAction } from "react";

// 국가별 파이 그래프 색상 맵핑
const codeToLabelAndColor: Record<string, { label: string; color: string }> = {
    KR: { label: "한국", color: "#F6BDC0" },
    JP: { label: "일본", color: "#A3CEF1" },
    CN: { label: "중국", color: "#FF6B6B" },
    US: { label: "미국", color: "#C2F784" },
    ES: { label: "스페인", color: "#FFE29A" },
    VN: { label: "베트남", color: "#B8F2E6" },
    TH: { label: "태국", color: "#FDC5F5" },
    PH: { label: "필리핀", color: "#A47148" },
};

interface TrendChartComponentProps {
    selectedTab: "리뷰 추이" | "회원 추이" | "국적 분포"
    setSelectedTab: Dispatch<SetStateAction<"리뷰 추이" | "회원 추이" | "국적 분포">>;
    rawReviewData?: AdminDashChart[];
    rawUserData?: AdminDashChart[];
    rawNationalityData?: AdminDashChart[];
}

export default function TrendChartComponent({ selectedTab, setSelectedTab, rawReviewData, rawUserData, rawNationalityData }: TrendChartComponentProps) {

    const reviewData = [
        {
            id: "리뷰 추이",
            color: "#A3CEF1",
            data: rawReviewData ?? [],
        },
    ];

    const userData = [
        {
            id: "회원 추이",
            color: "#FFC4D1",
            data: rawUserData ?? [],
        },
    ];

    const nationalityData = rawNationalityData?.map((item) => {
        const info = codeToLabelAndColor[item.x]
        return {
            id: info.label,
            label: info.label,
            value: item.y,
            color: info.color,
        }
    }) ?? [];

    return (
        <div className="p-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-bold text-gray-800 border-b-2 border-gray-300 pb-1">
                    📊 데이터 통계
                </h4>
            </div>

            {/* 토글 탭 */}
            <div className="mb-4 flex space-x-3">
                {["국적 분포", "리뷰 추이", "회원 추이"].map((tab) => (
                    <button
                        key={tab}
                        className={`flex-1 py-2 text-sm font-semibold rounded-lg border transition-all duration-300 shadow-sm
                            ${
                            selectedTab === tab
                                ? "bg-pink-200 text-pink-900 border-pink-300 shadow-pink-300"
                                : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-pink-50 hover:text-pink-700"
                        }`}
                        onClick={() => setSelectedTab(tab as any)}
                        aria-pressed={selectedTab === tab}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* 통계 차트 */}
            <div style={{ height: 420, marginBottom: 10 }}>
                {selectedTab === "국적 분포" ? (
                    <ResponsivePie
                        data={nationalityData}
                        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                        innerRadius={0.55}
                        padAngle={0.7}
                        cornerRadius={5}
                        colors={(d) => d.data.color}
                        borderWidth={1}
                        borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
                        arcLinkLabelsSkipAngle={10}
                        arcLinkLabelsTextColor="#333"
                        arcLinkLabelsThickness={2}
                        arcLinkLabelsColor={{ from: "color" }}
                        arcLabelsSkipAngle={10}
                        arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
                        legends={[
                            {
                                anchor: "bottom",
                                direction: "row",
                                justify: false,
                                translateX: 0,
                                translateY: 60,
                                itemsSpacing: 10,
                                itemWidth: 80,
                                itemHeight: 5,
                                itemTextColor: "#999",
                                symbolSize: 14,
                                symbolShape: "circle",
                            },
                        ]}
                    />
                ) : (
                    <ResponsiveLine
                        data={selectedTab === "리뷰 추이" ? reviewData : userData}
                        margin={{ top: 20, right: 30, bottom: 60, left: 50 }}
                        xScale={{ type: "point" }}
                        yScale={{
                            type: "linear",
                            min: "auto",
                            max: "auto",
                            stacked: false,
                            reverse: false,
                        }}
                        curve="monotoneX"
                        axisTop={null}
                        axisRight={null}
                        axisBottom={{
                            tickSize: 5,
                            tickPadding: 10,
                            tickRotation: 0,
                            legendOffset: 40,
                            legendPosition: "middle",
                        }}
                        axisLeft={{
                            tickSize: 5,
                            tickPadding: 10,
                            tickRotation: 0,
                            legendOffset: -40,
                            legendPosition: "middle",
                            format: (v) => Number.isInteger(v) ? v : "",
                        }}
                        colors={{ scheme: "pastel1" }}
                        pointSize={8}
                        pointColor={{ theme: "background" }}
                        pointBorderWidth={2}
                        pointBorderColor={{ from: "serieColor" }}
                        pointLabelYOffset={-12}
                        useMesh={true}
                        enableGridX={false}
                        enableGridY={true}
                        legends={[
                            {
                                anchor: "bottom-right",
                                direction: "row",
                                justify: false,
                                translateX: 50,
                                translateY: 60,
                                itemsSpacing: 10,
                                itemDirection: "left-to-right",
                                itemWidth: 100,
                                itemHeight: 20,
                                itemOpacity: 0.85,
                                symbolSize: 12,
                                symbolShape: "circle",
                                symbolBorderColor: "rgba(0, 0, 0, .5)",
                            },
                        ]}
                    />
                )}
            </div>
        </div>
    );
}