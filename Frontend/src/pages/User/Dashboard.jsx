import React, { useEffect, useState } from "react";
import { getUserDetails, getUserReviewCount, getUserBookmarkCount, fetchRecentBookmarks, getUserReviews, fetchRecommendedListings } from "../../lib/api";
import { Link } from "react-router";
import ListingCard from "../../components/ListingCard";
import { Bookmark, Star, User, Mail, MapPin, Clock, ChevronRight, Home, ThumbsUp } from "lucide-react";

function Dashboard() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviewCount, setReviewCount] = useState(0);
    const [bookmarkCount, setBookmarkCount] = useState(0);
    const [recentBookmarks, setRecentBookmarks] = useState([]);
    const [userReviews, setUserReviews] = useState([]);
    const [recommended, setRecommended] = useState([]);
    
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            
            const data = await getUserDetails();
            if (data) setUser(data);
            
            const reviews = await getUserReviewCount();
            setReviewCount(reviews);
            
            const bookmarks = await getUserBookmarkCount();
            setBookmarkCount(bookmarks);
            
            const recent = await fetchRecentBookmarks();
            setRecentBookmarks(recent);
            
            const user_reviews = await getUserReviews();
            setUserReviews(user_reviews);
            
            const recommended_listings = await fetchRecommendedListings();
            setRecommended(recommended_listings);
            
            setLoading(false);
        };
        fetchData();
    }, []);
    
    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
    );

    return (
        <div className="container mx-auto px-4 md:px-6 py-8 space-y-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center text-primary">
                User Dashboard
            </h2>

            {/* User Profile Section */}
            {user && (
                <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow max-w-2xl mx-auto">
                    <div className="card-body">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="avatar placeholder">
                                <div className="bg-neutral text-neutral-content rounded-full w-16">
                                    <span className="text-xl">{user.full_name.charAt(0)}</span>
                                </div>
                            </div>
                            <div>
                                <h3 className="card-title text-2xl">Welcome, {user.full_name}!</h3>
                                <p className="text-sm text-gray-500">Member since {new Date(user.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                                <Mail className="w-5 h-5 text-gray-500" />
                                <span>{user.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-gray-500" />
                                <span>
                                    {user.preferred_city || "N/A"}, {user.preferred_state || "N/A"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <div className="stats bg-primary text-primary-content shadow-lg hover:shadow-xl transition-shadow">
                    <div className="stat">
                        <div className="stat-figure text-primary-content">
                            <Star className="w-8 h-8" />
                        </div>
                        <div className="stat-title text-primary-content">Total Reviews</div>
                        <div className="stat-value text-primary-content">{reviewCount}</div>
                        <div className="stat-desc text-primary-content">Your contributions</div>
                    </div>
                </div>
                
                <div className="stats bg-secondary text-secondary-content shadow-lg hover:shadow-xl transition-shadow">
                    <div className="stat">
                        <div className="stat-figure text-secondary-content">
                            <Bookmark className="w-8 h-8" />
                        </div>
                        <div className="stat-title text-secondary-content">Total Bookmarks</div>
                        <div className="stat-value text-secondary-content">{bookmarkCount}</div>
                        <div className="stat-desc text-secondary-content">Saved places</div>
                    </div>
                </div>
            </div>

            {/* Recent Bookmarks Section */}
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                        <Bookmark className="w-6 h-6 text-accent" />
                        Recent Bookmarks
                    </h3>
                    <Link to="/mySpace/bookmarks" className="btn btn-sm btn-outline">
                        View All <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
                
                {recentBookmarks.length === 0 ? (
                    <div className="alert alert-info shadow-lg">
                        <div>
                            <Bookmark className="w-6 h-6" />
                            <span>No recent bookmarks yet.</span>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recentBookmarks.map((b) => (
                            <div key={b.id} className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow">
                                <div className="card-body">
                                    <h3 className="card-title line-clamp-1">{b.listing_info.title}</h3>
                                    <p className="flex items-center gap-1 text-sm">
                                        <MapPin className="w-4 h-4" />
                                        {b.listing_info.city}, {b.listing_info.state}
                                    </p>
                                    <div className="card-actions justify-between items-center mt-2">
                                        <div className="badge badge-outline flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {new Date(b.created_at).toLocaleDateString()}
                                        </div>
                                        <Link to={`/listing/${b.listing_info.id}`} className="btn btn-xs btn-primary">
                                            View
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Reviews Section */}
            <div className="max-w-6xl mx-auto">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Star className="w-6 h-6 text-accent" />
                    Listings You Reviewed
                </h3>
                {userReviews.length === 0 ? (
                    <div className="alert alert-warning shadow-lg">
                        <div>
                            <Star className="w-6 h-6" />
                            <span>You haven't reviewed any listings yet.</span>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {userReviews.map((r) => (
                            <ListingCard listing={r.listing} key={r.listing.id} />
                        ))}
                    </div>
                )}
            </div>

            {/* Recommended Section */}
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                        <ThumbsUp className="w-6 h-6 text-accent" />
                        Recommended For You
                    </h3>
                    <Link to="/browse" className="btn btn-sm btn-outline">
                        Browse All <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
                
                {recommended.length === 0 ? (
                    <div className="alert alert-info shadow-lg">
                        <div>
                            <Home className="w-6 h-6" />
                            <span>No recommendations available yet.</span>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {recommended.map(listing => (
                            <ListingCard listing={listing} key={listing.id} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;