import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import signIn_image from "../assets/undraw_sign-in.png";
import { LuEye, LuEyeClosed } from "react-icons/lu";

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
    setError(""); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear previous errors
    try {
      const res = await axios.post("http://localhost:8000/api/login/", formData);

      localStorage.setItem("access", res.data.access); // Save token
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("name", res.data.name); // Save user's name

      navigate("/dashboard"); // Redirect to dashboard
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
    <div>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex md:w-3/4 md:h-3/4 flex-col md:flex-row bg-white rounded shadow-md">
          {/* Image Section */}
          <div className="hidden md:block md:w-1/2">
            <img
              src={signIn_image}
              alt="Sign In"
              className="object-cover w-full h-full rounded-l"
            />
          </div>

          {/* Form Section */}
          <div className="w-full md:w-1/2 p-8">
            <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
              Login
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input  name="username"  placeholder="Username"  value={formData.username}  onChange={handleChange}  required  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                {error && (
                  <p className="mt-1 text-sm text-red-500">* {error}</p>
                )}
              </div>
              <div className="relative">
                <input  name="password"  type={showPassword ? "text" : "password"}  placeholder="Password"  value={formData.password}  onChange={handleChange}  required  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                <button  type="button"  onClick={togglePasswordVisibility}  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none">
                  {showPassword ? <LuEyeClosed/> : <LuEye/>}
                </button>
              </div>
              <p className="text-sm text-gray-600">
                forgot password?{" "}
                <a href="/reset-password" className="text-blue-500 hover:underline">
                  Reset here
                </a>
              </p>
              <button  type="submit"  disabled={loading}  className={`w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${    loading ? "opacity-50 cursor-not-allowed" : ""  }`}>
                {loading ? "Logging in..." : "Login"}
              </button>
              <p className="text-sm text-center text-gray-600">
                Don't have an account?{" "}
                <a href="/signup" className="text-blue-500 hover:underline">
                  Sign up
                </a>
                </p>
                
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
