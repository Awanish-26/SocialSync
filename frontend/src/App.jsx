import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/context/ThemeContext';
import { SidebarProvider } from './components/context/SidebarContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Landing from './pages/Landing';
import AIAssistant from './components/AIAssistant';

function App() {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <Router>
          <Layout>
            <AIAssistant />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </Layout>
        </Router>
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default App;