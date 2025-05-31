/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import hero_image from '../assets/hero.svg';
import { Navbar } from '../components/';
import { motion, useScroll, useTransform } from 'framer-motion';
import about_image from '../assets/about.svg';
import { FaRocket, FaChartLine, FaUsers } from 'react-icons/fa';

function Landing() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroY = useTransform(scrollY, [0, 300], [0, 100]);

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (token) {
      navigate('/dashboard');
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navigate]);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* Floating Navigation */}
      <motion.div
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/80 backdrop-blur-md shadow-lg' : ''
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Navbar />
      </motion.div>

      {/* Hero Section */}
      <motion.section 
        style={{ opacity: heroOpacity, y: heroY }}
        className="flex flex-col md:flex-row items-center justify-center text-center md:text-left min-h-screen pt-20 bg-gradient-to-r from-indigo-100 via-teal-100 to-blue-100 p-8"
      >
        <motion.div 
          className="md:w-1/2 p-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Track Your Social Media Growth
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-700 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Take control of your social media presence with actionable insights and analytics tailored for creators like you.
          </motion.p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/signup" className="inline-block px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300">
              Get Started Now
            </Link>
          </motion.div>
        </motion.div>

        <motion.div 
          className="md:w-1/2 p-6"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.img 
            src={hero_image} 
            alt="Social media analysis" 
            className="w-4/5 float-end"
            whileHover={{ scale: 1.05 }}
            animate={{ 
              y: [0, -20, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="py-20 px-6 bg-white"
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <motion.h3 
          className="text-5xl font-bold mb-20 text-center bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent py-2 px-4"
          variants={fadeInUp}
        >
          Why Choose SocialSync?
        </motion.h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {[
            {
              icon: <FaRocket className="w-8 h-8 text-indigo-600" />,
              title: "Multi-Platform Support",
              description: "Connect your Instagram, YouTube, and X accounts and view growth at one place."
            },
            {
              icon: <FaChartLine className="w-8 h-8 text-teal-600" />,
              title: "Real-time Stats",
              description: "Get live updates and growth analytics to stay ahead in your journey."
            },
            {
              icon: <FaUsers className="w-8 h-8 text-blue-600" />,
              title: "Beautiful Graphs",
              description: "Visualize your follower growth, likes, views and much more with smooth graphs."
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
              variants={fadeInUp}
              whileHover={{ y: -10 }}
            >
              <motion.div 
                className="mb-6 p-4 bg-gray-50 rounded-full w-fit"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                {feature.icon}
              </motion.div>
              <h4 className="text-2xl font-bold mb-4">{feature.title}</h4>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* About Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 flex flex-col-reverse md:flex-row items-center">
          <motion.div
            className="w-full md:w-1/2 text-center md:text-left"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                About Us
              </h2>
              <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                We're on a mission to build beautiful, responsive, and accessible web applications that empower creators like you.
              </p>
              <p className="text-lg text-gray-600">
                Our team is passionate about blending design with functionality. We use modern tools like React, Tailwind CSS, and animations to deliver engaging user experiences.
              </p>
            </motion.div>
          </motion.div>

          <motion.img
            src={about_image}
            alt="Teamwork illustration"
            className="w-full md:w-1/2 mb-10 md:mb-0"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-indigo-900 to-blue-900 text-white text-center py-8">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-lg"
        >
          © 2025 SocialSync. Made with ❤️ for creators.
        </motion.p>
      </footer>
    </div>
  );
}

export default Landing;
