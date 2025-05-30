/* eslint-disable no-unused-vars */
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import hero_image from '../assets/hero.svg';
import { Navbar } from '../components/';
import { motion } from 'framer-motion';
import about_image from '../assets/about.svg';

function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);
  return (
    <div className="flex flex-col min-h-screen">

      <Navbar />

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-center text-center md:text-left flex-1 bg-gradient-to-r from-indigo-100 via-teal-100 to-blue-100 p-8">
        <div className="md:w-1/2 p-6">
          <h2 className="text-4xl md:text-7xl font-bold mb-4 text-gray-800">
            Track Your Social Media Growth
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            Take control of your social media presence with actionable insights and analytics tailored for creators like you.
          </p>
          <Link to="/signup" className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-lg">
            Get Started
          </Link>
        </div>

        <div className="md:w-1/2 p-6">
          <img src={hero_image} alt="Social media analysis" className="w-4/5 float-end" />
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 flex flex-col-reverse md:flex-row items-center">
          {/* Text Content */}
          <motion.div
            className="w-full md:w-1/2 text-center md:text-left"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-7xl font-bold mb-4 text-indigo-700">About Us</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              We're on a mission to build beautiful, responsive, and accessible web applications that empower users and solve real-world problems.
            </p>
            <p className="text-gray-600">
              Our team is passionate about blending design with functionality. We use modern tools like React, Tailwind CSS, and animations to deliver engaging user experiences.
            </p>
          </motion.div>

          <img
            src={about_image} // Replace with your own from undraw or storyset
            alt="Teamwork illustration"
            className="w-full md:w-1/2 mb-10 md:mb-0"

          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-6 bg-gray-100 text-center">
        <h3 className="text-3xl font-bold mb-10 text-gray-800">Features</h3>

        <div className="flex flex-col md:flex-row gap-8 justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-1/3">
            <img
              src="https://img.icons8.com/?size=100&id=3473&format=png&color=000000"
              alt="Multi-Platform Support"
              className="w-16 h-16 mx-auto mb-4"
            />
            <h4 className="text-xl font-bold text-indigo-600 mb-2">Multi-Platform Support</h4>
            <p className="text-gray-600">
              Connect your Instagram, YouTube, and X accounts and view growth at one place.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-1/3">
            <img
              src="https://img.icons8.com/?size=100&id=84306&format=png&color=000000"
              alt="Real-time Stats"
              className="w-16 h-16 mx-auto mb-4"
            />
            <h4 className="text-xl font-bold text-teal-600 mb-2">Real-time Stats</h4>
            <p className="text-gray-600">
              Get live updates and growth analytics to stay ahead in your journey.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-1/3">
            <img
              src="https://img.icons8.com/?size=100&id=102554&format=png&color=000000"
              alt="Beautiful Graphs"
              className="w-16 h-16 mx-auto mb-4"
            />
            <h4 className="text-xl font-bold text-blue-600 mb-2">Beautiful Graphs</h4>
            <p className="text-gray-600">
              Visualize your follower growth, likes, views and much more with smooth graphs.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-900 text-white text-center py-6 mt-10">
        <p>© 2025 SocialSync. Made with ❤️ for creators.</p>
      </footer>

    </div>
  );
}

export default Landing;
