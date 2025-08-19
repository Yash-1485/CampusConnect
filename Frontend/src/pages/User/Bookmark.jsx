import { Bookmark } from 'lucide-react';
import ListingCard from '../../components/ListingCard';
import useBookmarksUser from '../../hooks/useBookmarksUser';
import useUser from '../../hooks/useUser';
import { useNavigate } from 'react-router';

const BookmarksPage = () => {
    const { user } = useUser();
    const { bookmarks, isLoading } = useBookmarksUser(user?.id);
    const navigate=useNavigate();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl min-h-[calc(100vh-200px)]">
            {/* Header with DaisyUI card styling */}
            <div className="card bg-base-100 shadow-sm mb-8">
                <div className="card-body p-6">
                    <div className="flex items-center gap-3">
                        <Bookmark className="w-6 h-6 text-primary" />
                        <h1 className="text-2xl font-bold">My Bookmarks</h1>
                        {bookmarks?.bookmarks?.length > 0 && (
                            <span className="badge badge-primary">
                                {bookmarks.count} {bookmarks.count === 1 ? 'item' : 'items'}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Bookmarks Grid */}
            {bookmarks?.bookmarks?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookmarks.bookmarks.map((bookmark) => (
                        <ListingCard
                            key={bookmark.id}
                            listing={bookmark.listing_info}
                            className="hover:scale-[1.02] transition-transform duration-200"
                        />
                    ))}
                </div>
            ) : (
                <div className="card bg-base-100 shadow-sm">
                    <div className="card-body items-center text-center py-16">
                        <Bookmark className="w-12 h-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium">No bookmarks yet</h3>
                        <p className="text-gray-500 mt-2">
                            Save listings you like to see them here
                        </p>
                        <button className="btn btn-primary mt-4" onClick={()=>{navigate("/browse")}}>
                            Browse Listings
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookmarksPage;