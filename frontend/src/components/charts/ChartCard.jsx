import { FaRegCalendarAlt } from 'react-icons/fa';
import Card from '../ui/Card';
import LineChart from './LineChart';

const ChartCard = ({
  title,
  data,
  color = '#3B82F6',
  timeframe = 'Last 30 days',
  height = 200,
  className = '',
}) => {
  const getLatestValue = () => {
    if (data && data.length > 0) {
      return data[data.length - 1].value;
    }
    return 0;
  };

  const getGrowthPercentage = () => {
    if (data && data.length > 1) {
      const firstValue = data[0].value;
      const lastValue = data[data.length - 1].value;
      if (firstValue === 0) return 0;
      return ((lastValue - firstValue) / firstValue) * 100;
    }
    return 0;
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const growthPercentage = getGrowthPercentage();
  const isPositiveGrowth = growthPercentage >= 0;

  return (
    <Card className={className}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <div className="flex items-center mt-1 text-sm text-gray-500">
            <FaRegCalendarAlt className="w-4 h-4 mr-1" />
            <span>{timeframe}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-semibold text-gray-900">
            {formatNumber(getLatestValue())}
          </div>
          <div className={`text-sm ${isPositiveGrowth ? 'text-green-600' : 'text-red-600'}`}>
            {isPositiveGrowth ? '↑' : '↓'} {Math.abs(growthPercentage).toFixed(1)}%
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <LineChart 
          data={data} 
          color={color} 
          height={height} 
          showAxis={true}
          animated={true}
        />
      </div>
    </Card>
  );
};

export default ChartCard;