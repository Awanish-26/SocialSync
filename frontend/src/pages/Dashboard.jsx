import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Analytics from "../components/Analytics";
import Audience from "../components/Audience";
import Settings from "../components/Settings";
import Instagram from "../components/Instagram";
import Facebook from "../components/Facebook";
import Twitter from "../components/Twitter";

function Dashboard() {
  const [activeComponent, setActiveComponent] = useState("Dashboard");

  const renderComponent = () => {
    switch (activeComponent) {
      case "Analytics":
        return <Analytics />;
      case "Audience":
        return <Audience />;
      case "Settings":
        return <Settings />;
      case "Instagram":
        return <Instagram />;
      case "Facebook":
        return <Facebook />;
      case "Twitter":
        return <Twitter />;
      default:
        return <h1>Welcome to the Dashboard</h1>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar setActiveComponent={setActiveComponent} />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        <Topbar />

        {/* Page Content */}
        <main className="p-6">
          <div className="">{renderComponent()}</div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;