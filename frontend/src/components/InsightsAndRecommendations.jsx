import { FiTrendingUp, FiTrendingDown, FiAlertCircle, FiCheckCircle, FiClock, FiVideo, FiMessageSquare } from 'react-icons/fi';
import Card from './ui/Card';
import ChartCard from './charts/ChartCard';
import LineChart from './charts/LineChart';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './context/ThemeContext';

const InsightCard = ({ type, title, description, metric, action, chart }) => {
  const { isDarkMode } = useTheme();
  
  const getIcon = () => {
    switch (type) {
      case 'positive':
        return <FiTrendingUp className="w-6 h-6 text-green-500" />;
      case 'negative':
        return <FiTrendingDown className="w-6 h-6 text-red-500" />;
      case 'warning':
        return <FiAlertCircle className="w-6 h-6 text-yellow-500" />;
      default:
        return <FiCheckCircle className="w-6 h-6 text-blue-500" />;
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`p-6 rounded-xl border ${
        isDarkMode 
          ? 'bg-gray-800/50 border-gray-700/50' 
          : 'bg-white border-gray-200'
      } transition-colors duration-200`}
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg ${
          isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'
        }`}>
          {getIcon()}
        </div>
        <div className="flex-1">
          <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {title}
          </h3>
          <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {description}
          </p>
          {metric && (
            <div className={`text-lg font-semibold mb-3 ${
              type === 'positive' ? 'text-green-500' :
              type === 'negative' ? 'text-red-500' :
              type === 'warning' ? 'text-yellow-500' :
              'text-blue-500'
            }`}>
              {metric}
            </div>
          )}
          {chart && (
            <div className="mb-3 h-24">
              <LineChart 
                data={chart} 
                color={
                  type === 'positive' ? '#10B981' :
                  type === 'negative' ? '#EF4444' :
                  type === 'warning' ? '#F59E0B' :
                  '#3B82F6'
                }
                height={96}
                showAxis={false}
              />
            </div>
          )}
          {action && (
            <button className={`text-sm font-medium ${
              isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'
            } transition-colors`}>
              {action}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const RecommendationCard = ({ title, description, priority, icon: Icon, progress }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`p-4 rounded-lg ${
        isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`p-2 rounded-lg ${
          isDarkMode ? 'bg-gray-700/30' : 'bg-white'
        }`}>
          <Icon className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {title}
            </h3>
            <span className={`text-sm px-2 py-1 rounded ${
              priority === 'High'
                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
            }`}>
              {priority} Priority
            </span>
          </div>
          <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {description}
          </p>
          {progress && (
            <div className="mt-2">
              <div className="flex justify-between text-sm mb-1">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Progress</span>
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{progress}%</span>
              </div>
              <div className="h-1.5 bg-gray-200 rounded-full dark:bg-gray-700 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`h-full rounded-full ${
                    progress >= 80 ? 'bg-green-500' :
                    progress >= 50 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

function InsightsAndRecommendations({ data }) {
  const { isDarkMode } = useTheme();

  // Process data for charts
  const getChartData = (platform, key, count = 7) => {
    const platformData = platform === 'youtube' ? data.ytData : data.twData;
    return platformData.slice(-count).map(item => ({
      date: new Date(item.timestamp || item.last_updated).toISOString(),
      value: item[key] || 0
    }));
  };
  
  return (
    <div className="space-y-8">
      {/* Insights Section */}
      <div>
        <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Key Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InsightCard
            type="positive"
            title="Peak Engagement Hours"
            description="Your posts between 6-8 PM receive significantly higher engagement"
            metric="+150% engagement"
            action="View detailed analysis →"
            chart={getChartData('twitter', 'likes_count')}
          />
          <InsightCard
            type="warning"
            title="Content Mix Analysis"
            description="Video content shows higher engagement but makes up only 20% of posts"
            metric="80% text vs 20% video"
            action="Create content strategy →"
            chart={getChartData('youtube', 'view_count')}
          />
        </div>
      </div>

      {/* Recommendations Section */}
      <div>
        <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Recommendations
        </h2>
        <Card>
          <div className="space-y-4">
            <RecommendationCard
              title="Optimize Posting Schedule"
              description="Schedule more posts during peak engagement hours (6-8 PM)"
              priority="High"
              icon={FiClock}
              progress={65}
            />
            <RecommendationCard
              title="Increase Video Content"
              description="Aim for 50% video content in your content mix"
              priority="Medium"
              icon={FiVideo}
              progress={20}
            />
            <RecommendationCard
              title="Engage with Comments"
              description="Respond to comments within 2 hours to boost engagement"
              priority="High"
              icon={FiMessageSquare}
              progress={85}
            />
          </div>
        </Card>

        {/* Performance Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <ChartCard
            title="Engagement by Time of Day"
            data={getChartData('twitter', 'likes_count')}
            color="#8B5CF6"
            timeframe="Last 7 days"
            height={200}
          />
          <ChartCard
            title="Content Type Performance"
            data={getChartData('youtube', 'view_count')}
            color="#EC4899"
            timeframe="Last 7 days"
            height={200}
          />
        </div>
      </div>
    </div>
  );
}

export default InsightsAndRecommendations;