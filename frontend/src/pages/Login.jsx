import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import signIn_image from "../assets/undraw_sign-in.png";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { motion } from "framer-motion";
import { FaGithub, FaGoogle } from "react-icons/fa";
import AuthLayout from "../components/AuthLayout";

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://localhost:8000/api/login/", formData);
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("name", res.data.name);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Incorrect username or password.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <AuthLayout
      imageSrc={signIn_image}
      imageText="Welcome to SocialSync"
      imageDescription="Track your social media growth with powerful analytics."
    >
      <div className="max-w-sm mx-auto py-3">
        <h2 className="text-2xl font-bold text-white mb-1">Welcome Back!</h2>
        <p className="text-gray-400 text-sm mb-5">Sign in to continue to SocialSync</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
            <input
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-[#0F172A] border border-gray-700 rounded-lg focus:outline-none focus:border-indigo-500 text-white placeholder-gray-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-[#0F172A] border border-gray-700 rounded-lg focus:outline-none focus:border-indigo-500 text-white placeholder-gray-500 text-sm"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 focus:outline-none"
              >
                {showPassword ? <LuEyeClosed size={16} /> : <LuEye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm"
            >
              {error}
            </motion.p>
          )}

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-700 bg-[#0F172A] text-indigo-500 focus:ring-indigo-500" />
              <span className="ml-2 text-gray-400 text-sm">Remember me</span>
            </label>
            <Link to="/reset-password" className="text-indigo-400 hover:text-indigo-300 text-sm">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 text-white bg-gradient-to-r from-indigo-600 to-blue-500 rounded-lg font-medium hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#1E293B] transition-all duration-300 text-sm ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 text-gray-400 bg-[#1E293B]">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center px-3 py-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-[#0F172A] transition-colors duration-300 text-sm"
            >
              <FaGoogle className="mr-2" size={14} />
              Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center px-3 py-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-[#0F172A] transition-colors duration-300 text-sm"
            >
              <FaGithub className="mr-2" size={14} />
              GitHub
            </button>
          </div>

          <p className="text-center text-gray-400 text-sm mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}

export default Login;
