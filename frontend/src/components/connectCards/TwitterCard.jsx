import { FaTwitter } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";


function ConnectTwitterCard() {
  const { isDarkMode } = useTheme();
  return (
    <div className={`flex flex-col items-stretch w-full max-w-md shadow-md justify-center border-2 border-dashed rounded-lg p-8 transition
      ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-black'}
      hover:shadow-lg`}
    >
      <FaTwitter className="text-blue-400 text-5xl mb-4 align-middle self-center" />
      <h2 className="text-2xl font-semibold text-center mb-4">Connect Twitter Account</h2>
      <button
        onClick={() => { window.location.href = "http://localhost:8000/twitter/initiate/"; }}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Connect with Twitter
      </button>
    </div>
  );
}

export default ConnectTwitterCard;