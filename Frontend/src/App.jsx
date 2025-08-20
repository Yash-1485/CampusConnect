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
import useUser from './hooks/useUser';
import ProtectedRoute from './components/ProtectedRoute';

import AdminPanel from "./pages/Admin/AdminPanel"
import Listings from "./pages/Admin/Listings"
import AdminProfile from "./pages/Admin/Profile"
import Reviews from "./pages/Admin/Reviews"
import Users from "./pages/Admin/Users"
import ProfileSetupForm from './pages/ProfileSetupForm';
import VerifiedUserRoute from './components/VerifiedUserRoute';
import ListingDetail from './pages/ListingDetails';
import ScrollToTop from './components/ScrollToTop';
import ReviewAnalysis from './pages/Admin/ReviewsAnalysis';

function App() {
  const { theme } = useTheme();
  const { user, isLoading } = useUser();
  const isAuthenticated = Boolean(user);
  const isVerified = user?.is_verified;
  const isAdmin = user?.role === "admin";

  if (isLoading) return <PageLoader />;

  return (
    <div className="min-h-screen" data-theme={theme}>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={
              <VerifiedUserRoute>
                <Landing />
              </VerifiedUserRoute>
            } />
            <Route path="/login" element={
              !isAuthenticated ? <Login /> : <Navigate to={isVerified ? "/" : "/profileSetup"} />
            } />
            <Route path="/signup" element={
              !isAuthenticated ? <Signup /> : <Navigate to={isVerified ? "/" : "/profileSetup"} />
            } />
            <Route path="/about" element={
              <VerifiedUserRoute>
                <About />
              </VerifiedUserRoute>
            } />
            <Route path="/contact" element={
              <VerifiedUserRoute>
                <Contact />
              </VerifiedUserRoute>
            } />
            <Route path="/browse" element={
              <VerifiedUserRoute>
                <Browse />
              </VerifiedUserRoute>
            } />
            <Route path="/listing/:id" element={
              <VerifiedUserRoute>
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <ListingDetail />
                </ProtectedRoute>
              </VerifiedUserRoute>
            } />

            <Route path="/profileSetup" element={
              isAuthenticated
                ? (!isVerified ? (<ProfileSetupForm />) : (<Navigate to="/" />))
                : (<Navigate to="/login" />)
            } />
          </Route>

          {/* Protected route for authenticated users */}
          {
            user
              ?
              (
                user?.role == "user"
                  ? (
                    <Route
                      path="/mySpace"
                      element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                          <VerifiedUserRoute>
                            <Layout showSidebar={true} />
                          </VerifiedUserRoute>
                        </ProtectedRoute>
                      }
                    >
                      <Route index element={
                        isVerified ? <Dashboard /> : <Navigate to="/" />
                      } />
                      <Route path="profile" element={<Profile />} />
                      <Route path="bookmarks" element={<Bookmark />} />
                    </Route>
                  )
                  : (
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                          <VerifiedUserRoute>
                            {
                              isAdmin ? <Layout showSidebar={true} /> : <Navigate to="/" replace />
                            }
                          </VerifiedUserRoute>
                        </ProtectedRoute>
                      }
                    >
                      <Route index element={<AdminPanel />} />
                      <Route path="profile" element={<AdminProfile />} />
                      <Route path="listings" element={<Listings />} />
                      <Route path="reviews" element={<Reviews />} />
                      <Route path="users" element={<Users />} />
                      <Route path="reviewAnalysis" element={<ReviewAnalysis />} />
                    </Route>
                  )
              )
              : (<></>)
          }
        </Routes>
      </Router>

      <ToastContainer position="top-right" autoClose={3000} closeOnClick pauseOnFocusLoss pauseOnHover />
    </div>
  );
}

export default App;
