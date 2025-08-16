import { BarChart, PieChart, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Line, Pie, Cell, ResponsiveContainer } from 'recharts';
import { getAdminStats, getListingsGrowthStats, getRecentReviews, getRecentUsers, getReviewsGrowthStats, getUsersGrowthStats } from '../../lib/api';
import { useEffect, useState } from 'react';
import useUser from '../../hooks/useUser';
import UserGrowthCard from '../../components/cards/Admin/UserGrowthCard';
import ListingGrowthCard from '../../components/cards/Admin/ListingsGrowthCard';
import ReviewStatsCard from '../../components/cards/Admin/ReviewStatsCard';
import AdminListingsCard from '../../components/cards/Admin/AdminStatsCard';
import { useNavigate } from 'react-router';
import { CATEGORY_CHOICES } from '../../constants/constants';
import { MapPin, StarIcon, UserX } from 'lucide-react';
import PieChartCategoryWise from '../../components/charts/Admin/PieChartCategoryWise';
import BarChartStateWise from '../../components/charts/Admin/BarChartStateWise';

const AdminPanel = () => {
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
    const [recentUsers, setRecentUsers] = useState([]);

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

    const fetchRecentUsers = async () => {
        try {
            const data = await getRecentUsers();
            setRecentUsers(data);
        } catch (error) {
            console.error("Failed to fetch recentUsers:", error);
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

    const Chart_Colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28BFE'];

    const getCategoryLabel = (category) => {
        return CATEGORY_CHOICES.find(([value]) => value === category)?.[1] || category;
    };

    useEffect(() => {
        fetchUsersGrowthStats();
        fetchListingsGrowthStats();
        fetchReviewsGrowthStats();
        fetchAdminStats();
        fetchRecentReviews();
        fetchRecentUsers();
    }, []);

    if (isLoading) return <PageLoader />;
    // console.log(listingsGrowthStats);
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
                                                    <td>{getCategoryLabel(listing.category)}</td>
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
                                {
                                    recentUsers.length > 0 ? (
                                        recentUsers.map((user) => {
                                            const colorIndex = user.full_name.charCodeAt(0) % colors.length;
                                            const avatarColor = colors[colorIndex];
                                            return <div key={user.id} className="border-b border-base-200 flex items-center gap-3 p-3 hover:bg-base-200 rounded-xl transition-all cursor-pointer group">
                                                <div className="avatar placeholder">
                                                    <div className={`${avatarColor} text-white rounded-full w-12 h-12 group-hover:opacity-90 transition-opacity`}>
                                                        <span className="text-lg font-medium">{getInitials(user.full_name)}</span>
                                                    </div>
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start gap-2">
                                                        <div>
                                                            <p className="font-bold text-gray-400 truncate">{user.full_name}</p>
                                                            <p className="text-sm text-gray-500">{user.email}</p>
                                                        </div>
                                                        <span className="text-sm text-gray-400 whitespace-nowrap">
                                                            {user.time_ago}
                                                        </span>
                                                    </div>

                                                    <div className="mt-1 flex items-center gap-2">
                                                        <MapPin className="size-4" />
                                                        <span className="text-xs text-gray-500 truncate">
                                                            {user.city}, {user.state}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        })
                                    ) : (
                                        <div className="text-center py-6">
                                            <div className="inline-flex items-center justify-center w-14 h-14 bg-base-200 rounded-full mb-3">
                                                <UserX className="w-6 h-6 text-gray-400" strokeWidth={3} />
                                            </div>
                                            <h4 className="font-medium text-gray-600">No Users Found!!</h4>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>

                    {/* Pending Reviews Card */}
                    <div className="card bg-base-100 shadow">
                        <div className="card-body">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="card-title text-lg">Pending Reviews</h2>
                                <button className="btn btn-sm btn-primary" onClick={() => handleNavigate("reviews")}>View all</button>
                            </div>
                            <div className="space-y-4">
                                {recentReviews.length > 0 ? recentReviews.map((review) => {
                                    const colorIndex = review.user_full_name.charCodeAt(0) % colors.length;
                                    const avatarColor = colors[colorIndex];
                                    return <div key={review.id} className="border-b border-base-200 p-3 last:border-0 cursor-pointer hover:bg-base-200 transition-all rounded-xl">
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <div className="avatar placeholder flex-shrink-0">
                                                    <div className={`${avatarColor} text-white rounded-full w-12 h-12 group-hover:opacity-90 transition-opacity`}>
                                                        <span className="text-lg font-medium">{getInitials(review.user_full_name)}</span>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-2">
                <PieChartCategoryWise listingsGrowthStats={listingsGrowthStats}/>

                <BarChartStateWise listingsGrowthStats={listingsGrowthStats}/>
            </div>
        </div >
    );
};

export default AdminPanel;