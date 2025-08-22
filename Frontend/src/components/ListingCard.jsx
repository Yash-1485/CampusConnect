import React, { useState } from 'react';
import { IndianRupee, Star } from 'lucide-react';
import useUser from '../hooks/useUser';
import { useNavigate } from 'react-router';
import useBookmarks from '../hooks/useBookmarks';
import BookmarkButton from './BookmarkButton';

const ListingCard = ({ listing, view }) => {

    const { user } = useUser();
    const isAuthorized = Boolean(user);
    const navigate = useNavigate();

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);

    const getRatingColor = (rating) => {
        if (rating >= 4.5) return 'text-green-600';     // Excellent
        if (rating >= 3.5) return 'text-lime-500';      // Good
        if (rating >= 2.5) return 'text-yellow-500';    // Average
        if (rating >= 1.5) return 'text-orange-500';    // Poor
        return 'text-red-500';                          // Very Poor
    };

    const handleImageClick = () => {
        setIsExpanded(!isExpanded);
    };

    const goToNextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            (prevIndex + 1) % listing.images.length
        );
    };

    const goToPrevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            (prevIndex - 1 + listing.images.length) % listing.images.length
        );
    };

    const { bookmarks, isLoading: bookmarksLoading } = useBookmarks(listing.id);
    if (bookmarksLoading) return (
        <div className={`card bg-base-100 shadow-md hover:shadow-lg transition-shadow cursor-pointer justify-center items-center
                ${view === 'row' ? 'flex flex-row h-48' : 'flex flex-col'}
            `}>
            <span className="loading loading-spinner loading-lg"></span>
        </div>
    );

    const isBookmarked = isAuthorized && bookmarks?.bookmarks.length > 0;

    return (
        <div
            className={`card bg-base-100 shadow-md hover:shadow-lg transition-shadow cursor-pointer
                ${view === 'row' ? 'flex flex-row h-48' : 'flex flex-col'}
            `}
        >
            {/* Image */}
            <figure className={`relative overflow-hidden 
                ${view === 'row' ? 'w-48 h-full' : 'h-48'}
            `}>
                {listing.images?.length > 0 ? (
                    <>
                        <img
                            src={listing.images[currentImageIndex].image}
                            alt={listing.title}
                            className={`w-full h-full object-cover transition-transform duration-300 ${isExpanded ? 'scale-105' : 'scale-100'}`}
                            onClick={handleImageClick}
                        />
                        {listing.images.length > 1 && (
                            <>
                                <button
                                    className="absolute left-2 top-1/2 -translate-y-1/2 btn btn-circle btn-sm btn-ghost bg-white/50 hover:bg-white"
                                    onClick={(e) => { e.stopPropagation(); goToPrevImage(); }}
                                >
                                    ❮
                                </button>
                                <button
                                    className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-circle btn-sm btn-ghost bg-white/50 hover:bg-white"
                                    onClick={(e) => { e.stopPropagation(); goToNextImage(); }}
                                >
                                    ❯
                                </button>
                            </>
                        )}
                        {listing.images.length > 1 && (
                            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                {currentImageIndex + 1}/{listing.images.length}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">No Image</span>
                    </div>
                )}
                <div className="absolute top-2 left-2">
                    <span className={`badge ${listing.availability ? 'badge-success' : 'badge-error'}`}>
                        {listing.availability ? 'Available' : 'Unavailable'}
                    </span>
                </div>
            </figure>

            {/* Body */}
            <div className={`card-body p-4 ${view === 'row' ? 'flex-1' : ''}`}>
                <div className="flex justify-between items-start">
                    <h2 className="card-title text-lg line-clamp-1">{listing.title}</h2>
                    {listing.rating && (
                        <div className={`flex items-center ${getRatingColor(listing.rating)}`}>
                            <Star className="w-4 h-4 fill-current" />
                            <span className="ml-1 font-semibold">{listing.rating.toFixed(1)}</span>
                        </div>
                    )}
                </div>

                <p className="text-gray-500 text-sm line-clamp-1">
                    {listing.address}, {listing.city}
                </p>

                <div className="flex items-center mt-2">
                    <IndianRupee className="w-4 h-4 text-gray-700" />
                    <span className="font-bold text-lg ml-1">
                        {listing.price}/{listing.category === 'tutor' ? 'hour' : 'month'}
                    </span>
                </div>

                <div className="flex flex-wrap gap-1 my-2">
                    <span className="badge badge-outline capitalize">{listing.category}</span>
                    {listing.room_type && (
                        <span className="badge badge-outline capitalize">
                            {listing.room_type.replace('_', ' ')}
                        </span>
                    )}
                    {listing.gender_preference && (
                        <span className="badge badge-outline capitalize">
                            {listing.gender_preference === 'any' ? 'All Genders' : listing.gender_preference}
                        </span>
                    )}
                </div>

                {listing.amenities?.length > 0 && (
                    <div className="mt-2">
                        <p className="text-sm text-gray-500">Amenities:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                            {listing.amenities.slice(0, 3).map(amenity => (
                                <span key={amenity} className="badge badge-ghost text-xs capitalize p-3">
                                    {amenity.replace('_', ' ')}
                                </span>
                            ))}
                            {listing.amenities.length > 3 && (
                                <span className="badge badge-ghost text-xs">
                                    +{listing.amenities.length - 3} more
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {
                    isAuthorized
                    &&
                    <div className="card-actions flex justify-between mt-auto pt-4">
                        <div>
                            <button className="btn btn-md btn-primary" onClick={() => navigate(`/listing/${listing.id}/`)}>
                                <span>View Details</span>
                            </button>
                        </div>
                        {user?.role==="user" && <div>
                            <BookmarkButton listingId={listing.id} isBookmarked={isBookmarked} view='card' />
                        </div>}
                    </div>
                }
            </div>
        </div>
    );
};

export default ListingCard;
