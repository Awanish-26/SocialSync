/* eslint-disable no-unused-vars */
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import hero_image from '../assets/hero.svg';
import { motion } from 'framer-motion';
import about_image from '../assets/about.svg';
import { FaChartLine, FaInstagram, FaYoutube, FaTwitter } from 'react-icons/fa';
import { BiAnalyse } from 'react-icons/bi';
import { IoStatsChartSharp } from 'react-icons/io5';
import { HiArrowRight } from 'react-icons/hi';

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
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-center text-center md:text-left flex-1 relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#1E293B] opacity-95"></div>
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48ZyBmaWxsPSIjMkE0MzY1IiBmaWxsLW9wYWNpdHk9IjAuMSI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        </div>
        
        <motion.div 
          className="md:w-1/2 p-8 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex gap-2 items-center justify-center md:justify-start mb-6">
            <span className="px-4 py-1.5 bg-indigo-500/10 text-indigo-400 rounded-full text-sm font-medium">
              #1 Analytics Platform
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            Track Your Social Media Growth
          </h2>
          <p className="text-lg text-gray-400 mb-8 leading-relaxed">
            Take control of your social media presence with actionable insights and analytics tailored for creators like you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link to="/signup" className="group inline-flex items-center px-8 py-3 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white rounded-lg font-semibold text-lg transition-all duration-300">
              Get Started
              <HiArrowRight className="w-5 h-5 ml-2 transform transition-transform group-hover:translate-x-1" />
            </Link>
            <button className="inline-flex items-center px-8 py-3 border-2 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 rounded-lg font-semibold text-lg transition-all duration-300">
              Learn More
            </button>
          </div>
          <div className="mt-12 flex items-center justify-center md:justify-start gap-8">
            <div className="p-2 bg-[#1E293B] rounded-lg">
              <FaInstagram className="w-8 h-8 text-pink-500" />
            </div>
            <div className="p-2 bg-[#1E293B] rounded-lg">
              <FaYoutube className="w-8 h-8 text-red-500" />
            </div>
            <div className="p-2 bg-[#1E293B] rounded-lg">
              <FaTwitter className="w-8 h-8 text-blue-400" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="md:w-1/2 p-6 relative z-10"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <img src={hero_image} alt="Social media analysis" className="w-full max-w-2xl mx-auto filter drop-shadow-[0_0_15px_rgba(59,130,246,0.2)]" />
        </motion.div>
      </section>

      {/* About Section */}
      <section className="relative py-20 bg-[#1E293B]">
        <div className="container mx-auto px-4 flex flex-col-reverse md:flex-row items-center">
          <motion.div
            className="w-full md:w-1/2 text-center md:text-left"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              About Us
            </h2>
            <p className="text-gray-300 mb-6 leading-relaxed text-lg">
              We're passionate about empowering creators and businesses to understand their social media impact. Our platform transforms complex social data into actionable insights that drive growth and engagement.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Using advanced analytics and real-time tracking, we help you understand your audience, optimize your content strategy, and make data-driven decisions across Instagram, YouTube, and X platforms.
            </p>
          </motion.div>

          <motion.div
            className="w-full md:w-1/2 mb-10 md:mb-0"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <img
              src={about_image}
              alt="Teamwork illustration"
              className="w-full filter drop-shadow-[0_0_15px_rgba(59,130,246,0.2)]"
            />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-[#0F172A] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1E293B]/50 to-transparent"></div>
        <div className="relative z-10">
          <motion.h3 
            className="text-4xl font-bold mb-16 text-center text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Powerful Features
          </motion.h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <motion.div
              className="bg-[#1E293B]/50 p-8 rounded-2xl backdrop-blur-sm border border-indigo-500/10 group hover:border-indigo-500/30 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-indigo-500 to-blue-500 w-16 h-16 rounded-lg flex items-center justify-center mb-6 transform transition-transform group-hover:scale-110">
                <BiAnalyse className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-white mb-4">Multi-Platform Support</h4>
              <p className="text-gray-400">
                Connect your Instagram, YouTube, and X accounts and view growth at one place.
              </p>
            </motion.div>

            <motion.div
              className="bg-[#1E293B]/50 p-8 rounded-2xl backdrop-blur-sm border border-indigo-500/10 group hover:border-indigo-500/30 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-gradient-to-br from-indigo-500 to-blue-500 w-16 h-16 rounded-lg flex items-center justify-center mb-6 transform transition-transform group-hover:scale-110">
                <FaChartLine className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-white mb-4">Real-time Stats</h4>
              <p className="text-gray-400">
                Get live updates and growth analytics to stay ahead in your journey.
              </p>
            </motion.div>

            <motion.div
              className="bg-[#1E293B]/50 p-8 rounded-2xl backdrop-blur-sm border border-indigo-500/10 group hover:border-indigo-500/30 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-gradient-to-br from-indigo-500 to-blue-500 w-16 h-16 rounded-lg flex items-center justify-center mb-6 transform transition-transform group-hover:scale-110">
                <IoStatsChartSharp className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-white mb-4">Beautiful Graphs</h4>
              <p className="text-gray-400">
                Visualize your follower growth, likes, views and much more with smooth graphs.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1E293B] text-gray-400 text-center py-8">
        <div className="max-w-7xl mx-auto px-4">
          <p className="mb-4">© 2025 SocialSync. Made with ❤️ for creators.</p>
          <div className="flex justify-center gap-6">
            <a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
