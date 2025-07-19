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

import AdminPanel from "./pages/Admin/AdminPanel"
import Listings from "./pages/Admin/Listings"
import AdminProfile from "./pages/Admin/Profile"
import Reviews from "./pages/Admin/Reviews"
import Users from "./pages/Admin/Users"

function App() {
  const { theme } = useTheme();
  const { user, isLoading } = useUser();
  const isAuthenticated = Boolean(user);
  const isAdmin=user?.role==="admin";
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
          {
            user
            ?
            (
              user?.role=="user"
              ? (
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
              )
              : (
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                      {
                        isAdmin?<Layout showSidebar={true} />:<Navigate to="/" replace/>
                      }
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<AdminPanel />} />
                  <Route path="profile" element={<AdminProfile />} />
                  <Route path="listings" element={<Listings />} />
                  <Route path="reviews" element={<Reviews />} />
                  <Route path="users" element={<Users />} />
                </Route>
              )
            )
            :(<></>)
          }
        </Routes>
      </Router>

      <ToastContainer position="top-right" autoClose={3000} closeOnClick pauseOnFocusLoss pauseOnHover />
    </div>
  );
}

export default App;
