import { useContext } from 'react';
import { SidebarContext } from '../components/context/SidebarContext';
import { FaTachometerAlt, FaChartBar, FaUsers, FaCog, FaInstagram, FaFacebook, FaTwitter, FaBars } from 'react-icons/fa';

const Sidebar = ({ setActiveComponent }) => {
  const { isCollapsed, toggleSidebar } = useContext(SidebarContext);

  return (
    <div className="flex">
      <div className={`fixed top-0 left-0 h-screen ${isCollapsed ? 'w-16' : 'w-72'} bg-gray-800 text-white z-40 overflow-hidden`}>
        <div className="p-6 flex justify-between items-center">
          {/* Logo fades in/out */}
          <div className={`${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            {!isCollapsed && <h2 className="text-2xl font-bold select-none">SocialSync</h2>}
          </div>
          {/* Toggle button always visible */}
          <button onClick={toggleSidebar} className="text-white focus:outline-none">
            <FaBars size={20} />
          </button>
        </div>
        <nav className="mt-5">
          <ul>
            <li
              className="p-4 flex items-center hover:bg-gray-700 cursor-pointer"
              onClick={() => setActiveComponent('Dashboard')}
            >
              <FaTachometerAlt className="mr-2 ml-2" />
              <span className={`${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto ml-2'}`}>{!isCollapsed && 'Dashboard'}</span>
            </li>
            <li
              className="p-4 flex items-center hover:bg-gray-700 cursor-pointer"
              onClick={() => setActiveComponent('Analytics')}
            >
              <FaChartBar className="mr-2 ml-2" />
              <span className={`${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto ml-2'}`}>{!isCollapsed && 'Analytics'}</span>
            </li>
            <li
              className="p-4 flex items-center hover:bg-gray-700 cursor-pointer"
              onClick={() => setActiveComponent('Audience')}
            >
              <FaUsers className="mr-2 ml-2" />
              <span className={`${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto ml-2'}`}>{!isCollapsed && 'Audience'}</span>
            </li>
            <li
              className="p-4 flex items-center hover:bg-gray-700 cursor-pointer"
              onClick={() => setActiveComponent('Settings')}
            >
              <FaCog className="mr-2 ml-2" />
              <span className={`${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto ml-2'}`}>{!isCollapsed && 'Settings'}</span>
            </li>
          </ul>
        </nav>
        <div className="mt-10">
          <h3 className={`px-4 text-lg font-semibold ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>Connect Social Profiles</h3>
          <ul className="mt-4">
            <li
              className="p-4 flex items-center hover:bg-gray-700 cursor-pointer"
              onClick={() => setActiveComponent('Instagram')}
            >
              <FaInstagram className="mr-2 ml-2 text-pink-500" />
              <span className={`${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto ml-2'}`}>{!isCollapsed && 'Instagram'}</span>
            </li>
            <li
              className="p-4 flex items-center hover:bg-gray-700 cursor-pointer"
              onClick={() => setActiveComponent('Facebook')}
            >
              <FaFacebook className="mr-2 ml-2 text-blue-500" />
              <span className={`${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto ml-2'}`}>{!isCollapsed && 'Facebook'}</span>
            </li>
            <li
              className="p-4 flex items-center hover:bg-gray-700 cursor-pointer"
              onClick={() => setActiveComponent('Twitter')}
            >
              <FaTwitter className="mr-2 ml-2 text-blue-400" />
              <span className={`${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto ml-2'}`}>{!isCollapsed && 'X (Twitter)'}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;