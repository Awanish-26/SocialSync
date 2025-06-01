import { FiCalendar, FiDownload } from 'react-icons/fi';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ChartCard from '../components/charts/ChartCard';

const Analytics = ({ selectedProfile }) => {
  if (!selectedProfile || !selectedProfile.id) {
    return (
      <div className="p-4 text-red-600 font-semibold">
        No profile selected. Please select a profile to view analytics.
      </div>
    );
  }

  const reachData = getTimeSeriesData(selectedProfile.id, 'reach');
  const impressionsData = getTimeSeriesData(selectedProfile.id, 'impressions');
  const engagementData = getTimeSeriesData(selectedProfile.id, 'engagement');

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {reachData && (
          <ChartCard
            className="w-full"
            title="Reach Analysis"
            data={reachData}
            color="#3B82F6"
            timeframe="Last 30 days"
          />
        )}
        {impressionsData && (
          <ChartCard
            className="w-full"
            title="Impressions Growth"
            data={impressionsData}
            color="#10B981"
            timeframe="Last 30 days"
          />
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {engagementData && (
          <ChartCard
            className="w-full"
            title="Engagement Rate"
            data={engagementData}
            color="#8B5CF6"
            timeframe="Last 30 days"
            height={300}
          />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Content Performance">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Top Post</p>
                <p className="text-sm text-gray-500">Posted on March 15</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-blue-600">2.5K likes</p>
                <p className="text-sm text-gray-500">500 shares</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Best Time</p>
                <p className="text-sm text-gray-500">Based on engagement</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-blue-600">6:00 PM - 8:00 PM</p>
                <p className="text-sm text-gray-500">Weekdays</p>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Engagement Breakdown">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Likes</span>
              <div className="flex-1 mx-4">
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-blue-500 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <span className="font-medium">75%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Comments</span>
              <div className="flex-1 mx-4">
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-green-500 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              <span className="font-medium">45%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Shares</span>
              <div className="flex-1 mx-4">
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-purple-500 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
              <span className="font-medium">30%</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
