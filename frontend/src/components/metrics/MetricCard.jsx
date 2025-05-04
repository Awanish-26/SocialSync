import { FiArrowUpRight, FiArrowDownRight, FiMinus } from 'react-icons/fi';
import Card from '../ui/Card';

function MetricCard({
  title,
  metric,
  icon,
  prefix = '',
  suffix = '',
  className = '',
}) {
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getTrendIcon = () => {
    switch (metric.trend) {
      case 'up':
        return <FiArrowUpRight className="w-4 h-4 text-green-500" />;
      case 'down':
        return <FiArrowDownRight className="w-4 h-4 text-red-500" />;
      case 'neutral':
        return <FiMinus className="w-4 h-4 text-gray-400" />;
      default:
        return null;
    }
  };

  const getTrendColor = () => {
    switch (metric.trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      case 'neutral':
        return 'text-gray-500';
      default:
        return '';
    }
  };

  return (
    <Card className={`transition-all duration-300 hover:shadow-md ${className}`}>
      <div className="flex justify-between">
        <div className="flex items-center space-x-2">
          {icon && <div className="text-gray-400">{icon}</div>}
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        </div>
      </div>

      <div className="mt-2 flex items-center">
        <span className="text-2xl font-semibold text-gray-900">
          {prefix}{formatNumber(metric.value)}{suffix}
        </span>
      </div>

      <div className="mt-2 flex items-center">
        <div className="flex items-center">
          {getTrendIcon()}
          <span className={`text-sm ml-1 ${getTrendColor()}`}>
            {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
          </span>
        </div>
        <span className="ml-2 text-xs text-gray-500">vs previous period</span>
      </div>
    </Card>
  );
}

export default MetricCard;