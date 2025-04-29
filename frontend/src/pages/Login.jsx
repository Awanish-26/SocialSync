import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";


function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/api/login/", formData);

      localStorage.setItem("access", res.data.access); // Save token
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("name", res.data.name); // Save user's name

      navigate("/dashboard"); // Redirect to dashboard
    } catch (err) {
      console.error( err);
      alert("Login failed: Incorrect username or password.");
    }
  };

  return (
    <div>
      <Navbar />

    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input  name="username"  placeholder="Username"  onChange={handleChange}  required  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div>
            <input  name="password"  type="password"  placeholder="Password"  onChange={handleChange}  required  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <button  type="submit"  className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Login
          </button>
        </form>
      </div>
    </div>
    </div>
  );
}

export default Login;
