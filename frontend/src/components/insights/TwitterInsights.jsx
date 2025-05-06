import { useEffect, useState } from "react";
import apiClient from "../../utils/apiClient";
import { FiUsers, FiMessageSquare, FiHeart, FiRefreshCw, FiCalendar } from "react-icons/fi";
import MetricCard from "../metrics/MetricCard";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import Button from "../ui/Button";

function TwitterInsights() {
    const [stats, setStats] = useState([]);
    const [topStats, setTopStats] = useState(null);

    const fetchStats = async () => {
        try {
            const res = await apiClient.get("/twitter/stats");
            if (res.data.length > 0) {
                setStats(res.data);
                setTopStats(res.data[res.data.length - 1]);
            }
        } catch (error) {
            console.error("Error fetching Twitter stats:", error);
        }
    };

    const refreshStats = async () => {
        try {
            await apiClient.post("/twitter/refresh/");
            fetchStats();
        }
        catch (error) {
            console.error("Error refreshing Twitter stats:", error);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (!stats) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-4 md:p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Twitter Insights</h1>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                        <FiCalendar className="w-4 h-4 mr-1" />
                        {topStats && (
                            <span>Last updated: {topStats.timestamp}</span>
                        )}
                    </div>
                </div>
                <div className="flex items-center relative">
                    <Button onClick={refreshStats} className="" variant="outline" size="md" icon={<FiRefreshCw className="w-4 h-4" />}>
                        Refresh Data
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {topStats ? (
                    <>
                        <MetricCard
                            title="Followers"
                            metric={{
                                value: topStats.followers_count || 0,
                                change: 0,
                                trend: 'neutral',
                            }}
                            icon={<FiUsers className="text-2xl" />}
                        />
                        <MetricCard
                            title="Tweets"
                            metric={{
                                value: topStats.tweets_count || 0,
                                change: 0,
                                trend: 'neutral',
                            }}
                            icon={<FiMessageSquare className="text-2xl" />}
                        />
                        <MetricCard
                            title="Likes"
                            metric={{
                                value: topStats.likes_count || 0,
                                change: 0,
                                trend: 'neutral',
                            }}
                            icon={<FiHeart className="text-2xl" />}
                        />
                    </>
                ) : (
                    <div>Loading metrics...</div>
                )}
            </div>
            {/* Chart Section */}
            <div className="bg-white p-4 rounded shadow">
                <h2 className="text-lg font-bold mb-4">Followers Growth</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={stats}>
                        <XAxis dataKey="timestamp" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="followers_count" stroke="#3B82F6" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="bg-white p-4 rounded shadow mt-4">
                <h2 className="text-lg font-bold mb-4">Tweets Growth</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={stats}>
                        <XAxis dataKey="timestamp" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="tweets_count" stroke="#3B82F6" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="bg-white p-4 rounded shadow mt-4">
                <h2 className="text-lg font-bold mb-4">Likes Growth</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={stats}>
                        <XAxis dataKey="timestamp" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="likes_count" stroke="#3B82F6" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default TwitterInsights;