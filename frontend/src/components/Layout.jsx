import { useTheme } from './context/ThemeContext';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-50 text-gray-900'} transition-colors duration-200`}>
      <Navbar />
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout; 