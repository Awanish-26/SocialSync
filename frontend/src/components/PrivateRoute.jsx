import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('access');

  if (!token) {
    // If token not found, redirect to login
    return <Navigate to="/login" />;
  }
  // If token exists, show the page
  return children;
}

export default PrivateRoute;
