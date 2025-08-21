// src/components/Navbar.jsx
import { Link, useLocation } from 'react-router';
import useTheme from '../store/useTheme';
import { Sun, Moon, GraduationCap, MenuIcon, ChevronDown } from 'lucide-react'; // Optional icons, install `lucide-react` if needed
import { useState } from 'react';
import useLogout from '../hooks/useLogout';
import useUser from '../hooks/useUser';

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const [menuOpen, setMenuOpen] = useState(false);
    const closeMenu = () => { setMenuOpen(false); }
    const location = useLocation();
    const { logoutMutation, isPending } = useLogout(closeMenu);

    const navLinks = [
        { name: 'Home', to: '/' },
        { name: 'Browse', to: '/browse' },
        { name: 'About', to: '/about' },
        { name: 'Contact', to: '/contact' },
    ];

    const adminPanelOptions = [
        { name: 'Admin Panel', to: '/admin' },
        { name: 'Users', to: '/admin/users' },
        { name: 'Profile', to: '/admin/profile' },
        { name: 'Listings', to: '/admin/listings' },
        { name: 'Reviews', to: '/admin/reviews' },
        // { name: 'Reports', to: '/admin/reports' }
    ]

    const userDashboardOptions = [
        { name: 'Dashboard', to: '/mySpace' },
        { name: 'Profile', to: '/mySpace/profile' },
        { name: 'Bookmarks', to: '/mySpace/bookmarks' },
        { name: 'Price Prediction', to: '/mySpace/pricePrediction' },
    ]

    const { user } = useUser();

    return (
        // For 
        <nav className="navbar bg-base-200/80 backdrop-blur-md shadow-sm lg:px-36 lg:py-4 sticky top-0 transition-all duration-300 z-[10]" data-theme={theme}>
            <div className="flex-1">
                <Link to="/" className="text-xl font-bold ml-4 flex items-center justify-center gap-2">
                    <div className="bg-primary p-2 rounded-lg">
                        <GraduationCap className="size-6 text-white" />
                    </div>
                    CampusConnect
                </Link>
            </div>

            <div className="hidden md:flex gap-2 mr-2">
                {navLinks.map((link, idx) => (
                    <Link
                        key={idx}
                        to={link.to}
                        className={`btn btn-ghost btn-sm ${location.pathname === link.to ? 'text-primary' : ''}`}
                    >
                        {link.name}
                    </Link>
                ))}

                {user ? (
                    <>
                        <div className="dropdown dropdown-end">
                            <button tabIndex={0} role="button" className="btn btn-ghost btn-sm avatar gap-2" onClick={() => setMenuOpen((prev) => !prev)}>
                                <div className="size-5 rounded-full">
                                    <img src={user.profileImage || "/avatar-placeholder.png"} alt="user avatar" />
                                </div>
                                <span className="hidden md:inline font-medium">{user.full_name?.split(" ")[0]}</span>
                            </button>
                            {
                                menuOpen &&
                                <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-40">
                                    {
                                        user.role === "admin"
                                            ? (
                                                <li>
                                                    <Link to="/admin" onClick={closeMenu}
                                                        className={location.pathname == '/admin' ? 'text-primary' : ''}>Admin Panel</Link>
                                                </li>
                                            )
                                            : (
                                                <li>
                                                    <Link to="/mySpace" onClick={closeMenu}
                                                        className={location.pathname == '/mySpace' ? 'text-primary' : ''}>My Space</Link>
                                                </li>
                                            )
                                    }
                                    <li>
                                        <button onClick={() => {
                                            logoutMutation();
                                        }} disabled={isPending}>
                                            {
                                                isPending
                                                    ? (<>
                                                        <span className="loading loading-dots loading-md"></span>
                                                        Logging out...
                                                    </>)
                                                    : ('Logout')
                                            }
                                        </button>
                                    </li>
                                </ul>
                            }
                        </div>
                    </>
                ) : (
                    <>
                        <Link to="/login" className={`btn btn-ghost btn-sm ${location.pathname === "/login" ? 'text-primary' : ''}`}>Login</Link>
                        <Link to="/signup" className={`btn btn-ghost btn-sm ${location.pathname === "/signup" ? 'text-primary' : ''}`}>Signup</Link>
                    </>
                )}

                {/* Theme Toggle Button */}
                <button
                    onClick={toggleTheme}
                    className="btn btn-ghost btn-sm flex items-center gap-2 w-24"
                    aria-label="Toggle Theme"
                >
                    {theme === 'light' ? (
                        <>
                            <Moon className="size-4" />
                            Dark
                        </>
                    ) : (
                        <>
                            <Sun className="size-4" />
                            Light
                        </>
                    )}
                </button>
            </div>

            {/* Mobile Dropdown */}
            <div className="md:hidden dropdown dropdown-end mr-4">
                <button
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-circle"
                    onClick={() => setMenuOpen(prev => !prev)}
                    aria-label="Toggle menu"
                >
                    <MenuIcon className="size-6" />
                </button>

                {menuOpen && (
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 max-h-[80vh] overflow-y-auto"
                    >
                        {/* Main Links (shown to all) */}
                        {navLinks.map((link) => (
                            <li key={link.to}>
                                <Link
                                    to={link.to}
                                    onClick={closeMenu}
                                    // className={`${location.pathname === link.to ? 'active' : ''} transition-colors`}
                                    className={`${location.pathname === link.to ? 'text-primary font-semibold' : ''} transition-colors`}
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}

                        {/* User/Admin Specific Sections */}
                        {user ? (
                            <>
                                {/* ADMIN DROPDOWN */}
                                {user.role === "admin" ? (
                                    <li className="menu-dropdown">
                                        <details open={location.pathname.startsWith('/admin')}>
                                            {/* <summary className={`${location.pathname.startsWith('/admin') ? 'active' : ''} transition-colors`}> */}
                                            <summary className={`${location.pathname.startsWith('/admin') ? 'text-primary font-semibold' : ''} transition-colors`}>
                                                Admin Panel
                                                {/* <ChevronDown className="ml-auto size-4 transform transition-transform duration-200 group-open:rotate-180" /> */}
                                            </summary>
                                            {/* <ul className="bg-base-200/50 rounded-lg"> */}
                                            <ul className="rounded-lg">
                                                {adminPanelOptions.map((item) => (
                                                    <li key={item.to}>
                                                        <Link
                                                            to={item.to}
                                                            onClick={closeMenu}
                                                            // className={`${location.pathname === item.to ? 'active' : ''} transition-colors pl-8`}
                                                            className={`${location.pathname === item.to ? 'text-primary font-semibold' : ''} transition-colors pl-8`}
                                                        >
                                                            {item.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </details>
                                    </li>
                                ) : (
                                    /* USER DROPDOWN */
                                    <li className="menu-dropdown">
                                        <details open={location.pathname.startsWith('/mySpace')}>
                                            {/* <summary className={`${location.pathname.startsWith('/mySpace') ? 'active' : ''} transition-colors`}> */}
                                            <summary className={`${location.pathname.startsWith('/mySpace') ? 'text-primary font-semibold' : ''} transition-colors`}>
                                                My Space
                                                {/* <ChevronDown className="ml-auto size-4 transform transition-transform duration-200 group-open:rotate-180" /> */}
                                            </summary>
                                            <ul className="rounded-lg">
                                                {userDashboardOptions.map((item) => (
                                                    <li key={item.to}>
                                                        <Link
                                                            to={item.to}
                                                            onClick={closeMenu}
                                                            // className={`${location.pathname === item.to ? 'active' : ''} transition-colors pl-8`}
                                                            className={`${location.pathname === item.to ? 'text-primary font-semibold' : ''} transition-colors pl-8`}
                                                        >
                                                            {item.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </details>
                                    </li>
                                )}

                                {/* LOGOUT (shown to both admin & user) */}
                                <li>
                                    <button
                                        onClick={() => {
                                            logoutMutation();
                                            closeMenu();
                                        }}
                                        disabled={isPending}
                                        // className="text-error hover:bg-error/10 transition-colors"
                                        className="transition-colors"
                                    >
                                        {isPending ? (
                                            <span className="loading loading-spinner loading-sm"></span>
                                        ) : 'Logout'}
                                    </button>
                                </li>
                            </>
                        ) : (
                            /* GUEST LINKS */
                            <>
                                <li>
                                    <Link
                                        to="/login"
                                        onClick={closeMenu}
                                        // className={`${location.pathname === '/login' ? 'active' : ''} transition-colors`}
                                        className={`${location.pathname === '/login' ? 'text-primary font-semibold' : ''} transition-colors`}
                                    >
                                        Login
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/signup"
                                        onClick={closeMenu}
                                        // className={`${location.pathname === '/signup' ? 'active' : ''} transition-colors`}
                                        className={`${location.pathname === '/signup' ? 'text-primary font-semibold' : ''} transition-colors`}
                                    >
                                        Signup
                                    </Link>
                                </li>
                            </>
                        )}

                        {/* THEME TOGGLE (shown to all) */}
                        <li>
                            <button
                                onClick={() => {
                                    toggleTheme();
                                    closeMenu();
                                }}
                                className="flex items-center gap-2 transition-colors"
                            >
                                {theme === 'light' ? (
                                    <>
                                        <Moon className="size-4" />
                                        Dark Mode
                                    </>
                                ) : (
                                    <>
                                        <Sun className="size-4" />
                                        Light Mode
                                    </>
                                )}
                            </button>
                        </li>
                    </ul>
                )}
            </div>
        </nav>
    );
};

export default Navbar;