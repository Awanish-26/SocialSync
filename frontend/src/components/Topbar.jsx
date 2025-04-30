import { useEffect, useState, useContext } from "react";
import { SidebarContext } from "../components/context/SidebarContext"
import { FaSearch } from "react-icons/fa";
import { IoMdNotificationsOutline } from "react-icons/io";
import user_image from "../assets/profile.png";

function Topbar({ topbarVisible }) {
  const [userName, setUserName] = useState("");

  const {isCollapsed, setIsCollapsed} = useContext(SidebarContext);

  useEffect(() => {
    const name = localStorage.getItem("name");
    setUserName(name || "User");
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 flex items-center justify-between bg-white/80 backdrop-blur-md shadow px-6 py-4 ${isCollapsed ? 'left-16 w-[calc(100%-4rem)]' : 'md:left-72 md:w-[calc(100%-18rem)]'} ${topbarVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}
      style={isCollapsed ? { left: '4rem', width: 'calc(100% - 4rem)' } : { left: '18rem', width: 'calc(100% - 18rem)' }}
    >
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
