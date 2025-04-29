import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
    const [userName, setUserName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
      const name = localStorage.getItem("name");
      setUserName(name || "User");
    }, []);


    const handleLogout = () => {
      localStorage.clear(); // Clear all local storage items
      navigate('/');
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
            
        </div>
    );
};

export default Settings;