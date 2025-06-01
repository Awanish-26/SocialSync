import { useState } from "react";
import apiClient from "../../utils/apiClient";
import { FaYoutube } from "react-icons/fa";

function ConnectYoutube() {
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiClient.get("youtube/initiate/");
      console.log(res);
      if (res.status === 200) {
        window.location.href = res.data.authorization_url; // Redirect to YouTube auth URL
      } else {
        alert("Failed to authenticate with YouTube. Please try again.");
      }
    } catch (err) {
      alert("Error during YouTube authentication");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <div className="my-8 text-center p-4 bg-gray-100 shadow-md border-2 border-dashed border-gray-500 rounded-lg">
        <FaYoutube className="text-6xl text-red-600 mx-auto mb-4" />
        <form onSubmit={handleAuth}>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" disabled={loading}>
            {loading ? "Authenticating..." : "Authenticate with YouTube"}
          </button>
        </form>
      </div>
    </>
  );
}

export default ConnectYoutube;
