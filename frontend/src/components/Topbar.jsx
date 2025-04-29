import { useEffect, useState } from "react";
import user_image from '../assets/profile.png'; // Placeholder image for user profile
function Topbar() {
    const [userName, setUserName] = useState("");

    useEffect(() => {
      const name = localStorage.getItem("name");
      setUserName(name || "User");
    }, []);

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
              src={user_image}
              alt="User"
              className="rounded-full"
              style={{ width: "24px", height: "24px" }}
            />
            <span>{userName}</span>
          </div>
        </div>
      </header>
    );
  }
  
  export default Topbar;
  