// Sidebar.jsx
import { NavLink } from "react-router";

const Sidebar = () => {

    const adminPanelOptions = [
        { name: 'Admin Panel', to: '/admin' },
        { name: 'Users', to: '/admin/users' },
        { name: 'Profile', to: '/admin/profile' },
        { name: 'Listings', to: '/admin/listings' },
        { name: 'Reviews', to: '/admin/reviews' },
        { name: 'Reports', to: '/admin/reports' }
    ]

    const userDashboardOptions = [
        { name: 'Dashboard', to: '/mySpace' },
        { name: 'Profile', to: '/mySpace/profile' },
        { name: 'Bookmarks', to: '/mySpace/bookmarks' },
        { name: 'Roommate Finder', to: '/mySpace/roommates' }
    ]

    return (
        <div className="hidden md:block w-64 bg-base-100 p-4 border-r border-r-primary min-h-full sticky top-0 overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-8 pl-2">
                <NavLink
                    to="/mySpace"
                    end
                    className={({ isActive }) => isActive ? "cursor-pointer" : "cursor-pointer"}
                >
                    My Space
                </NavLink>
            </h2>
            <ul className="space-y-3">
                <li>
                    <NavLink
                        to="/mySpace"
                        end
                        className={({ isActive }) =>
                            `block px-4 py-3 rounded-lg transition-all ${isActive ?
                                "bg-primary/10 text-primary font-semibold border-l-4 border-primary" :
                                "hover:bg-base-200 hover:pl-6"}`}
                    >
                        Dashboard
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/mySpace/profile"
                        className={({ isActive }) =>
                            `block px-4 py-3 rounded-lg transition-all ${isActive ?
                                "bg-primary/10 text-primary font-semibold border-l-4 border-primary" :
                                "hover:bg-base-200 hover:pl-6"}`}
                    >
                        Profile
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/mySpace/bookmarks"
                        className={({ isActive }) =>
                            `block px-4 py-3 rounded-lg transition-all ${isActive ?
                                "bg-primary/10 text-primary font-semibold border-l-4 border-primary" :
                                "hover:bg-base-200 hover:pl-6"}`}
                    >
                        Bookmarks
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/mySpace/roommates"
                        className={({ isActive }) =>
                            `block px-4 py-3 rounded-lg transition-all ${isActive ?
                                "bg-primary/10 text-primary font-semibold border-l-4 border-primary" :
                                "hover:bg-base-200 hover:pl-6"}`}
                    >
                        Roommate Finder
                    </NavLink>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;