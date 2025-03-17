import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './utils/ProvideRoute';
import Login from './Components/Auth/Login';
import Register from './Components/Auth/Register';
import AdminDashboard from './Components/Dashboard/AdminDashboard';
import CreatePrompt from './Components/Dashboard/CreatePrompt';
import AssignPrompt from './Components/Dashboard/AssignPrompt';
import AdminReview from './Components/Dashboard/AdminReview';
import UserDashboard from './Components/Dashboard/UserDashboard';
import MyPrompt from './Components/MyPrompts';
import SubmitPrompt from './Components/SubmitPrompt';
import Home from './Pages/Home';
import AdminReviewSubmissions from './Components/AdminReviewSubmissions';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/my-prompts" element={<MyPrompt />} />
          <Route path="/submit-prompt/:id" element={<SubmitPrompt />} />
          {/* Admin Routes */}
          <Route element={<PrivateRoute role="admin" />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/create-prompt" element={<CreatePrompt />} />
            <Route path="/assign-prompt" element={<AssignPrompt />} />
            <Route path="/review-submissions" element={<AdminReview />} />
            <Route path="/admin-review-submissions" element={<AdminReviewSubmissions />} /> 
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
