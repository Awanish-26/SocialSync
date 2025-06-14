import { FiUsers, FiMapPin, FiCalendar } from 'react-icons/fi';
import Card from '../components/ui/Card';
import { useTheme } from './context/ThemeContext';

const Audience = () => {
  const { isDarkMode } = useTheme();
  const audience = {
    ageDistribution: [
      { range: '18-24', percent: 25 },
      { range: '25-34', percent: 35 },
      { range: '35-44', percent: 20 },
      { range: '45-54', percent: 15 },
      { range: '55+', percent: 5 },
    ],
    topLocations: [
      { country: 'Delhi', percent: 30, img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=64&h=64' },
      { country: 'Mumbai', percent: 25, img: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=facearea&w=64&h=64' },
      { country: 'Bangalore', percent: 20, img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=64&h=64' },
      { country: 'Hyderabad', percent: 15, img: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=facearea&w=64&h=64' },
      { country: 'Others', percent: 10, img: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=64&h=64' },
    ],
    activeTimes: {
      mostActiveDay: 'Wednesday',
      peakHours: '2 PM - 4 PM',
      avgSession: '5 minutes',
      returnRate: '30%',
    },
    interests: [
      { name: 'Technology', affinity: 70 },
      { name: 'Sports', affinity: 50 },
      { name: 'Music', affinity: 60 },
      { name: 'Travel', affinity: 40 },
      { name: 'Food', affinity: 55 },
    ],
    engagementPatterns: {
      commentsPerPost: 10,
      sharesPerPost: 5,
      saveRate: 25,
    },
  };

  return (
    <div className={`p-4 md:p-6 space-y-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex items-center gap-2 mb-4">
        <FiUsers className={`w-5 h-5 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`} />
        <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Audience Insights</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Age Distribution */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Age Distribution</h3>
            <FiUsers className={`h-5 w-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          </div>
          <div className="space-y-4">
            {audience.ageDistribution.map((group, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm">
                  <span className={isDarkMode ? 'text-gray-300' : ''}>{group.range}</span>
                  <span className={`font-medium ${isDarkMode ? 'text-blue-300' : ''}`}>{group.percent}%</span>
                </div>
                <div className={`mt-1 h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full`}>
                  <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${group.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        {/* Top Locations */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Top Locations</h3>
            <FiMapPin className={`h-5 w-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          </div>
          <div className="space-y-4">
            {audience.topLocations.map((loc, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <div className="flex items-center">
                  <img src={loc.img} className="w-6 h-6 rounded-full object-cover" />
                  <span className={`ml-2 ${isDarkMode ? 'text-gray-200' : ''}`}>{loc.country}</span>
                </div>
                <span className={`font-medium ${isDarkMode ? 'text-blue-300' : ''}`}>{loc.percent}%</span>
              </div>
            ))}
          </div>
        </Card>
        {/* Active Times */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Active Times</h3>
            <FiCalendar className={`h-5 w-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          </div>
          <div className="space-y-4">
            <div className={`flex justify-between items-center p-2 rounded ${isDarkMode ? 'bg-blue-900' : 'bg-blue-50'}`}>
              <span className={isDarkMode ? 'text-gray-200' : ''}>Most Active Day</span>
              <span className={`font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>{audience.activeTimes.mostActiveDay}</span>
            </div>
            <div className={`flex justify-between items-center p-2 rounded ${isDarkMode ? 'bg-green-900' : 'bg-green-50'}`}>
              <span className={isDarkMode ? 'text-gray-200' : ''}>Peak Hours</span>
              <span className={`font-medium ${isDarkMode ? 'text-green-300' : 'text-green-600'}`}>{audience.activeTimes.peakHours}</span>
            </div>
            <div className={`flex justify-between items-center p-2 rounded ${isDarkMode ? 'bg-purple-900' : 'bg-purple-50'}`}>
              <span className={isDarkMode ? 'text-gray-200' : ''}>Avg. Session</span>
              <span className={`font-medium ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`}>{audience.activeTimes.avgSession}</span>
            </div>
            <div className={`flex justify-between items-center p-2 rounded ${isDarkMode ? 'bg-orange-900' : 'bg-orange-50'}`}>
              <span className={isDarkMode ? 'text-gray-200' : ''}>Return Rate</span>
              <span className={`font-medium ${isDarkMode ? 'text-orange-300' : 'text-orange-600'}`}>{audience.activeTimes.returnRate}</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Interests */}
        <Card title="Interests">
          <div className="grid grid-cols-2 gap-4">
            {audience.interests.map((interest, idx) => (
              <div key={idx} className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{interest.name}</div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{interest.affinity}% affinity</div>
              </div>
            ))}
          </div>
        </Card>
        {/* Engagement Patterns */}
        <Card title="Engagement Patterns">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className={`font-medium ${isDarkMode ? 'text-white' : ''}`}>Comments per Post</div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Average engagement</div>
              </div>
              <div className={`text-2xl font-semibold ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>{audience.engagementPatterns.commentsPerPost}</div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className={`font-medium ${isDarkMode ? 'text-white' : ''}`}>Shares per Post</div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Viral coefficient</div>
              </div>
              <div className={`text-2xl font-semibold ${isDarkMode ? 'text-green-300' : 'text-green-600'}`}>{audience.engagementPatterns.sharesPerPost}</div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className={`font-medium ${isDarkMode ? 'text-white' : ''}`}>Save Rate</div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Content relevance</div>
              </div>
              <div className={`text-2xl font-semibold ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`}>{audience.engagementPatterns.saveRate}%</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Audience;
