import React from 'react';
import { FiUsers, FiHeart, FiEye, FiTrendingUp } from 'react-icons/fi';
import MetricCard from './MetricCard';

function MetricsGrid({ metrics }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Followers"
        metric={metrics.followers}
        icon={<FiUsers className="w-5 h-5" />}
      />
      <MetricCard
        title="Engagement"
        metric={metrics.engagement}
        icon={<FiHeart className="w-5 h-5" />}
      />
      <MetricCard
        title="Reach"
        metric={metrics.reach}
        icon={<FiEye className="w-5 h-5" />}
      />
      <MetricCard
        title="Impressions"
        metric={metrics.impressions}
        icon={<FiTrendingUp className="w-5 h-5" />}
      />
    </div>
  );
}

export default MetricsGrid;