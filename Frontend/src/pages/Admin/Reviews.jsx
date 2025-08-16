import React, { useEffect, useState } from "react";
import { fetchAllReviews } from "../../lib/api";
import { FaStar } from "react-icons/fa";
import axiosInstance from "../../lib/axios";

function Reviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        username: "",
        listing_title: "",
        rating: ""
    });

    const loadReviews = async () => {
        setLoading(true);
        const cleanFilters = {};
        Object.keys(filters).forEach((key) => {
            if (filters[key] !== "" && filters[key] !== null && filters[key] !== undefined) {
                cleanFilters[key] = filters[key];
            }
        });

        const data = await fetchAllReviews(cleanFilters);
        if (data && data.reviews) {
            setReviews(data.reviews);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadReviews();
    }, [filters]);

    const approveReview = async (id) => {
        try {
            const response = await axiosInstance.patch(`/reviews/admin/${id}/approve/`, {
                is_approved: true,
            });
            if (response.data.success) {
                setReviews((prev) =>
                    prev.map((r) =>
                        r.id === id ? { ...r, is_approved: true } : r
                    )
                );
            }
        } catch (error) {
            console.error("Error approving review:", error);
        }
    };

    return (
        <div className="container mx-auto px-6 py-10">
            <h2 className="text-3xl font-bold mb-6">Listing Reviews</h2>

            <div className="bg-base-200 dark:bg-base-800 p-4 rounded-lg mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium">Username</label>
                        <input
                            type="text"
                            value={filters.username}
                            onChange={(e) => setFilters({ ...filters, username: e.target.value })}
                            className="input input-bordered w-full"
                            placeholder="e.g. johndoe"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium">Listing Title</label>
                        <input
                            type="text"
                            value={filters.listing_title}
                            onChange={(e) => setFilters({ ...filters, listing_title: e.target.value })}
                            className="input input-bordered w-full"
                            placeholder="e.g. Cozy Apartment"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium">Rating</label>
                        <select
                            value={filters.rating}
                            onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
                            className="select select-bordered w-full"
                        >
                            <option value="">Any</option>
                            <option value="1.0">1 ★ & above</option>
                            <option value="2.0">2 ★ & above</option>
                            <option value="3.0">3 ★ & above</option>
                            <option value="4.0">4 ★ & above</option>
                            <option value="5.0">5 ★ only</option>
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="bg-base-100 dark:bg-base-900 rounded-xl p-6 shadow-lg flex flex-col"
                        >
                            <div className="flex items-center mb-2">
                                {Array(5)
                                    .fill(0)
                                    .map((_, idx) => (
                                        <FaStar
                                            key={idx}
                                            className={`text-yellow-400 ${idx < review.rating ? "opacity-100" : "opacity-30"
                                                }`}
                                        />
                                    ))}
                            </div>

                            <p className="text-sm mb-4">"{review.comment}"</p>
                            <p className="font-semibold">{review.user.username}</p>
                            <p className="text-xs opacity-70">{review.listing.title}</p>
                            <p className="text-xs opacity-50">
                                {new Date(review.created_at).toLocaleString()}
                            </p>

                            {!review.is_approved && (
                                <button
                                    className="btn btn-sm mt-4 bg-green-500 text-white hover:bg-green-600"
                                    onClick={() => approveReview(review.id)}
                                >
                                    Approve
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Reviews;