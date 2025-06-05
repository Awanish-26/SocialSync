import { FiCalendar, FiDownload } from 'react-icons/fi';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ChartCard from '../components/charts/ChartCard';
import { FaYoutube, FaTwitter } from 'react-icons/fa';

const Analytics = () => {
  // Dummy engagement rate data for YouTube
  const engagementRateData = [
    { x: '2025-05-01', y: 2.1 },
    { x: '2025-05-02', y: 2.5 },
    { x: '2025-05-03', y: 2.8 },
    { x: '2025-05-04', y: 3.0 },
    { x: '2025-05-05', y: 2.7 },
    { x: '2025-05-06', y: 3.2 },
    { x: '2025-05-07', y: 3.5 }
  ];

  // Convert dummy data to expected format for LineChart
  const engagementRateChartData = engagementRateData.map(d => ({ date: d.x, value: d.y }));

  // Dummy content performance data
  const mostLiked = { title: 'Sample Video', likes: 1200, shares: 200, date: '2025-05-03', time_of_day: '6:00 PM - 8:00 PM', day_of_week: 'Thursday' };
  const contentPerformanceData = [
    { x: '2025-05-01', y: 400 },
    { x: '2025-05-02', y: 600 },
    { x: '2025-05-03', y: 1200 },
    { x: '2025-05-04', y: 800 },
    { x: '2025-05-05', y: 700 }
  ];

  // Dummy engagement breakdown
  const totalLikes = 3200;
  const totalComments = 800;
  const totalShares = 400;
  const totalEngagement = totalLikes + totalComments + totalShares;
  const likesPercent = Math.round((totalLikes / totalEngagement) * 100);
  const commentsPercent = Math.round((totalComments / totalEngagement) * 100);
  const sharesPercent = 100 - likesPercent - commentsPercent;

  return (
    <div className="p-4 md:p-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Detailed Analytics</h1>
          <div className="flex items-center mt-2 text-sm text-gray-500">
            <FiCalendar className="w-4 h-4 mr-1" />
            <span>Last 30 days</span>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          icon={<FiDownload className="w-4 h-4" />}
        >
          Export Report
        </Button>
      </div>

      {/* Engagement Rate Graph */}
      <ChartCard
        className="w-full"
        title="Engagement Rate"
        data={engagementRateChartData}
        color="#10B981"
        timeframe="Last 7 days"
        height={320}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Content Performance */}
        <Card title="Content Performance">
          <div className="mb-2 space-y-3">
            {/* Top Post Block */}
            <div className="flex items-center justify-between rounded-lg bg-gray-200/80 px-4 py-3">
              <div>
                <div className="text-base text-gray-900">{mostLiked.title || 'N/A'}</div>
                <div className="text-xs text-gray-500 mt-1">{mostLiked.date || 'N/A'}</div>
              </div>
              <div className="text-right">
                <div className="text-base font-bold text-green-600">{mostLiked.likes?.toLocaleString() || 0}</div>
                <div className="text-xs text-purple-500 font-semibold mt-1">{mostLiked.shares?.toLocaleString() || 0} Shares</div>
              </div>
            </div>
            {/* Best Time Block */}
            <div className="flex items-center justify-between rounded-lg bg-gray-200/80 px-4 py-3">
              <div>
                <div className="text-base text-gray-900">Best Time</div>
                <div className="text-xs text-gray-500 mt-1">Based on engagement</div>
              </div>
              <div className="text-right">
                <div className="text-base text-blue-600">{mostLiked.time_of_day || '6:00 PM - 8:00 PM'}</div>
                <div className="text-xs text-green-600 mt-1">{mostLiked.day_of_week || 'Thursday'}</div>
              </div>
            </div>
          </div>
        </Card>
        {/* Engagement Breakdown */}
        <Card title="Engagement Breakdown">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-700 font-medium">Likes</span>
              <span className="font-semibold text-green-600">{totalLikes.toLocaleString()} <span className="text-xs text-gray-500">({likesPercent}%)</span></span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-green-400" style={{ width: `${likesPercent}%` }}></div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-700 font-medium">Comments</span>
              <span className="font-semibold text-blue-600">{totalComments.toLocaleString()} <span className="text-xs text-gray-500">({commentsPercent}%)</span></span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-blue-400" style={{ width: `${commentsPercent}%` }}></div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-700 font-medium">Shares</span>
              <span className="font-semibold text-purple-600">{totalShares.toLocaleString()} <span className="text-xs text-gray-500">({sharesPercent}%)</span></span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-purple-400" style={{ width: `${sharesPercent}%` }}></div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
