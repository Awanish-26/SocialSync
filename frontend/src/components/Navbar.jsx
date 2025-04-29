import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <nav className="flex justify-between items-center p-6 bg-white shadow-md sticky top-0 z-50">
      <Link to="/" className="text-2xl font-bold text-blue-600">SocialSync</Link>

      <div className="flex gap-4">
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-md font-semibold">
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md font-semibold"
            >
              Logout
            </button>
          </>
        ) :
        (
          <>
            <Link to="/signup" className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-semibold">
              Sign Up
            </Link>
            <Link to="/login" className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md font-semibold">
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
