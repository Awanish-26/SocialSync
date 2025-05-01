import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../utils/apiClient'; // Adjust the import path as necessary

const Settings = () => {
    const [userName, setUserName] = useState("");
    const [isYouTubeConnected, setIsYouTubeConnected] = useState(false); // Track YouTube connection status
    const navigate = useNavigate();

    useEffect(() => {
        const name = localStorage.getItem("name");
        setUserName(name || "User");

        // Check if YouTube is connected
        const fetchYouTubeStatus = async () => {
            try {
                const res = await apiClient.get("/youtube/status/");
                setIsYouTubeConnected(res.data.connected);
            } catch (err) {
                console.error("Error fetching YouTube status:", err);
            }
        };

        fetchYouTubeStatus();
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

    return (
        <div className="settings-page" id="settings-page">
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            <div className="user-info mb-4">
                <p className="text-lg">Welcome, {userName}!</p>
            </div>
            <div className="logout-button">
                <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                    Logout
                </button>
            </div>
            {isYouTubeConnected && (
                <div className="disconnect-youtube mt-4">
                    <button onClick={handleDisconnectYouTube} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
                        Disconnect YouTube Account
                    </button>
                </div>
            )}
        </div>
    );
};

export default Settings;