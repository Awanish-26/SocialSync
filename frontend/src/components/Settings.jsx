import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../utils/apiClient';
import { FiBell, FiLock, FiUser, FiGlobe, FiSettings } from 'react-icons/fi';
import { MdPalette } from 'react-icons/md';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Settings = () => {
  const name = localStorage.getItem("name");
  const [isYouTubeConnected, setIsYouTubeConnected] = useState(false);
  const [isTwitterConnected, setIsTwitterConnected] = useState(false);
  const navigate = useNavigate();
  const tabs = [
    { id: 'profile', name: 'Profile', icon: <FiUser className="w-5 h-5" /> },
    { id: 'notifications', name: 'Notifications', icon: <FiBell className="w-5 h-5" /> },
    { id: 'privacy', name: 'Privacy', icon: <FiLock className="w-5 h-5" /> },
    { id: 'appearance', name: 'Appearance', icon: <MdPalette className="w-5 h-5" /> },
    { id: 'integrations', name: 'Integrations', icon: <FiGlobe className="w-5 h-5" /> },
  ];
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const currentUser = name || "";

  const handleTabClick = (tabId) => {
    setActiveTab(tabId); // Update the active tab
  };

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await apiClient.get("/youtube/status/");
        setIsYouTubeConnected(res.data.connected);
      } catch (err) {
        console.error("Error fetching YouTube status:", err);
      }
      try {
        const res = await apiClient.get("/twitter/status/");
        setIsTwitterConnected(res.data.connected);
      } catch (err) {
        console.error("Error fetching Twitter status:", err);
      }
    };
    fetchStatus();
  }, []);


  const handleLogout = () => {
    localStorage.clear(); // Clear all local storage items
    navigate('/');
  };

  const handleDisconnectYouTube = async () => {
    try {
      await apiClient.post("/youtube/disconnect/");
      alert("YouTube account disconnected successfully.");
      setIsYouTubeConnected(false); // Update state after disconnection
    } catch (err) {
      console.error("Error disconnecting YouTube:", err);
      alert("Failed to disconnect YouTube.");
    }
  };

  const handleDisconnectTwitter = async () => {
    try {
      await apiClient.delete("/twitter/disconnect/");
      alert("Twitter account disconnected successfully.");
      setIsTwitterConnected(false); // Update state after disconnection
    } catch (err) {
      console.error("Error disconnecting Twitter:", err);
      alert("Failed to disconnect Twitter.");
    }
  };

  return (
    <div className="settings-page" id="settings-page">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="user-info mb-4">
        <p className="text-lg">Welcome, {name}!</p>
      </div>

      {/* Tabs */}
      <div className="tabs flex space-x-4 border-b mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`px-4 py-2 text-sm font-medium ${activeTab === tab.id
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-500 hover:text-blue-500'
              }`}
          >
            <div className="flex items-center space-x-2">
              {tab.icon}
              <span>{tab.name}</span>
            </div>
          </button>
        ))}
      </div>
      <div className="flex-1 max-w-3xl">
        {activeTab === 'profile' && (
          <Card title="Profile Settings">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
                <div className="mt-2 flex items-center space-x-4">
                  <img
                    src="https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150"
                    alt="Profile"
                    className="h-16 w-16 rounded-full object-cover"
                  />
                  <Button variant="outline" size="sm">Change Photo</Button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  defaultValue={currentUser.name}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  defaultValue={currentUser.email}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <textarea
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Write a few sentences about yourself"
                ></textarea>
              </div>
              <div className="flex justify-end">
                <Button variant="primary">Save Changes</Button>
              </div>
            </div>
          </Card>
        )}
        {activeTab === 'notifications' && (
          <Card title="Notification Preferences">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-gray-500">Receive email updates about your account</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Push Notifications</h4>
                  <p className="text-sm text-gray-500">Receive push notifications in your browser</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">SMS Notifications</h4>
                  <p className="text-sm text-gray-500">Receive text messages for important updates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </Card>
        )}
        {activeTab === 'privacy' && (
          <Card title="Privacy Settings">
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">Profile Visibility</h4>
                <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                  <option>Public</option>
                  <option>Private</option>
                  <option>Friends Only</option>
                </select>
              </div>
              <div>
                <h4 className="font-medium mb-2">Data Sharing</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">Share analytics with partners</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">Allow third-party integrations</span>
                  </label>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Account Protection</h4>
                <Button variant="outline" size="sm">Enable Two-Factor Authentication</Button>
              </div>
            </div>
          </Card>
        )}
        {activeTab === 'appearance' && (
          <Card title="Appearance Settings">
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">Theme</h4>
                <div className="grid grid-cols-3 gap-4">
                  <button className="p-4 border rounded-lg text-center hover:border-blue-500">
                    <div className="h-20 bg-white border rounded mb-2"></div>
                    <span className="text-sm">Light</span>
                  </button>
                  <button className="p-4 border rounded-lg text-center hover:border-blue-500">
                    <div className="h-20 bg-gray-900 border rounded mb-2"></div>
                    <span className="text-sm">Dark</span>
                  </button>
                  <button className="p-4 border rounded-lg text-center hover:border-blue-500">
                    <div className="h-20 bg-gradient-to-b from-white to-gray-900 border rounded mb-2"></div>
                    <span className="text-sm">System</span>
                  </button>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Color Scheme</h4>
                <div className="grid grid-cols-6 gap-2">
                  {['#3B82F6', '#10B981', '#8B5CF6', '#EF4444', '#F59E0B', '#6B7280'].map((color) => (
                    <button
                      key={color}
                      className="w-8 h-8 rounded-full border-2 border-white ring-2 ring-transparent hover:ring-gray-300"
                      style={{ backgroundColor: color }}
                    ></button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Font Size</h4>
                <input
                  type="range"
                  min="12"
                  max="20"
                  defaultValue="16"
                  className="w-full"
                />
              </div>
            </div>
          </Card>
        )}
        {activeTab === 'integrations' && (
          <Card title="Platform Integrations">
            <div className="Social-Media-Integration flex-1 max-w-3xl">
              <div className="mt-4 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200">
                {[
                  { name: 'Instagram', connected: false },
                  { name: 'Twitter', connected: isTwitterConnected },
                  { name: 'Facebook', connected: false },
                  { name: 'YouTube', connected: isYouTubeConnected },
                ].map((account) => (
                  <div key={account.name} className="flex items-center justify-between p-4 bg-gray-50">
                    <div className="flex items-center">
                      <div className="ml-3">
                        <h4 className="font-medium">{account.name}</h4>
                        <p className="text-sm text-gray-500">
                          {account.connected ? 'Connected' : 'Not connected'}
                        </p>
                      </div>
                    </div>
                    {account.name === 'YouTube' && account.connected ? (
                      <button
                        onClick={() => handleDisconnectYouTube()}
                        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                      >
                        Disconnect
                      </button>
                    ) : account.name === 'Twitter' && account.connected ? (
                      <button
                        onClick={() => handleDisconnectTwitter()}
                        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                      >
                        Disconnect
                      </button>
                    ) : (
                      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Connect
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className="logout-button my-4 ">
                <p className="text-xl font-bold mt-8">Logout from the account</p>
                <p className="text-sm text-gray-500 mb-2">You will be logged out from all devices</p>
                <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                  Logout
                </button>
              </div>
            </div>
          </Card>
        )}
      </div>

    </div>
  );
};

export default Settings;