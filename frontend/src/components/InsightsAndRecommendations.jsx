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
        return <FiTrendingUp className="w-7 h-7 text-green-500 bg-green-100 dark:bg-green-900/30 rounded-full p-1.5 shadow" />;
      case 'negative':
        return <FiTrendingDown className="w-7 h-7 text-red-500 bg-red-100 dark:bg-red-900/30 rounded-full p-1.5 shadow" />;
      case 'warning':
        return <FiAlertCircle className="w-7 h-7 text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30 rounded-full p-1.5 shadow" />;
      default:
        return <FiCheckCircle className="w-7 h-7 text-blue-500 bg-blue-100 dark:bg-blue-900/30 rounded-full p-1.5 shadow" />;
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.025, boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }}
      className={`p-7 rounded-2xl border shadow-sm transition-all duration-200 ${
        isDarkMode 
          ? 'bg-gray-800/60 border-gray-700/50' 
          : 'bg-white border-gray-100'
      }`}
    >
      <div className="flex items-start gap-5">
        <div className="flex-shrink-0 flex items-center justify-center">
          {getIcon()}
        </div>
        <div className="flex-1">
          <h3 className={`text-lg font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
          <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>
          {metric && (
            <div className={`text-xl font-bold mb-3 tracking-tight ${
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
            <button className={`text-sm font-semibold rounded px-3 py-1.5 mt-1 shadow-sm ${
              isDarkMode ? 'bg-indigo-700/20 text-indigo-300 hover:bg-indigo-700/40' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
            } transition-colors`}>
              {action}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const RecommendationCard = ({ title, description, priority, icon: Icon }) => {
  const { isDarkMode } = useTheme();
  const getPriorityIcon = () => {
    switch (priority) {
      case 'High':
        return <FiAlertCircle className="w-4 h-4 text-red-500 mr-1" />;
      case 'Medium':
        return <FiClock className="w-4 h-4 text-yellow-500 mr-1" />;
      default:
        return <FiCheckCircle className="w-4 h-4 text-green-500 mr-1" />;
    }
  };
  return (
    <motion.div
      whileHover={{ scale: 1.015, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
      className={`p-5 rounded-xl border shadow-sm transition-all duration-200 ${
        isDarkMode ? 'bg-gray-800/50 border-gray-700/30' : 'bg-white border-gray-100'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
            <span className={`flex items-center text-xs px-2 py-1 rounded font-semibold gap-1 bg-transparent shadow-none
              ${priority === 'High' ? 'text-red-600 dark:text-red-400' :
                priority === 'Medium' ? 'text-yellow-600 dark:text-yellow-400' :
                'text-green-600 dark:text-green-400'}
            `}>
              {getPriorityIcon()}{priority} Priority
            </span>
          </div>
          <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>
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
    <div className="space-y-12">
      {/* Insights Section */}
      <div>
        <h2 className={`text-2xl font-semibold mb-6 tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Key Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
      <div className="border-t border-gray-200 dark:border-gray-700 my-8" />
      {/* Recommendations Section */}
      <div>
        <h2 className={`text-2xl font-semibold mb-6 tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Recommendations
        </h2>
        <Card>
          <div className="space-y-4">
            <RecommendationCard
              title="Optimize Posting Schedule"
              description="Schedule more posts during peak engagement hours (6-8 PM)"
              priority="High"
              icon={FiClock}
            />
            <RecommendationCard
              title="Increase Video Content"
              description="Aim for 50% video content in your content mix"
              priority="Medium"
              icon={FiVideo}
            />
            <RecommendationCard
              title="Engage with Comments"
              description="Respond to comments within 2 hours to boost engagement"
              priority="High"
              icon={FiMessageSquare}
            />
          </div>
        </Card>
        {/* Performance Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
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