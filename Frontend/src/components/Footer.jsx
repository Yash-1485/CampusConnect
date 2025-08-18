import { Link } from 'react-router';
import useUser from '../hooks/useUser';
import { Facebook, Twitter, Instagram, Linkedin, GraduationCap } from 'lucide-react';

const Footer = () => {
    const { user } = useUser();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gradient-to-r from-base-200 via-base-300 to-base-200 dark:from-base-900 dark:via-base-800 dark:to-base-900 text-base-content dark:text-gray-400 py-10 border-t border-base-300">
            <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-start gap-8">

                <div className="flex flex-col items-center md:items-start">
                    <Link to="/" className="text-2xl font-bold flex items-center gap-2 mb-2">
                        <div className="bg-primary p-2 rounded-lg">
                            <GraduationCap className="size-6 text-white" />
                        </div>
                        CampusConnect
                    </Link>
                    <p className="text-center md:text-left text-sm max-w-xs">
                        Connecting students with the best campus opportunities.
                    </p>

                    <div className="flex gap-3 mt-3">
                        <a href="" className="hover:text-primary transition-colors"><Facebook className="size-5" /></a>
                        <a href="" className="hover:text-primary transition-colors"><Twitter className="size-5" /></a>
                        <a href="" className="hover:text-primary transition-colors"><Instagram className="size-5" /></a>
                        <a href="" className="hover:text-primary transition-colors"><Linkedin className="size-5" /></a>
                    </div>
                </div>

                <div className="flex flex-col items-center md:items-start gap-2">
                    <h4 className="font-semibold mb-2">Quick Links</h4>
                    <Link to="/" className="hover:text-primary transition transform hover:scale-105">Home</Link>
                    <Link to="/browse" className="hover:text-primary transition transform hover:scale-105">Browse</Link>
                    <Link to="/about" className="hover:text-primary transition transform hover:scale-105">About</Link>
                    <Link to="/contact" className="hover:text-primary transition transform hover:scale-105">Contact</Link>
                </div>

                <div className="flex flex-col items-center md:items-start gap-2">
                    <h4 className="font-semibold mb-2">Easily find your</h4>
                    <p className="hover:text-primary transition transform hover:scale-105">PG</p>
                    <p className="hover:text-primary transition transform hover:scale-105">Hostel</p>
                    <p className="hover:text-primary transition transform hover:scale-105">Mess</p>
                    <p className="hover:text-primary transition transform hover:scale-105">Tiffin Service</p>
                    <p className="hover:text-primary transition transform hover:scale-105">Tutors</p>
                </div>

                <div className="flex flex-col items-center md:items-start gap-2">
                    <h4 className="font-semibold mb-2">Account</h4>
                    <Link to="/login" className="hover:text-primary transition transform hover:scale-105">Login</Link>
                    <Link to="/signup" className="hover:text-primary transition transform hover:scale-105">Signup</Link>
                    <Link
                        to={user ? "/mySpace" : "/login"}
                        className="hover:text-primary transition transform hover:scale-105"
                    >
                        Dashboard
                    </Link>
                </div>

            </div>

            <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                &copy; {currentYear} CampusConnect. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;