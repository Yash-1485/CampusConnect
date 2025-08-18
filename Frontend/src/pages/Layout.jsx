import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router';

const Layout = ({ showSidebar = false }) => {
    // const location = useLocation();

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <div className="flex flex-1">
                {showSidebar && (
                    <Sidebar />
                )}
                {/* <main className="flex-1 p-4 bg-base-200 overflow-y-auto"> */}
                <main className="flex-1 bg-base-200 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
            {
                !showSidebar && <Footer />
            }
        </div>
    );
};

export default Layout;
