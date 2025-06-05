import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../utils/apiClient';
import { FiBell, FiLock, FiUser, FiGlobe } from 'react-icons/fi';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useTheme } from './context/ThemeContext';

const Settings = () => {
  const name = localStorage.getItem("name");
  const [isYouTubeConnected, setIsYouTubeConnected] = useState(false);
  const [isTwitterConnected, setIsTwitterConnected] = useState(false);
  const [user, setUser] = useState({ name: '', email: '' });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [integrationStatus, setIntegrationStatus] = useState({ youtube: false, twitter: false, instagram: false });
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const tabs = [
    { id: 'profile', name: 'Profile', icon: <FiUser className="w-5 h-5" /> },
    { id: 'notifications', name: 'Notifications', icon: <FiBell className="w-5 h-5" /> },
    { id: 'privacy', name: 'Privacy', icon: <FiLock className="w-5 h-5" /> },
    { id: 'integrations', name: 'Integrations', icon: <FiGlobe className="w-5 h-5" /> },
  ];
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const currentUser = name || "";

  const handleTabClick = (tabId) => {
    setActiveTab(tabId); // Update the active tab
  };

  const fetchStatus = async () => {
    try {
      const res = await apiClient.get("/api/account_status/");
      setIntegrationStatus(res.data);
    } catch (err) {
      console.error("Error fetching integration status:", err);
    }
  };

  useEffect(() => {
    fetchStatus();
    // Fetch user details
    const fetchUser = async () => {
      try {
        const res = await apiClient.get('/user/profile/');
        setUser({ name: res.data.name, email: res.data.email });
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    };
    fetchUser();
  }, []);


  const handleLogout = () => {
    localStorage.clear(); // Clear all local storage items
    navigate('/');
  };

  const handleDisconnectYouTube = async () => {
    try {
      await apiClient.post("/youtube/disconnect/");
      alert("YouTube account disconnected successfully.");
      setIsYouTubeConnected(false);
      fetchStatus();
      setTimeout(() => {
        if (!integrationStatus.twitter && !integrationStatus.instagram && !integrationStatus.youtube) {
          window.dispatchEvent(new Event('accountsChanged'));
        }
      }, 500);
    } catch (err) {
      console.error("Error disconnecting YouTube:", err);
      alert("Failed to disconnect YouTube.");
    }
  };

  const handleDisconnectTwitter = async () => {
    try {
      await apiClient.delete("/twitter/disconnect/");
      alert("Twitter account disconnected successfully.");
      setIsTwitterConnected(false);
      fetchStatus();
      setTimeout(() => {
        if (!integrationStatus.youtube && !integrationStatus.instagram && !integrationStatus.twitter) {
          window.dispatchEvent(new Event('accountsChanged'));
        }
      }, 500);
    } catch (err) {
      console.error("Error disconnecting Twitter:", err);
      alert("Failed to disconnect Twitter.");
    }
  };

  // For editable fields, use value and onChange
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  // Save changes to backend
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg("");
    try {
      await apiClient.put('/user/profile/', { name: user.name, email: user.email });
      setSaveMsg("Profile updated successfully.");
      localStorage.setItem("name", user.name);
    } catch (err) {
      setSaveMsg("Failed to update profile.");
      console.error('Error updating user profile:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`settings-page rounded-2xl shadow-lg p-6 md:p-10 mt-6 mb-8 mx-auto max-w-4xl min-h-[80vh] ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <h1 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Settings</h1>
      <div className="user-info mb-6">
        <p className={`text-lg ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Welcome, {user.name || name}!</p>
        {user.email && (
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</p>
        )}
      </div>

      {/* Tabs */}
      <div className={`tabs flex space-x-4 border-b mb-6 pb-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors duration-150 rounded-t-lg focus:outline-none ${activeTab === tab.id
              ? (isDarkMode ? 'border-b-2 border-blue-400 text-blue-300 bg-gray-800' : 'border-b-2 border-blue-500 text-blue-600 bg-blue-50')
              : (isDarkMode ? 'text-gray-400 hover:text-blue-300 hover:bg-gray-800' : 'text-gray-500 hover:text-blue-500 hover:bg-gray-100')
              }`}
          >
            <div className="flex items-center space-x-2">
              {tab.icon}
              <span>{tab.name}</span>
            </div>
          </button>
        ))}
      </div>
      <div className="flex-1 max-w-3xl mx-auto">
        {activeTab === 'profile' && (
          <Card title="Profile Settings">
            <form className="space-y-6" onSubmit={handleSave}>
              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Profile Picture</label>
                <div className="mt-2 flex items-center space-x-4">
                  <div className={`h-16 w-16 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                    <FiUser className={`h-10 w-10 ${isDarkMode ? 'text-blue-300' : 'text-blue-500'}`} />
                  </div>
                  <Button variant="outline" size="sm">Change Photo</Button>
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Name</label>
                <input
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md shadow-sm px-4 py-2 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'border-gray-300'} focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md shadow-sm px-4 py-2 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'border-gray-300'} focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Bio</label>
                <textarea
                  rows={4}
                  className={`mt-1 block w-full rounded-md p-2 shadow-sm ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'border-gray-300'} focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                  placeholder="Write a few sentences about yourself"
                  disabled
                ></textarea>
              </div>
              <div className="flex justify-end items-center gap-4">
                {saveMsg && <span className={`text-sm ${saveMsg.includes('success') ? 'text-green-500' : 'text-red-500'}`}>{saveMsg}</span>}
                <Button variant="primary" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
              </div>
            </form>
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
        {activeTab === 'integrations' && (
          <Card title="Platform Integrations">
            <div className="Social-Media-Integration flex-1 max-w-3xl">
              <div className="mt-4 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200">
                {[
                  { name: 'Instagram', connected: integrationStatus.instagram },
                  { name: 'Twitter', connected: integrationStatus.twitter },
                  { name: 'Facebook', connected: false },
                  { name: 'YouTube', connected: integrationStatus.youtube },
                ].map((account) => (
                  <div key={account.name} className={`flex items-center justify-between p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <div className="flex items-center">
                      <div className="ml-3">
                        <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{account.name}</h4>
                        <p className={`text-sm ${isDarkMode ? (account.connected ? 'text-green-400' : 'text-gray-400') : (account.connected ? 'text-green-600' : 'text-gray-500')}`}>
                          {account.connected ? 'Connected' : 'Not connected'}
                        </p>
                      </div>
                    </div>
                    {account.name === 'YouTube' && account.connected ? (
                      <Button
                        variant="danger"
                        onClick={() => handleDisconnectYouTube()}
                      >
                        Disconnect
                      </Button>
                    ) : account.name === 'Twitter' && account.connected ? (
                      <Button
                        variant="danger"
                        onClick={() => handleDisconnectTwitter()}
                      >
                        Disconnect
                      </Button>
                    ) : (
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={() => {
                          if (account.name === 'YouTube') {
                            window.location.href = 'http://localhost:8000/youtube/initiate/';
                          } else if (account.name === 'Twitter') {
                            window.location.href = 'http://localhost:8000/twitter/initiate/';
                          } else if (account.name === 'Instagram') {
                            window.location.href = 'http://localhost:8000/instagram/initiate/';
                          } else if (account.name === 'Facebook') {
                            window.location.href = 'http://localhost:8000/facebook/initiate/';
                          }
                        }}
                      >
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