import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ConnectInstagramCard from "../components/cards/ConnectInstagramCard";
import ConnectFacebookCard from "../components/cards/ConnectFacebookCard";
import ConnectTwitterCard from "../components/cards/ConnectTwitterCard";

function Dashboard() {
  const handleConnectInstagram = () => {
    console.log("User wants to connect Instagram");
  };

  const handleConnectFacebook = () => {
    console.log("User wants to connect Facebook");
  };

  const handleConnectTwitter = () => {
    console.log("User wants to connect X (Twitter)");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Topbar */}
        <Topbar />

        {/* Page Content */}
        <main className="p-6">
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ConnectInstagramCard onConnect={handleConnectInstagram} />
            <ConnectFacebookCard onConnect={handleConnectFacebook} />
            <ConnectTwitterCard onConnect={handleConnectTwitter} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
