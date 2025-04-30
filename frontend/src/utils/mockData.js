// Mock Profiles
export const mockProfiles = [
  {
    id: '1',
    platform: 'instagram',
    handle: 'designinfluencer',
    avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150',
    name: 'Design Influencer',
    url: 'https://instagram.com/designinfluencer'
  },
  {
    id: '2',
    platform: 'youtube',
    handle: 'techcreator',
    avatar: 'https://images.pexels.com/photos/1933873/pexels-photo-1933873.jpeg?auto=compress&cs=tinysrgb&w=150',
    name: 'Tech Creator',
    url: 'https://youtube.com/techcreator'
  },
  {
    id: '3',
    platform: 'twitter',
    handle: 'marketingpro',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    name: 'Marketing Pro',
    url: 'https://twitter.com/marketingpro'
  }
];

// Mock Metrics
export const mockMetrics = [
  {
    profileId: '1',
    followers: { value: 25000, change: 5.2, trend: 'up' },
    engagement: { value: 1250, change: 3.8, trend: 'up' },
    reach: { value: 45000, change: 2.1, trend: 'up' },
    impressions: { value: 80000, change: -1.2, trend: 'down' },
    timeframe: 'last-7-days'
  },
  {
    profileId: '2',
    followers: { value: 75000, change: 2.7, trend: 'up' },
    engagement: { value: 4500, change: -0.5, trend: 'down' },
    reach: { value: 120000, change: 4.3, trend: 'up' },
    impressions: { value: 200000, change: 3.1, trend: 'up' },
    timeframe: 'last-7-days'
  },
  {
    profileId: '3',
    followers: { value: 12000, change: 1.5, trend: 'up' },
    engagement: { value: 800, change: 6.2, trend: 'up' },
    reach: { value: 22000, change: 0.3, trend: 'neutral' },
    impressions: { value: 35000, change: -2.1, trend: 'down' },
    timeframe: 'last-7-days'
  }
];

// Generate time series data for the last 30 days
const generateTimeSeriesData = (startValue, volatility) => {
  const result = [];
  let currentValue = startValue;
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    const change = (Math.random() * 2 - 1) * volatility * currentValue;
    currentValue = Math.max(0, currentValue + change);
    result.push({
      date: dateString,
      value: Math.round(currentValue)
    });
  }
  return result;
};

// Mock Time Series Data
export const mockTimeSeriesData = [
  {
    id: '1',
    profileId: '1',
    metricName: 'followers',
    data: generateTimeSeriesData(24000, 0.01)
  },
  {
    id: '2',
    profileId: '1',
    metricName: 'engagement',
    data: generateTimeSeriesData(1200, 0.03)
  },
  {
    id: '7',
    profileId: '1',
    metricName: 'reach',
    data: generateTimeSeriesData(45000, 0.02)
  },
  {
    id: '8',
    profileId: '1',
    metricName: 'impressions',
    data: generateTimeSeriesData(80000, 0.025)
  },
  {
    id: '3',
    profileId: '2',
    metricName: 'followers',
    data: generateTimeSeriesData(73000, 0.005)
  },
  {
    id: '4',
    profileId: '2',
    metricName: 'views',
    data: generateTimeSeriesData(115000, 0.02)
  },
  {
    id: '9',
    profileId: '2',
    metricName: 'reach',
    data: generateTimeSeriesData(120000, 0.015)
  },
  {
    id: '10',
    profileId: '2',
    metricName: 'impressions',
    data: generateTimeSeriesData(200000, 0.02)
  },
  {
    id: '5',
    profileId: '3',
    metricName: 'followers',
    data: generateTimeSeriesData(11800, 0.008)
  },
  {
    id: '6',
    profileId: '3',
    metricName: 'likes',
    data: generateTimeSeriesData(750, 0.04)
  },
  {
    id: '11',
    profileId: '3',
    metricName: 'engagement',
    data: generateTimeSeriesData(800, 0.025)
  },
  {
    id: '12',
    profileId: '3',
    metricName: 'reach',
    data: generateTimeSeriesData(22000, 0.01)
  },
  {
    id: '13',
    profileId: '3',
    metricName: 'impressions',
    data: generateTimeSeriesData(35000, 0.018)
  }
];

