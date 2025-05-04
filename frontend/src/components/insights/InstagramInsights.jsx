import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import apiClient from "../../utils/apiClient";

function InstagramInsights() {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const res = await apiClient.get("/instagram/stats/");
            setStats(res.data);
        } catch (err) {
            console.error("Error fetching stats", err);
        } finally {
            setLoading(false);
        }
    };

    const refreshStats = async () => {
        setRefreshing(true);
        try {
            await apiClient.post("/instagram/refresh/");
            await fetchStats(); // Refresh and reload
        } catch (err) {
            console.error("Error refreshing stats", err);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Instagram Analytics</h2>
                <button
                    onClick={refreshStats}
                    disabled={refreshing}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    {refreshing ? "Refreshing..." : "Refresh Stats"}
                </button>
            </div>

            {loading ? (
                <p>Loading insights...</p>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={stats}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="timestamp" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="followers" stroke="#4f46e5" name="Followers" />
                        <Line type="monotone" dataKey="total_likes" stroke="#10b981" name="Likes" />
                        <Line type="monotone" dataKey="total_comments" stroke="#f59e0b" name="Comments" />
                    </LineChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}

export default InstagramInsights;
