import DashboardComponent from "~/components/admin/dashboardComponent";

//카드 배열
const cards = [
    { icon: "nc-globe", color: "text-yellow-500", category: "Capacity", title: "150GB", footer: "Update Now" },
    { icon: "nc-money-coins", color: "text-green-500", category: "Revenue", title: "$ 1,345", footer: "Last day" },
    { icon: "nc-vector", color: "text-red-500", category: "Errors", title: "23", footer: "In the last hour" },
    { icon: "nc-favourite-28", color: "text-blue-500", category: "Followers", title: "+45K", footer: "Update now" },
];

export default function DashboardPage() {
    return (
        <div>
            {/* 네비나 사이드바 등 */}
            <DashboardComponent cards={cards} />
        </div>
    );
}
