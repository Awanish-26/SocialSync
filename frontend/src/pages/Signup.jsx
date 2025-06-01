import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import signup_image from "../assets/undraw_sign-up.png";
import { motion } from "framer-motion";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import AuthLayout from "../components/AuthLayout";
import { useTheme } from '../components/context/ThemeContext';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { isDarkMode } = useTheme();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post('http://localhost:8000/api/signup/', formData);
      console.log(res.data);
      navigate("/login");
    } catch (err) {
      console.error(err.response.data);
      setError(err.response.data.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <AuthLayout
      imageSrc={signup_image}
      imageText="Start Your Journey!"
      imageDescription="Join thousands of creators who trust SocialSync for their social media analytics."
    >
      <div className={`max-w-md mx-auto ${isDarkMode ? 'bg-[#1E293B]' : 'bg-white'}`}>
        <h2 className={`text-2xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Create Account
        </h2>
        <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Join SocialSync to track your social media growth
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Username
            </label>
            <input
              name="username"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
              required
              className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                isDarkMode 
                  ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                isDarkMode 
                  ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Password
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
                className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                  isDarkMode 
                    ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className={`absolute right-2 top-1/2 -translate-y-1/2 ${
                  isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                } focus:outline-none`}
              >
                {showPassword ? <LuEyeClosed size={18} /> : <LuEye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-sm ${isDarkMode ? 'text-red-400' : 'text-red-500'}`}
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 text-white bg-gradient-to-r from-indigo-600 to-blue-500 rounded-lg font-medium hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              isDarkMode ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'
            } transition-all duration-300 text-sm ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className={`px-2 ${isDarkMode ? 'text-gray-400 bg-[#1E293B]' : 'text-gray-500 bg-white'}`}>
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className={`flex items-center justify-center px-3 py-2 border rounded-lg text-sm transition-colors duration-300 ${
                isDarkMode 
                  ? 'border-gray-700 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FaGoogle className="mr-2" size={14} />
              Google
            </button>
            <button
              type="button"
              className={`flex items-center justify-center px-3 py-2 border rounded-lg text-sm transition-colors duration-300 ${
                isDarkMode 
                  ? 'border-gray-700 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FaGithub className="mr-2" size={14} />
              GitHub
            </button>
          </div>

          <p className={`text-center text-sm mt-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Already have an account?{" "}
            <Link 
              to="/login" 
              className={`font-medium ${
                isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'
              }`}
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}

export default Signup;
