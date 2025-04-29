import { useEffect, useState, useContext } from "react";
import { SidebarContext } from "../components/context/SidebarContext"
import { FaSearch } from "react-icons/fa";
import { IoMdNotificationsOutline } from "react-icons/io";
import user_image from "../assets/profile.png";
function Topbar() {
  const [userName, setUserName] = useState("");

  const {isCollapsed, setIsCollapsed} = useContext(SidebarContext);

  useEffect(() => {
    const name = localStorage.getItem("name");
    setUserName(name || "User");
  }, []);

  return (
    <header className="flex items-center justify-between bg-white shadow px-6 py-4">
      {isCollapsed && (
        <div>
          <h2 className="text-blue-700 text-2xl font-bold select-none">SocialSync</h2>
        </div>
      )}
      <div className="relative w-1/2">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search profiles or metrics..."
          className="pl-10 pr-4 py-2 border rounded-lg w-full"
        />
      </div>
      <div className="flex items-center space-x-4">
        <IoMdNotificationsOutline className="text-gray-600 h-6 w-6"/>
        <div className="flex items-center space-x-2">
          <img
            src={user_image}
            alt="User"
            className="rounded-full"
            style={{ width: "24px", height: "24px" }}
          />
          <button>{userName}</button>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
