import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SidebarProvider } from './components/context/SidebarContext';
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';

function App() {

  return (
    <BrowserRouter>
      <SidebarProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </SidebarProvider>
    </BrowserRouter>
  );
}

export default App;
