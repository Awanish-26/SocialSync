import { FiCalendar, FiDownload } from 'react-icons/fi';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ChartCard from '../components/charts/ChartCard';
import { FaYoutube, FaTwitter } from 'react-icons/fa';

const Analytics = ({ accountFilter, ytData = [], twData = [], latestYt = {}, latestTw = {} }) => {
  // Helper to render YouTube analytics
  const renderYouTube = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2"><FaYoutube className="text-red-500" /> YouTube Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="Subscribers">
          <div className="text-2xl font-bold">{latestYt.subscriber_count?.toLocaleString() || 0}</div>
        </Card>
        <Card title="Total Views">
          <div className="text-2xl font-bold">{latestYt.view_count?.toLocaleString() || 0}</div>
        </Card>
        <Card title="Likes">
          <div className="text-2xl font-bold">{latestYt.likes?.toLocaleString() || 0}</div>
        </Card>
      </div>
      {/* Example chart for YouTube */}
      {ytData.length > 0 && (
        <ChartCard
          className="w-full"
          title="Subscribers Over Time"
          data={ytData.map(d => ({ x: d.date, y: d.subscriber_count }))}
          color="#FF0000"
          timeframe="Last 30 days"
        />
      )}
    </div>
  );

  // Helper to render Twitter analytics
  const renderTwitter = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2"><FaTwitter className="text-blue-400" /> Twitter Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="Followers">
          <div className="text-2xl font-bold">{latestTw.followers_count?.toLocaleString() || 0}</div>
        </Card>
        <Card title="Likes">
          <div className="text-2xl font-bold">{latestTw.likes_count?.toLocaleString() || 0}</div>
        </Card>
        <Card title="Views">
          <div className="text-2xl font-bold">{latestTw.views?.toLocaleString() || 0}</div>
        </Card>
      </div>
      {/* Example chart for Twitter */}
      {twData.length > 0 && (
        <ChartCard
          className="w-full"
          title="Followers Over Time"
          data={twData.map(d => ({ x: d.date, y: d.followers_count }))}
          color="#1DA1F2"
          timeframe="Last 30 days"
        />
      )}
    </div>
  );

  // Helper to render combined analytics
  const renderCombined = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Total Followers">
          <div className="text-2xl font-bold">{(latestYt.subscriber_count || 0) + (latestTw.followers_count || 0)}</div>
        </Card>
        <Card title="Total Likes">
          <div className="text-2xl font-bold">{(latestYt.likes || 0) + (latestTw.likes_count || 0)}</div>
        </Card>
        <Card title="Total Views">
          <div className="text-2xl font-bold">{(latestYt.view_count || 0) + (latestTw.views || 0)}</div>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ytData.length > 0 && (
          <ChartCard
            className="w-full"
            title="YouTube Subscribers Over Time"
            data={ytData.map(d => ({ x: d.date, y: d.subscriber_count }))}
            color="#FF0000"
            timeframe="Last 30 days"
          />
        )}
        {twData.length > 0 && (
          <ChartCard
            className="w-full"
            title="Twitter Followers Over Time"
            data={twData.map(d => ({ x: d.date, y: d.followers_count }))}
            color="#1DA1F2"
            timeframe="Last 30 days"
          />
        )}
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 space-y-6">
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
      {/* Render analytics based on filter */}
      {accountFilter === 'All' && renderCombined()}
      {accountFilter === 'YouTube' && renderYouTube()}
      {accountFilter === 'Twitter' && renderTwitter()}
      {/* Add LinkedIn and other platforms as needed */}
    </div>
  );
};

export default Analytics;
