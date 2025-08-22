import { MessageSquare, Star, ChevronDown, ChevronUp, Check } from "lucide-react";
import { useState } from "react";
import useSubmitReview from "../../hooks/useSubmitReview";
import useReviews from "../../hooks/useReviews";
import useAuth from "../../hooks/useAuth";

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

const ReviewsCard = ({ listing, isFoodService }) => {
    const { user } = useAuth();
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewText, setReviewText] = useState("");
    const [reviewRating, setReviewRating] = useState(5);
    const [showAllReviews, setShowAllReviews] = useState(false);
    const reviewsToShow = 3;

    // hooks
    const { reviews: reviewsData, isLoading } = useReviews(listing.id);
    const { submitReviewMutation, isPending } = useSubmitReview();

    // Check if current user has already reviewed this listing
    const hasUserReviewed = user && reviewsData?.reviews?.some(
        review => review.user.id === user.id
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        submitReviewMutation({
            review: {
                user: user?.id,
                listing: listing.id,
                rating: reviewRating,
                comment: reviewText,
            }
        });

        setReviewText("");
        setReviewRating(5);
        setShowReviewForm(false);
    };

    // Get color for avatar based on user initials
    const getAvatarColor = (name) => {
        const hash = name.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
        return colors[hash % colors.length];
    };

    return (
        <div className="bg-base-100 p-6 rounded-xl shadow-sm border border-base-200">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Star className="text-yellow-500 fill-current" size={20} />
                    Reviews {reviewsData?.reviews?.length > 0 && `(${reviewsData.reviews.length})`}
                </h2>
                {user && user?.role==="user" && !hasUserReviewed && (
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={() => setShowReviewForm(!showReviewForm)}
                        disabled={hasUserReviewed}
                    >
                        {showReviewForm ? "Cancel" : "Add Review"}
                    </button>
                )}
                {user?.role==="user" && hasUserReviewed && (
                    <button className="btn btn-sm btn-disabled" disabled>
                        Already Reviewed
                    </button>
                )}
            </div>

            {/* Review Form */}
            {showReviewForm && (
                <form onSubmit={handleSubmit} className="mb-8 p-4 bg-base-200 rounded-lg border border-base-300">
                    <div className="flex items-center mb-4">
                        <span className="mr-2 font-medium">Your Rating:</span>
                        <div className="rating rating-md">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <input
                                    key={star}
                                    type="radio"
                                    name="rating"
                                    className="mask mask-star-2 bg-orange-400"
                                    checked={reviewRating === star}
                                    onChange={() => setReviewRating(star)}
                                />
                            ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-500">{reviewRating} star{reviewRating !== 1 ? 's' : ''}</span>
                    </div>
                    <textarea
                        className="textarea textarea-bordered w-full mb-4 focus:border-primary focus:ring-1 focus:ring-primary"
                        placeholder={`Share your experience with this ${isFoodService ? "food service" : "place"}...`}
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        rows={4}
                        required
                    />
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="btn btn-primary px-8"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <span className="loading loading-spinner"></span>
                            ) : "Submit Review"}
                        </button>
                    </div>
                </form>
            )}

            {/* Reviews List */}
            {isLoading ? (
                <div className="flex justify-center py-12">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            ) : reviewsData?.reviews?.length > 0 ? (
                <div className="space-y-6">
                    {(showAllReviews ? reviewsData.reviews : reviewsData.reviews.slice(0, reviewsToShow)).map((review) => (
                        <div
                            key={review.id}
                            className="p-4 rounded-lg bg-base-100 border border-base-200 hover:shadow-sm transition-shadow duration-200"
                        >
                            <div className="flex items-start gap-4">
                                <div className="avatar placeholder flex-shrink-0">
                                    <div className={`${getAvatarColor(review.user.full_name)} rounded-full w-12 h-12 flex items-center justify-center shadow-sm`}>
                                        <span className="text-lg font-medium tracking-tight">
                                            {getInitials(review.user.full_name)}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                        <div>
                                            <p className={`font-semibold text-primary truncate`}>
                                                {review.user.full_name}
                                            </p>
                                            <div className="flex items-center mt-1">
                                                <div className="rating rating-xs -ml-1 mr-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={14} className={`${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
                                                    ))}
                                                </div>
                                                <span className="text-sm font-medium ml-1 text-gray-700">
                                                    {review.rating}
                                                </span>
                                            </div>
                                            <p className="mt-4 text-gray-700 leading-relaxed whitespace-pre-line">
                                                {review.comment}
                                            </p>
                                        </div>

                                        <div className="flex gap-3 flex-col justify-between items-end">
                                            <div>
                                                <span className="text-sm text-gray-500">
                                                    {review.time_ago || new Date(review.created_at).toLocaleDateString()}
                                                </span>
                                            </div>

                                            {review.is_approved && (
                                                <div className="flex items-center gap-1 badge badge-ghost">
                                                    <Check className="size-5 text-success" />
                                                    <span className="text-xs font-medium text-success">Verified</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {reviewsData.reviews.length > reviewsToShow && (
                        <div className="flex justify-center pt-2">
                            <button
                                className="btn btn-ghost btn-sm flex items-center gap-1.5 text-primary hover:text-primary-focus"
                                onClick={() => setShowAllReviews(!showAllReviews)}
                            >
                                {showAllReviews ? (
                                    <>
                                        <ChevronUp size={16} />
                                        <span>Show fewer reviews</span>
                                    </>
                                ) : (
                                    <>
                                        <ChevronDown size={16} />
                                        <span>View all {reviewsData.reviews.length} reviews</span>
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                        <MessageSquare size={28} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 mb-1">
                        No reviews yet
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                        Be the first to share your experience with this {isFoodService ? "food service" : "place"}
                    </p>
                </div>
            )}
        </div>
    );
};

export default ReviewsCard;