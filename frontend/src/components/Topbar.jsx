import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { IoMdNotificationsOutline } from "react-icons/io";
import user_image from "../assets/profile.png";

function Topbar() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("name");
    setUserName(name || "User");
  }, []);

  return (
    <header className={`fixed left-0 right-0 top-0 flex items-center justify-between bg-white/80 backdrop-blur-md shadow px-6 py-4 transition-[width] duration-300 `}>
      <div className="flex items-center space-x-4">
        <h2 className="text-transparent bg-clip-text bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 text-3xl font-bold select-none ml-16">SocialSync</h2>
      </div>
      <div className="relative items-center space-x-4 w-1/3 ">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          id="search-input"
          name="search"
          type="text"
          placeholder="Search profiles or metrics..."
          className="pl-10 pr-4 py-2 border rounded-lg w-full"
        />
      </div>
      <div className="flex items-center space-x-4">
        <IoMdNotificationsOutline className="text-gray-600 h-6 w-6" />
        <div className="flex items-center space-x-2">
          <img
            src={user_image}
            alt="User"
            className="rounded-full w-6 h-6"
          />
          <button>{userName}</button>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
