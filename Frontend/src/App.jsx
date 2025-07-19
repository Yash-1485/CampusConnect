import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import { ToastContainer } from "react-toastify";
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import About from './pages/About';
import Contact from './pages/Contact';
import Browse from './pages/Browse';
import Navbar from './components/Navbar';
import useTheme from './store/useTheme';
import PageLoader from './components/PageLoader';
import Layout from './pages/Layout';
import Dashboard from "./pages/User/Dashboard"
import Profile from "./pages/User/Profile"
import Bookmark from "./pages/User/Bookmark"
import RoommateFinder from "./pages/User/RoommateFinder"
import useUser from './hooks/useUser';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { theme } = useTheme();
  const { user, isLoading } = useUser();

  const isAuthenticated = Boolean(user);
  // Just for checking page loader
  // if(true){
  //   return <PageLoader />
  // }

  if (isLoading) return <PageLoader />;

  return (
    <div className="min-h-screen" data-theme={theme}>
      <Router>
        <Routes>
          {/* For basic navbar - For all users */}
          <Route element={<Layout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/browse" element={<Browse />} />
          </Route>

          {/* Protected route for authenticated users */}
          <Route
            path="/mySpace"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Layout showSidebar={true} />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="bookmarks" element={<Bookmark />} />
            <Route path="roommates" element={<RoommateFinder />} />
          </Route>
        </Routes>
      </Router>

      <ToastContainer position="top-right" autoClose={3000} closeOnClick pauseOnFocusLoss pauseOnHover />
    </div>
  );
}

export default App;
