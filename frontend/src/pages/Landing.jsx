import { useEffect } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import landing_image from '../assets/landing.png';
import Navbar from '../components/Navbar';

function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (token) {
      navigate('/dashboard'); // Redirect to dashboard if token exists
    }
  }, [navigate]);
  return (
    <div className="flex flex-col min-h-screen">
      
      <Navbar />

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-center text-center md:text-left flex-1 bg-gradient-to-r from-indigo-100 via-teal-100 to-blue-100 p-8">
        <div className="md:w-1/2 p-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
            Track Your Social Media Growth
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            Analyze your Instagram, YouTube, X and grow smarter every day.
          </p>
          <Link to="/signup" className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-lg">
            Get Started
          </Link>
        </div>

        <div className="md:w-1/2 p-6">
          <img 
            src={landing_image}
            alt="Social media analysis" 
            className="w-full"
          />
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 px-6 bg-gray-50 text-center">
        <h3 className="text-3xl font-bold mb-4 text-gray-800">About SocialPulse</h3>
        <p className="max-w-2xl mx-auto text-gray-600">
          SocialPulse is your all-in-one tool to monitor social media growth. Whether you're an influencer, a business, or just curious, track your stats easily across platforms like Instagram, YouTube, and X!
        </p>
      </section>

      {/* Features Section */}
      <section className="py-12 px-6 bg-gray-100 text-center">
        <h3 className="text-3xl font-bold mb-10 text-gray-800">Features</h3>
        
        <div className="flex flex-col md:flex-row gap-8 justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-1/3">
            <h4 className="text-xl font-bold text-indigo-600 mb-2">Multi-Platform Support</h4>
            <p className="text-gray-600">
              Connect your Instagram, YouTube, and X accounts and view growth at one place.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-1/3">
            <h4 className="text-xl font-bold text-teal-600 mb-2">Real-time Stats</h4>
            <p className="text-gray-600">
              Get live updates and growth analytics to stay ahead in your journey.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-1/3">
            <h4 className="text-xl font-bold text-blue-600 mb-2">Beautiful Graphs</h4>
            <p className="text-gray-600">
              Visualize your follower growth, likes, views and much more with smooth graphs.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-900 text-white text-center py-6 mt-10">
        <p>© 2025 SocialPulse. Made with ❤️ for creators.</p>
      </footer>

    </div>
  );
}

export default Landing;
