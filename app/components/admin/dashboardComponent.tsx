
import {useEffect} from 'react';
import { Outlet } from 'react-router';

interface Card {
    icon: string;
    color: string;
    category: string;
    title: string;
    footer: string;
}

interface DashboardContentProps {
    cards: Card[];
}

export default function DashboardComponent({ cards }: DashboardContentProps) {

    useEffect(() => {
        // 차트 초기화 코드 자리 (Chart.js, Recharts 등으로 교체 권장)
    }, []);


    return (
        <section className="content p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {cards.map((card, idx) => (
                    <div key={idx} className="card bg-white rounded shadow p-4">
                        <div className="flex items-center">
                            <div className={`icon-big text-3xl mr-4 ${card.color}`}>
                                <i className={`nc-icon ${card.icon}`} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">{card.category}</p>
                                <p className="text-xl font-bold">{card.title}</p>
                            </div>
                        </div>
                        <div className="mt-4 border-t pt-2 text-sm text-gray-400">
                            <i className="fa fa-refresh mr-2"></i> {card.footer}
                        </div>
                    </div>
                ))}
            </div>

            {/* 차트 섹션 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
                <div className="bg-white rounded-xl shadow-md p-4">
                    <h5 className="text-lg font-semibold">Users Behavior</h5>
                    <p className="text-gray-500 text-sm mb-2">24 Hours performance</p>
                    <canvas id="chartHours" height="100" className="w-full" />
                    <div className="border-t mt-4 pt-2 text-sm text-gray-400">
                        <i className="fa fa-history mr-2" /> Updated 3 minutes ago
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-xl shadow-md p-4 col-span-1">
                    <h5 className="text-lg font-semibold">Email Statistics</h5>
                    <p className="text-gray-500 text-sm mb-2">Last Campaign Performance</p>
                    <canvas id="chartEmail" className="w-full" />
                    <div className="mt-4">
                        <div className="flex flex-wrap gap-4 text-sm">
              <span className="text-blue-500">
                <i className="fa fa-circle mr-1" />
                Opened
              </span>
                            <span className="text-yellow-500">
                <i className="fa fa-circle mr-1" />
                Read
              </span>
                            <span className="text-red-500">
                <i className="fa fa-circle mr-1" />
                Deleted
              </span>
                            <span className="text-gray-400">
                <i className="fa fa-circle mr-1" />
                Unopened
              </span>
                        </div>
                    </div>
                    <div className="border-t mt-4 pt-2 text-sm text-gray-400">
                        <i className="fa fa-calendar mr-2" /> Number of emails sent
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-4 col-span-2">
                    <h5 className="text-lg font-semibold">NASDAQ: AAPL</h5>
                    <p className="text-gray-500 text-sm mb-2">Line Chart with Points</p>
                    <canvas id="speedChart" className="w-full" height="100" />
                    <div className="mt-4 text-sm">
                        <div className="flex flex-wrap gap-4">
              <span className="text-info">
                <i className="fa fa-circle text-blue-500 mr-1" />
                Tesla Model S
              </span>
                            <span className="text-warning">
                <i className="fa fa-circle text-yellow-500 mr-1" />
                BMW 5 Series
              </span>
                        </div>
                    </div>
                    <div className="border-t mt-4 pt-2 text-sm text-gray-400">
                        <i className="fa fa-clock-o mr-2" /> Updated 3 minutes ago
                    </div>
                </div>
            </div>

            <Outlet />
        </section>
    );
}
