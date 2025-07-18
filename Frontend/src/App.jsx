import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { ToastContainer } from "react-toastify";
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import About from './pages/About';
import Contact from './pages/Contact';
import Browse from './pages/Browse';
import Navbar from './components/Navbar';
import useTheme from './store/useTheme';

function App() {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen" data-theme={theme}>
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/browse" element={<Browse />} />
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} closeOnClick pauseOnFocusLoss pauseOnHover />
    </div>
  );
}

export default App;
