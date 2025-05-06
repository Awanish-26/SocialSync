import { FaFacebook } from "react-icons/fa";

function ConnectFacebookCard({ onConnect }) {
  return (
    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 bg-white hover:shadow-md transition">
      <FaFacebook className="text-blue-500 text-5xl mb-4" />
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Connect Facebook</h3>
      <p className="text-gray-500 text-center mb-4">
        Connect your Facebook account to see real-time analytics and track your growth.
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
