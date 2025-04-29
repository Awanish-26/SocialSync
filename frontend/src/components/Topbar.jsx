import { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
function Topbar() {
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
      <header className="flex items-center justify-between bg-white shadow px-6 py-4">
        <input
          type="text"
          placeholder="Search profiles or metrics..."
          className="px-4 py-2 border rounded-lg w-1/2"
        />
        <div className="flex items-center space-x-4">
          <button className="text-gray-600 hover:text-blue-500">
            🔔
          </button>
          <div className="flex items-center space-x-2">
            <img
              src="https://randomuser.me/api/portraits/men/19.jpg"
              alt="User"
              className="rounded-full"
              style={{ width: "24px", height: "24px" }}
            />
            <span>{userName}</span>
          </div>
          <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md font-semibold"
            >
              Logout
            </button>
        </div>
      </header>
    );
  }
  
  export default Topbar;
  