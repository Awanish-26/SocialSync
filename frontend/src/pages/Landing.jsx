/* eslint-disable no-unused-vars */
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import hero_image from '../assets/hero.svg';
import { motion } from 'framer-motion';
import about_image from '../assets/about.svg';
import { FaInstagram, FaYoutube, FaTwitter } from 'react-icons/fa';
import { FiBarChart2, FiUsers, FiTrendingUp } from 'react-icons/fi';
import { HiArrowRight } from 'react-icons/hi';
import { useTheme } from '../components/context/ThemeContext';

const FeatureCard = ({ icon: Icon, title, description }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`p-6 rounded-xl border ${
        isDarkMode 
          ? 'bg-gray-800/50 border-gray-700/50' 
          : 'bg-white border-gray-200'
      } transition-colors duration-200`}
    >
      <div className={`w-12 h-12 rounded-lg ${isDarkMode ? 'bg-indigo-500/20' : 'bg-indigo-100'} flex items-center justify-center mb-4`}>
        <Icon className={`w-6 h-6 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
      </div>
      <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </h3>
      <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        {description}
      </p>
    </motion.div>
  );
};

function Landing() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const features = [
    {
      icon: FiBarChart2,
      title: 'Advanced Analytics',
      description: 'Get detailed insights into your social media performance with our advanced analytics tools.'
    },
    {
      icon: FiUsers,
      title: 'Audience Insights',
      description: 'Understand your audience better with demographic data and engagement metrics.'
    },
    {
      icon: FiTrendingUp,
      title: 'Growth Tracking',
      description: 'Track your growth across all platforms and identify trending content.'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className={`flex flex-col md:flex-row items-center justify-center text-center md:text-left flex-1 relative overflow-hidden py-20 ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      } transition-colors duration-200`}>
        <div className={`absolute inset-0 ${
          isDarkMode 
            ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
            : 'bg-gradient-to-br from-gray-100 via-white to-gray-100'
        } transition-colors duration-200`}></div>
        <div className="absolute inset-0">
          <div className={`absolute inset-0 ${
            isDarkMode 
              ? 'bg-[url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48ZyBmaWxsPSIjMkE0MzY1IiBmaWxsLW9wYWNpdHk9IjAuMSI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiLz48L2c+PC9nPjwvc3ZnPg==")] opacity-20'
              : 'bg-[url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48ZyBmaWxsPSIjE0E0REUiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIyIiBjeT0iMiIgcj0iMiIvPjwvZz48L2c+PC9zdmc+")] opacity-10'
          }`}></div>
        </div>
        
        <motion.div 
          className="md:w-1/2 p-8 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex gap-2 items-center justify-center md:justify-start mb-6">
            <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${
              isDarkMode 
                ? 'bg-indigo-500/10 text-indigo-400' 
                : 'bg-indigo-100 text-indigo-600'
            }`}>
              #1 Analytics Platform
            </span>
          </div>
          <h2 className={`text-4xl md:text-6xl font-bold mb-6 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Track Your Social Media Growth
          </h2>
          <p className={`text-lg mb-8 leading-relaxed ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Take control of your social media presence with actionable insights and analytics tailored for creators like you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link to="/signup" className="group inline-flex items-center px-8 py-3 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white rounded-lg font-semibold text-lg transition-all duration-300">
              Get Started
              <HiArrowRight className="w-5 h-5 ml-2 transform transition-transform group-hover:translate-x-1" />
            </Link>
            <button className={`inline-flex items-center px-8 py-3 border-2 rounded-lg font-semibold text-lg transition-all duration-300 ${
              isDarkMode 
                ? 'border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10' 
                : 'border-indigo-500/50 text-indigo-600 hover:bg-indigo-50'
            }`}>
              Learn More
            </button>
          </div>
          <div className="mt-12 flex items-center justify-center md:justify-start gap-8">
            <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <FaInstagram className="w-8 h-8 text-pink-500" />
            </div>
            <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <FaYoutube className="w-8 h-8 text-red-500" />
            </div>
            <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
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
      <section className={`relative py-20 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } transition-colors duration-200`}>
        <div className="container mx-auto px-4 flex flex-col-reverse md:flex-row items-center">
          <motion.div
            className="w-full md:w-1/2 text-center md:text-left"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className={`text-4xl md:text-6xl font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              About Us
            </h2>
            <p className={`mb-6 leading-relaxed text-lg ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              We're passionate about empowering creators and businesses to understand their social media impact. Our platform transforms complex social data into actionable insights that drive growth and engagement.
            </p>
            <p className={`leading-relaxed ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
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
      <section className={`py-20 px-6 relative overflow-hidden ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      } transition-colors duration-200`}>
        <div className={`absolute inset-0 ${
          isDarkMode 
            ? 'bg-gradient-to-b from-gray-800/50 to-transparent' 
            : 'bg-gradient-to-b from-white/50 to-transparent'
        }`}></div>
        <div className="relative z-10">
          <motion.h3 
            className={`text-4xl font-bold mb-16 text-center ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Powerful Features
          </motion.h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`${
        isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-600'
      } text-center py-8 transition-colors duration-200`}>
        <div className="max-w-7xl mx-auto px-4">
          <p className="mb-4">© 2025 SocialSync. Made with ❤️ for creators.</p>
          <div className="flex justify-center gap-6">
            <a href="#" className={`${
              isDarkMode ? 'hover:text-indigo-400' : 'hover:text-indigo-600'
            } transition-colors`}>Privacy Policy</a>
            <a href="#" className={`${
              isDarkMode ? 'hover:text-indigo-400' : 'hover:text-indigo-600'
            } transition-colors`}>Terms of Service</a>
            <a href="#" className={`${
              isDarkMode ? 'hover:text-indigo-400' : 'hover:text-indigo-600'
            } transition-colors`}>Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
