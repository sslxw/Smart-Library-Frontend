import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import BrowsingPage from "./pages/BrowsingPage";
import LoginPage from "./pages/LoginPage";
import SignUp from "./pages/SignUpPage";
import AuthContext, { AuthProvider } from './handlers/AuthContext';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage'; // Import the ProfilePage
import { useContext } from 'react';

const App: React.FC = () => {
  return (
    <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<BrowsingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/admin" element={<AdminRoute />} />
            <Route path="/profile" element={<ProfilePage />} /> 
          </Routes>
        </Router>
    </AuthProvider>
  );
}

const AdminRoute = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return <AdminPage />;
};

export default App;
