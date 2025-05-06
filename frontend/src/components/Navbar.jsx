import { Link } from 'react-router-dom';

function Navbar() {


  return (
    <nav className="flex justify-between items-center px-12 py-4 bg-white shadow-md sticky top-0 z-50">
      <Link to="/" className="text-transparent bg-clip-text bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 text-3xl font-bold ">SocialSync</Link>

      <div className="space-x-4">
        <Link to="/signup" className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded ">
          Sign Up
        </Link>
        <Link to="/login" className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded">
          Login
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
