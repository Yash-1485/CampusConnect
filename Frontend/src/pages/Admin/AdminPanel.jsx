import { BarChart, PieChart, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Line, Pie, Cell } from 'recharts';
import { getAdminStats, getListingsGrowthStats, getRecentReviews, getReviewsGrowthStats, getUsersGrowthStats } from '../../lib/api';
import { useEffect, useState } from 'react';
import useUser from '../../hooks/useUser';
import UserGrowthCard from '../../components/cards/Admin/UserGrowthCard';
import ListingGrowthCard from '../../components/cards/Admin/ListingsGrowthCard';
import ReviewStatsCard from '../../components/cards/Admin/ReviewStatsCard';
import AdminListingsCard from '../../components/cards/Admin/AdminStatsCard';
import { useNavigate } from 'react-router';
import { CATEGORY_CHOICES } from '../../constants/constants';
import { StarIcon } from 'lucide-react';

const AdminPanel = () => {
    // Sample data for charts
    const revenueData = [
        { name: 'Jan', revenue: 0.8 },
        { name: 'Feb', revenue: 0.9 },
        { name: 'Mar', revenue: 1.0 },
        { name: 'Apr', revenue: 1.1 },
        { name: 'May', revenue: 1.2 },
        { name: 'Jun', revenue: 1.21 },
    ];

    const userGrowthData = [
        { name: 'Jan', users: 1800 },
        { name: 'Feb', users: 2100 },
        { name: 'Mar', users: 2300 },
        { name: 'Apr', users: 2500 },
        { name: 'May', users: 2700 },
        { name: 'Jun', users: 2847 },
    ];

    const categoryDistribution = [
        { name: 'PG', value: 45 },
        { name: 'Tiffin', value: 30 },
        { name: 'Tutor', value: 25 },
    ];

    // Navigation
    const navigate = useNavigate();

    const handleNavigate = (route = "/admin") => {
        navigate(route);
    };

    // States
    const { user, isLoading } = useUser();
    const [userGrowthStats, setUserGrowthStats] = useState([]);
    const [listingsGrowthStats, setListingsGrowthStats] = useState([]);
    const [reviewsGrowthStats, setReviewsGrowthStats] = useState([]);
    const [adminStats, setAdminStats] = useState([]);
    const [recentReviews, setRecentReviews] = useState([]);

    // Fetch all growth stats
    const fetchUsersGrowthStats = async () => {
        try {
            const data = await getUsersGrowthStats();
            setUserGrowthStats(data);
        } catch (error) {
            console.error("Failed to fetch usersStats:", error);
        }
    };

    const fetchListingsGrowthStats = async () => {
        try {
            const data = await getListingsGrowthStats();
            setListingsGrowthStats(data);
        } catch (error) {
            console.error("Failed to fetch listingStats:", error);
        }
    };

    const fetchReviewsGrowthStats = async () => {
        try {
            const data = await getReviewsGrowthStats();
            setReviewsGrowthStats(data);
        } catch (error) {
            console.error("Failed to fetch reviewStats:", error);
        }
    };

    const fetchAdminStats = async () => {
        try {
            const data = await getAdminStats();
            setAdminStats(data);
        } catch (error) {
            console.error("Failed to fetch adminStats:", error);
        }
    };

    const fetchRecentReviews = async () => {
        try {
            const data = await getRecentReviews();
            setRecentReviews(data);
        } catch (error) {
            console.error("Failed to fetch recentReviews:", error);
        }
    };

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    };

    const colors = [
        'bg-primary text-primary-content',
        'bg-secondary text-secondary-content',
        'bg-accent text-accent-content',
        'bg-info text-info-content',
        'bg-success text-success-content',
        'bg-warning text-warning-content',
        'bg-error text-error-content'
    ];

    useEffect(() => {
        fetchUsersGrowthStats();
        fetchListingsGrowthStats();
        fetchReviewsGrowthStats();
        fetchAdminStats();
        fetchRecentReviews();
    }, []);

    if (isLoading) return <PageLoader />;

    return (
        <div className="p-6 bg-base-200 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <p className="text-lg mb-8">Manage your Campus Connect platform efficiently</p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <UserGrowthCard userGrowthStats={userGrowthStats} />

                <ListingGrowthCard listingsGrowthStats={listingsGrowthStats} />

                <ReviewStatsCard reviewsGrowthStats={reviewsGrowthStats} />

                <AdminListingsCard adminStats={adminStats} />
                {/* We can put here total no. of site views too */}
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 gap-6 mb-8">
                {/* Recent Listings - Full width column */}
                <div className="">
                    <div className="card bg-base-100 shadow">
                        <div className="card-body">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="card-title text-lg">Recent Listings</h2>
                                <button className="btn btn-sm btn-primary" onClick={() => handleNavigate("listings")}>View all</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="table table-zebra">
                                    <thead>
                                        <tr>
                                            <th className="font-semibold">Title</th>
                                            <th className="font-semibold">Category</th>
                                            <th className="font-semibold">Location</th>
                                            <th className="font-semibold">Price</th>
                                            <th className="font-semibold">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {adminStats?.recentListings?.length > 0 ? (
                                            adminStats.recentListings.map((listing) => (
                                                <tr key={listing.id}>
                                                    <td className="font-medium">{listing.title}</td>
                                                    <td>{CATEGORY_CHOICES.find(([value]) => value === listing.category)?.[1] || 'N/A'}</td>
                                                    <td>{listing.city}, {listing.state}</td>
                                                    <td className="font-medium">{listing.price ? `₹ ${listing.price.toLocaleString()}/-` : 'N/A'}</td>
                                                    <td>
                                                        <span className={`badge ${listing.availability === true ? 'badge-success' : 'badge-warning'}`}>
                                                            {listing.availability ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="text-center py-4 text-gray-500">
                                                    No listings Added Yet
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Users & Reviews - Side by side in one column */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Users Card */}
                    <div className="card bg-base-100 shadow">
                        <div className="card-body">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="card-title text-lg">Recent Users</h2>
                                <button className="btn btn-sm btn-primary" onClick={() => handleNavigate("users")}>View all</button>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3 p-2 hover:bg-base-200 rounded-lg transition-colors">
                                    <div className="avatar placeholder">
                                        <div className="bg-primary text-primary-content rounded-full w-10">
                                            <span>PS</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-bold">Priya Sharma</p>
                                        <p className="text-sm opacity-70">2 days ago</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-2 hover:bg-base-200 rounded-lg transition-colors">
                                    <div className="avatar placeholder">
                                        <div className="bg-secondary text-secondary-content rounded-full w-10">
                                            <span>RK</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-bold">Rahul Kumar</p>
                                        <p className="text-sm opacity-70">3 days ago</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-2 hover:bg-base-200 rounded-lg transition-colors">
                                    <div className="avatar placeholder">
                                        <div className="bg-accent text-accent-content rounded-full w-10">
                                            <span>AP</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-bold">Ananya Patel</p>
                                        <p className="text-sm opacity-70">5 days ago</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pending Reviews Card */}
                    <div className="card bg-base-100 shadow">
                        <div className="card-body">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="card-title text-lg mb-4">Pending Reviews</h2>
                                <button className="btn btn-sm btn-primary" onClick={() => handleNavigate("reviews")}>View all</button>
                            </div>
                            <div className="space-y-4">
                                {recentReviews.length > 0 ? recentReviews.map((review) => {
                                    const colorIndex = review.user_full_name.charCodeAt(0) % colors.length;
                                    const avatarColor = colors[colorIndex];
                                    return <div key={review.id} className="border-b border-base-200 pb-3 last:border-0">
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <div className="avatar placeholder flex-shrink-0">
                                                    <div className={`${avatarColor} text-primary-content rounded-full w-8 h-8`}>
                                                        <span className="text-sm">{getInitials(review.user_full_name)}</span>
                                                    </div>
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold truncate">{review.user_full_name}</p>
                                                    <div className="flex items-center gap-3">
                                                        <StarIcon className="w-3 h-3 text-yellow-400 fill-current" />
                                                        <span className="text-xs font-medium">{review.rating.toFixed(1)}</span>
                                                        <span className="text-xs opacity-70">{review.time_ago}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <span className={`badge ${review.is_approved ? 'badge-success' : 'badge-warning'} badge`}>
                                                {review.is_approved ? '✓' : 'Pending'}
                                            </span>
                                        </div>

                                        <div className="mt-1 pl-10">
                                            {/* <p className="text-sm font-semibold truncate">{review.listing_title}</p> */}
                                            <p className="text-sm text-gray-600 italic truncate">"{review.comment}"</p>
                                        </div>
                                    </div>
                                }) : (
                                    <div className="text-center py-6">
                                        <div className="inline-flex items-center justify-center w-14 h-14 bg-base-200 rounded-full mb-3">
                                            {/* <ChatBubbleIcon className="w-6 h-6 text-gray-400" /> */}
                                        </div>
                                        <h4 className="font-medium text-gray-600">No reviews pending</h4>
                                        <p className="text-sm text-gray-500 mt-1">All caught up!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="card bg-base-100 shadow">
                    <div className="card-body">
                        <h2 className="card-title">Revenue Growth</h2>
                        <div className="h-64">
                            <LineChart
                                width={500}
                                height={250}
                                data={revenueData}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
                            </LineChart>
                        </div>
                    </div>
                </div>

                <div className="card bg-base-100 shadow">
                    <div className="card-body">
                        <h2 className="card-title">User Growth</h2>
                        <div className="h-64">
                            <BarChart
                                width={500}
                                height={250}
                                data={userGrowthData}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="users" fill="#82ca9d" />
                            </BarChart>
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Distribution */}
            <div className="card bg-base-100 shadow">
                <div className="card-body">
                    <h2 className="card-title">Listing Category Distribution</h2>
                    <div className="flex justify-center h-64">
                        <PieChart width={400} height={300}>
                            <Pie
                                data={categoryDistribution}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                                {categoryDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28'][index % 3]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;