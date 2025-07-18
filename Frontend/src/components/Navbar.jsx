// src/components/Navbar.jsx
import { Link, useLocation } from 'react-router';
import useTheme from '../store/useTheme';
import { Sun, Moon, GraduationCap, MenuIcon } from 'lucide-react'; // Optional icons, install `lucide-react` if needed
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

    const {data: user } = useUser();
    console.log(user)

    return (
        <nav className="navbar bg-base-200/80 backdrop-blur-md shadow-sm lg:px-36 lg:py-4 sticky top-0 transition-all duration-300" data-theme={theme}>
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

                {/* We did it before */}
                {/* User Dropdown */}
                {/* {!user &&
                    <>
                        <Link to="/login" className={`btn btn-ghost btn-sm ${location.pathname === "/login" ? 'text-primary' : ''}`}>Login</Link>
                        <Link to="/signup" className={`btn btn-ghost btn-sm ${location.pathname === "/signup" ? 'text-primary' : ''}`}>Signup</Link>
                    </>
                } */}

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
                                    <li>
                                        <Link to="/dashboard" onClick={closeMenu}
                                            className={location.pathname == '/dashboard' ? 'text-primary' : ''}>Dashboard</Link>
                                    </li>
                                    <li>
                                        <Link to="/profile" onClick={closeMenu}
                                            className={location.pathname == '/profile' ? 'text-primary' : ''}>Profile</Link>
                                    </li>
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
                <button tabIndex={0} role="button" className="btn btn-ghost btn-circle" onClick={() => { setMenuOpen((prev) => !prev) }}>
                    <MenuIcon className="size-6" />
                </button>
                {menuOpen &&
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        {navLinks.map((link, idx) => (
                            <li key={idx}>
                                <Link
                                    to={link.to}
                                    onClick={closeMenu}
                                    className={location.pathname === link.to ? 'text-primary font-semibold' : ''}
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}

                        {user ? (
                            <>
                                <li>
                                    <Link to="/dashboard"
                                        onClick={closeMenu}
                                        className={location.pathname == '/dashboard' ? 'text-primary' : ''}>Dashboard</Link>
                                </li>
                                <li>
                                    <Link to="/profile"
                                        onClick={closeMenu}
                                        className={location.pathname == '/profile' ? 'text-primary' : ''}>Profile</Link>
                                </li>
                                <li>
                                    <button
                                        onClick={() => {
                                            logoutMutation();
                                            closeMenu();
                                        }}
                                        disabled={isPending}
                                    >
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
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link to="/login" onClick={closeMenu} className={location.pathname === "/login" ? "text-primary font-semibold" : ""}>Login</Link>
                                </li>
                                <li>
                                    <Link to="/signup" onClick={closeMenu} className={location.pathname === "/signup" ? "text-primary font-semibold" : ""}>Signup</Link>
                                </li>
                            </>
                        )}

                        <li>
                            <button
                                onClick={() => {
                                    toggleTheme();
                                    closeMenu();
                                }}
                                className="flex items-center gap-2"
                                aria-label="Toggle Theme"
                            >
                                {theme === 'light' ? <Moon className="size-4" /> : <Sun className="size-4" />}
                                {theme === 'light' ? 'Dark' : 'Light'}
                            </button>
                        </li>
                    </ul>
                }
            </div>
        </nav>
    );
};

export default Navbar;