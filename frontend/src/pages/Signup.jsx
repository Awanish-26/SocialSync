import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import signip_image from "../assets/undraw_sign-up.png";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/api/signup/', formData);
      alert("User created successfully! Please log in.");
      console.log(res.data);
      navigate("/login");
    } catch (err) {
      console.error(err.response.data);
      alert(err.response.data.error || "Something went wrong");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center h-svh bg-gray-100">
        <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="hidden md:block md:w-1/2">
            <img  src={signip_image}  alt="Sign Up"  className="w-full h-auto"/>
          </div>
          {/* Form Section */}
          <div className="md:w-1/2">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Sign Up
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input  name="username"  placeholder="Username"  onChange={handleChange}  required  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              <input  name="email"  type="email"  placeholder="Email"  onChange={handleChange}  required  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              <input  name="password"  type="password"  placeholder="Password"  onChange={handleChange}  required  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              <button  type="submit"  className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300">
                Sign Up
              </button>
              <p className="text-center text-gray-600 mt-4">
                Already have an account?{" "}
                <a href="/login" className="text-blue-500 hover:underline">
                  Log in
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
