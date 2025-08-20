// Sidebar.jsx
import { NavLink } from "react-router";
import useUser from '../hooks/useUser';

const Sidebar = () => {
    const { user } = useUser();
    
    const adminPanelOptions = [
        { name: 'Admin Dashboard', to: '/admin', end: true },
        { name: 'Users', to: '/admin/users' },
        { name: 'Profile', to: '/admin/profile' },
        { name: 'Listings', to: '/admin/listings' },
        { name: 'Reviews', to: '/admin/reviews' },
        { name: 'ReviewAnalysis', to: '/admin/reviewAnalysis' }
    ];

    const userDashboardOptions = [
        { name: 'Dashboard', to: '/mySpace', end: true },
        { name: 'Profile', to: '/mySpace/profile' },
        { name: 'Bookmarks', to: '/mySpace/bookmarks' },
    ];

    const options = user?.role === "admin" ? adminPanelOptions : userDashboardOptions;

    return (
        <div className="hidden md:block w-64 bg-base-100 p-4 border-r border-r-primary min-h-full sticky top-0 overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-8 pl-2">
                <NavLink
                    to={user?.role === "admin" ? "/admin" : "/mySpace"}
                    end
                    // className={({ isActive }) => isActive ? "text-primary" : ""}
                    className=""
                >
                    {user?.role === "admin" ? "Admin Panel" : "My Space"}
                </NavLink>
            </h2>
            <ul className="space-y-3">
                {options.map((opt, idx) => (
                    <li key={idx}>
                        <NavLink
                            end={opt.end || false}
                            to={opt.to}
                            className={({ isActive }) =>
                                `block px-4 py-3 rounded-lg transition-all ${isActive ?
                                    "bg-primary/10 text-primary font-semibold border-l-4 border-primary" :
                                    "hover:bg-base-200 hover:pl-6"}`}
                        >
                            {opt.name}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;