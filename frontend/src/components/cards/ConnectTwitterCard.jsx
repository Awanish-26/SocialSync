import { FaTwitter } from "react-icons/fa";

function ConnectTwitterCard({ onConnect }) {
  return (
    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 bg-white hover:shadow-md transition">
      <FaTwitter className="text-blue-400 text-5xl mb-4" />
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Connect X (Twitter)</h3>
      <p className="text-gray-500 text-center mb-4">
        Connect your X (Twitter) account to see real-time analytics and track your growth.
      </p>
      <button
        onClick={onConnect}
        className="px-6 py-2 bg-blue-400 text-white rounded hover:bg-blue-500"
      >
        Connect Now
      </button>
    </div>
  );
}

export default ConnectTwitterCard;
