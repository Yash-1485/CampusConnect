import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { getListing } from "../lib/api";
import { Ban, Bookmark } from "lucide-react";
import ProviderCard from "./Listings/ProviderCard";
import ReviewsCard from "./Listings/ReviewsCard";
import AmenitiesCard from "./Listings/AmenitiesCard";
import AboutCard from "./Listings/AboutCard";
import ImageGallery from "./Listings/ImageGallery";
import PriceCard from "./Listings/PriceCard";
import BookmarkButton from "../components/BookmarkButton";
import useBookmarks from "../hooks/useBookmarks";
import MobileView from "./Listings/MobileView";

const ListingDetail = () => {
    const { id } = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    // const [isMobile, setIsMobile] = useState(false);
    const { bookmarks, isLoading: bookmarksLoading } = useBookmarks(id);

    const isFoodService = listing?.category === 'tiffin' || listing?.category === 'mess';
    const hasRoomDetails = listing?.room_type && !isFoodService;
    const hasAmenities = listing?.amenities?.length > 0;

    const fetchListing = async () => {
        try {
            const res = await getListing(id);
            setListing(res.data);
        } catch (error) {
            console.error("Error fetching listing:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchListing();

        // const handleResize = () => {
        //     setIsMobile(window.innerWidth < 1024);
        // };

        // window.addEventListener('resize', handleResize);
        // return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (loading || bookmarksLoading) return (
        <div className="flex justify-center items-center h-screen">
            <span className="loading loading-spinner loading-lg"></span>
        </div>
    );

    const isBookmarked = bookmarks.bookmarks.length > 0;
    if (!listing) return (
        <div className="alert alert-error max-w-2xl mx-auto mt-8">
            <Ban />
            <span>Error! Listing not found.</span>
        </div>
    );

    // if(isMobile){
    //     return (
    //         <MobileView id={id} listing={listing} hasAmenities={hasAmenities} isFoodService={isFoodService} hasRoomDetails={hasRoomDetails} isBookmarked={isBookmarked}/>
    //     )
    // }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Breadcrumbs */}
            <div className="text-sm breadcrumbs mb-4">
                <ul>
                    <li><Link to="/" className="hover:underline">Home</Link></li>
                    <li><Link to="/browse" className="hover:underline">Browse</Link></li>
                    <li className="text-primary">{listing.title}</li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Column */}
                <div className="lg:w-2/3 space-y-6">
                    {/* <span className="text-primary text-3xl font-bold w-full block p-2 pl-0 bg-base-200 rounded-xl"><Link>{listing.title}</Link></span> */}
                    <ImageGallery listing={listing} />
                    <AboutCard listing={listing} isFoodService={isFoodService} hasRoomDetails={hasRoomDetails} />
                    {hasAmenities && <AmenitiesCard listing={listing} isFoodService={isFoodService} />}
                    <ReviewsCard listing={listing} isFoodService={isFoodService} />
                </div>

                {/* Right Column */}
                <div className="lg:w-1/3 space-y-6">
                    <PriceCard id={id} listing={listing} isFoodService={isFoodService} />
                    <ProviderCard listing={listing} isFoodService={isFoodService} />
                </div>
            </div>

            {/* Mobile Bottom Action Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-base-100 border-t shadow-lg p-4 z-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-primary">₹{listing.price}</span>
                    <span className="text-gray-500">/{isFoodService ? 'month' : 'month'}</span>
                </div>
                <div className="flex gap-2">
                    <BookmarkButton listingId={listing.id} isBookmarked={isBookmarked} />
                </div>
            </div>
        </div>
    );
};

export default ListingDetail;