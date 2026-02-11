import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Roadmap from './pages/Roadmap';
import Experiences from './pages/Experiences';
import Navbar from './components/Navbar';

function App() {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-surface-50">
      {user && <Navbar />}
      <div className={user ? "max-w-7xl mx-auto py-10 px-4" : ""}>
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/roadmap" element={user ? <Roadmap /> : <Navigate to="/login" />} />
          <Route path="/experiences" element={user ? <Experiences /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