// Mock User
export const mockUser = {
  id: '1',
  name: 'Jane Cooper',
  email: 'jane@example.com',
  profiles: mockProfiles,
  dashboardConfig: [
    {
      id: '1',
      title: 'Followers Growth',
      type: 'chart',
      size: 'large',
      config: {
        type: 'line',
        dataKey: 'followers',
        profileIds: ['1', '2', '3']
      }
    },
    {
      id: '2',
      title: 'Engagement Overview',
      type: 'metric',
      size: 'medium',
      config: {
        metricKeys: ['engagement', 'reach', 'impressions'],
        profileId: '1'
      }
    },
    {
      id: '3',
      title: 'Platform Comparison',
      type: 'chart',
      size: 'medium',
      config: {
        type: 'bar',
        dataKey: 'engagement',
        profileIds: ['1', '2', '3']
      }
    }
  ]
};

// Get profile metrics by ID
export const getProfileMetrics = (profileId) => {
  return mockMetrics.find(metric => metric.profileId === profileId);
};

// Get time series data by profile ID and metric name
export const getTimeSeriesData = (profileId, metricName) => {
  const found = mockTimeSeriesData.find(
    series => series.profileId === profileId && series.metricName === metricName
  );
  return found?.data;
};

// Generate recommendations based on profile metrics
export const generateRecommendations = (profileId) => {
  const metrics = getProfileMetrics(profileId);
  const recommendations = [];
  if (!metrics) return recommendations;
  if (metrics.engagement.trend === 'down') {
    recommendations.push('Your engagement rate is falling. Consider posting more interactive content to boost engagement.');
  }
  if (metrics.followers.trend === 'up' && metrics.followers.change > 5) {
    recommendations.push('Your followers are growing rapidly! Capitalize on this growth by maintaining consistent posting schedule.');
  }
  if (metrics.impressions.trend === 'down') {
    recommendations.push('Your content reach is decreasing. Try posting at different times or using more relevant hashtags.');
  }
  if (recommendations.length === 0) {
    recommendations.push('Your profiles are performing well. Keep up the good work!');
  }
  return recommendations;
};

// Dummy audience data for demonstration
export const dummyAudience = {
  ageDistribution: [
    { range: '18-24', percent: 35 },
    { range: '25-34', percent: 45 },
    { range: '35-44', percent: 15 },
    { range: '45+', percent: 5 },
  ],
  topLocations: [
    { country: 'United States', percent: 45, img: 'https://images.pexels.com/photos/4386429/pexels-photo-4386429.jpeg?auto=compress&cs=tinysrgb&w=50' },
    { country: 'United Kingdom', percent: 25, img: 'https://images.pexels.com/photos/1427541/pexels-photo-1427541.jpeg?auto=compress&cs=tinysrgb&w=50' },
    { country: 'Canada', percent: 15, img: 'https://images.pexels.com/photos/356844/pexels-photo-356844.jpeg?auto=compress&cs=tinysrgb&w=50' },
    { country: 'Australia', percent: 10, img: 'https://images.pexels.com/photos/67566/palm-tree-palm-ocean-summer-67566.jpeg?auto=compress&cs=tinysrgb&w=50' },
  ],
  activeTimes: {
    mostActiveDay: 'Wednesday',
    peakHours: '6PM - 9PM',
    avgSession: '12 minutes',
    returnRate: '65%'
  },
  interests: [
    { name: 'Technology', affinity: 85 },
    { name: 'Travel', affinity: 75 },
    { name: 'Food & Dining', affinity: 70 },
    { name: 'Fashion', affinity: 65 },
  ],
  engagementPatterns: {
    commentsPerPost: 24.5,
    sharesPerPost: 12.3,
    saveRate: 8.7
  }
};