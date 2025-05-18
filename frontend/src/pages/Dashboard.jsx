import { useState, useRef, useContext } from "react";
import { SidebarContext } from "../components/context/SidebarContext";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Analytics from "../components/Analytics";
import Audience from "../components/Audience";
import Settings from "../components/Settings";
import Instagram from "../components/Instagram";
import Facebook from "../components/Facebook";
import Twitter from "../components/Twitter";
import Youtube from "../components/Youtube";
import { mockProfiles, getProfileMetrics, getTimeSeriesData, generateRecommendations } from "../utils/mockData";
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import MetricsGrid from '../components/metrics/MetricsGrid';
import ChartCard from '../components/charts/ChartCard';
import RecommendationCard from '../components/insights/RecommendationCard';
import { FiCalendar, FiRefreshCw, FiDownload } from 'react-icons/fi';

function Dashboard() {
  const [activeComponent, setActiveComponent] = useState("Dashboard");
  const sidebarRef = useRef(null);
  const { isCollapsed } = useContext(SidebarContext);

  // Use the first mock profile as the selected profile
  const selectedProfile = mockProfiles[0];

  // Data fetching using mock utilities
  const metrics = getProfileMetrics(selectedProfile.id);
  const followersData = getTimeSeriesData(selectedProfile.id, 'followers');
  const engagementData = getTimeSeriesData(selectedProfile.id, 'engagement') ||
    getTimeSeriesData(selectedProfile.id, 'likes') ||
    getTimeSeriesData(selectedProfile.id, 'views');
  const recommendations = generateRecommendations(selectedProfile.id);

  const renderComponent = () => {
    switch (activeComponent) {
      case "Analytics":
        return <Analytics selectedProfile={selectedProfile} />;
      case "Audience":
        return <Audience selectedProfile={selectedProfile} />;
      case "Settings":
        return <Settings />;
      case "Instagram":
        return <Instagram />;
      case "Facebook":
        return <Facebook />;
      case "Twitter":
        return <Twitter />;
      case "Youtube":
        return <Youtube />;
      default:
        // Enhanced dashboard view as default
        return (
          <div className="p-4 md:p-6 space-y-6">
            {/* Dashboard Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{selectedProfile.name || selectedProfile.handle} Dashboard</h1>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <FiCalendar className="w-4 h-4 mr-1" />
                  <span>Last updated: {new Date().toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" size="sm" icon={<FiRefreshCw className="w-4 h-4" />}>Refresh Data</Button>
                <Button variant="outline" size="sm" icon={<FiDownload className="w-4 h-4" />}>Export</Button>
              </div>
            </div>

            {/* Metrics Overview */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Overview</h2>
              <MetricsGrid metrics={metrics} />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {followersData && (
                <ChartCard title="Followers Growth" data={followersData} color="#8B5CF6" timeframe="Last 30 days" />
              )}
              {engagementData && (
                <ChartCard title="Engagement Trend" data={engagementData} color="#0D9488" timeframe="Last 30 days" />
              )}
            </div>

            {/* Recommendations */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Insights & Recommendations</h2>
              <RecommendationCard recommendations={recommendations} />
            </div>

            {/* Additional Analytics */}
            <>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Platform-specific Analytics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card title="Top Performing Content">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between"><span className="text-sm font-medium text-gray-700">Post #1</span><span className="text-sm text-gray-500">1.2K likes</span></div>
                    <div className="flex items-center justify-between"><span className="text-sm font-medium text-gray-700">Post #2</span><span className="text-sm text-gray-500">980 likes</span></div>
                    <div className="flex items-center justify-between"><span className="text-sm font-medium text-gray-700">Post #3</span><span className="text-sm text-gray-500">870 likes</span></div>
                  </div>
                </Card>
                <Card title="Audience Demographics">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between"><span className="text-sm font-medium text-gray-700">Age 18-24</span><span className="text-sm text-gray-500">32%</span></div>
                    <div className="flex items-center justify-between"><span className="text-sm font-medium text-gray-700">Age 25-34</span><span className="text-sm text-gray-500">45%</span></div>
                    <div className="flex items-center justify-between"><span className="text-sm font-medium text-gray-700">Age 35-44</span><span className="text-sm text-gray-500">15%</span></div>
                  </div>
                </Card>
                <Card title="Peak Activity Times">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between"><span className="text-sm font-medium text-gray-700">Monday-Friday</span><span className="text-sm text-gray-500">6-8 PM</span></div>
                    <div className="flex items-center justify-between"><span className="text-sm font-medium text-gray-700">Saturday</span><span className="text-sm text-gray-500">12-2 PM</span></div>
                    <div className="flex items-center justify-between"><span className="text-sm font-medium text-gray-700">Sunday</span><span className="text-sm text-gray-500">3-5 PM</span></div>
                  </div>
                </Card>
              </div>
            </>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div ref={sidebarRef} className="h-full">
        <Sidebar setActiveComponent={setActiveComponent} isCollapsed={isCollapsed} />
      </div>
      {/* Main Content */}
      <div className={`flex flex-col flex-1 ml-16 ${isCollapsed ? 'ml-16' : 'ml-72'} transition-all duration-300 ease-in-out`}>
        <Navbar />
        {/* Page Content */}
        <main className="p-6 mt-16">
          <div className="">{renderComponent()}</div>
        </main>
      </div>
    </div >
  );
}

export default Dashboard;