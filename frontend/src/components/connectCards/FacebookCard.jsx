import { FaFacebook } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

function ConnectFacebookCard({ onConnect }) {
  const { isDarkMode } = useTheme();
  return (
    <div
      className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 transition w-full max-w-md shadow-md ${
        isDarkMode
          ? "bg-gray-900 border-gray-700 text-white"
          : "bg-white border-gray-300 text-gray-800"
      } hover:shadow-lg`}
    >
      <FaFacebook className="text-blue-500 text-5xl mb-4" />
      <h3 className="text-xl font-semibold mb-2">Connect Facebook</h3>
      <p className="text-gray-500 text-center mb-4">
        Connect your Facebook account to see real-time analytics and track your
        growth.
      </p>
      <button
        onClick={onConnect}
        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Connect Now
      </button>
    </div>
  );
}

export default ConnectFacebookCard;
