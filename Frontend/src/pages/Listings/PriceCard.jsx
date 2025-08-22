import { CATEGORY_CHOICES } from '../../constants/constants';
import { Bookmark, MapPin, Star } from 'lucide-react';
import useBookmarks from '../../hooks/useBookmarks';
import BookmarkButton from '../../components/BookmarkButton';
import useUser from '../../hooks/useUser';

const PriceCard = ({ id, listing, isFoodService }) => {

    const { bookmarks, isLoading: bookmarksLoading } = useBookmarks(id);
    const { user } = useUser();
    const getCategoryLabel = (category) => {
        return CATEGORY_CHOICES.find(([value]) => value === category)?.[1] || category;
    };

    if (bookmarksLoading) return (
        <div className="bg-base-100 p-6 rounded-xl shadow-sm sticky top-6">
            <span className="loading loading-spinner loading-lg"></span>
        </div>
    );

    const isBookmarked = bookmarks.bookmarks.length > 0;
    
    return (
        <div className="bg-base-100 p-6 rounded-xl shadow-sm sticky top-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <span className="text-3xl font-bold text-primary">₹{listing.price}</span>
                    <span className="text-gray-500 text-xl">/{isFoodService ? 'month' : 'month'}</span>
                </div>
                <div className="badge badge-primary badge-lg">
                    {getCategoryLabel(listing.category)}
                </div>
            </div>

            <div className="flex items-center gap-1 text-yellow-500 mb-4">
                <Star size={18} className="fill-current" />
                <span className="font-semibold">{listing.rating}</span>
                <span className="text-gray-500 text-sm">({Math.floor(listing.rating * 10)} reviews)</span>
            </div>

            <div className="flex items-center gap-1 text-gray-600 mb-4">
                <MapPin size={18} />
                <span>{listing.city}, {listing.state}</span>
            </div>

            <div className="flex items-center gap-2 mb-4">
                <div className={`w-2 h-2 rounded-full ${listing.availability ? 'bg-success' : 'bg-error'}`}></div>
                <span>{listing.availability ? 'Available' : 'Unavailable'}</span>
            </div>

            {user?.role==="user" && <div className="hidden lg:block">
                <BookmarkButton listingId={listing.id} isBookmarked={isBookmarked} />
            </div>}

            <div className="divider"></div>

            <h3 className="text-xl font-bold mt-4 flex gap-2 items-center">
                <MapPin size={24} /> Location
            </h3>
            <p className="text-gray-500 mt-2">
                {listing.address}, {listing.city}, {listing.state} - {listing.pincode}
            </p>
            {isFoodService && listing.delivery_available && (
                <p className="text-sm text-primary mt-2">✓ Delivery available in this area</p>
            )}
        </div>
    )
}

export default PriceCard
