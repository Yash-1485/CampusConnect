import { Link } from "react-router"
import BookmarkButton from "../../components/BookmarkButton"
import AboutCard from "./AboutCard"
import AmenitiesCard from "./AmenitiesCard"
import ImageGallery from "./ImageGallery"
import PriceCard from "./PriceCard"
import ProviderCard from "./ProviderCard"
import ReviewsCard from "./ReviewsCard"

const MobileView = ({ id, listing, hasAmenities, isFoodService, hasRoomDetails, isBookmarked }) => {
    return (
        <>
            {/* Main Content */}
            <div className="p-2 sm:p-4">
                <div className="flex flex-col gap-6">
                    <div className="text-sm breadcrumbs mb-2">
                        <ul>
                            <li><Link to="/" className="hover:underline">Home</Link></li>
                            <li><Link to="/browse" className="hover:underline">Browse</Link></li>
                            <li className="text-primary">{listing.title}</li>
                        </ul>
                    </div>
                    <span className="text-primary text-3xl font-bold">{listing.title}</span>
                    <div className="space-y-6">
                        <ImageGallery listing={listing} />
                        {/* <BookmarkButton listingId={listing.id} isBookmarked={isBookmarked} /> */}
                        <PriceCard id={id} listing={listing} isFoodService={isFoodService} />
                        <AboutCard listing={listing} isFoodService={isFoodService} hasRoomDetails={hasRoomDetails} />
                        {hasAmenities && <AmenitiesCard listing={listing} isFoodService={isFoodService} />}
                    </div>

                    <div className="space-y-6 mb-28">
                        <ReviewsCard listing={listing} isFoodService={isFoodService} />
                        <ProviderCard listing={listing} isFoodService={isFoodService} />
                    </div>
                </div>

                <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-base-100 border-t shadow-lg p-4 z-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-primary">₹{listing.price}</span>
                        <span className="text-gray-500">/{isFoodService ? 'month' : 'month'}</span>
                    </div>
                    <div className="flex gap-2">
                        <BookmarkButton listingId={listing.id} isBookmarked={isBookmarked} className="btn btn-square btn-ghost" iconOnly />
                    </div>
                </div>
            </div>
        </>
    )
}

export default MobileView
