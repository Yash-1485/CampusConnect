import { Bike, Clock, Home, Leaf, Shirt, User, Utensils } from 'lucide-react';

const AboutCard = ({ listing, isFoodService, hasRoomDetails }) => {

    const renderFoodServiceDetails = () => (
        <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
                <Utensils size={20} className="text-primary" />
                <div>
                    <p className="text-sm text-gray-500">Meal Type</p>
                    <p className="font-medium">{listing.food_type || 'Lunch & Dinner'}</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <Leaf size={20} className="text-primary" />
                <div>
                    <p className="text-sm text-gray-500">Dietary</p>
                    <p className="font-medium">{listing.dietary_options || 'Vegetarian'}</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <Clock size={20} className="text-primary" />
                <div>
                    <p className="text-sm text-gray-500">Delivery Time</p>
                    <p className="font-medium">{listing.delivery_time || '12:30 PM - 1:30 PM'}</p>
                </div>
            </div>
            {listing.delivery_available && (
                <div className="flex items-center gap-3">
                    <Bike size={20} className="text-primary" />
                    <div>
                        <p className="text-sm text-gray-500">Delivery</p>
                        <p className="font-medium">Available</p>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="bg-base-100 p-6 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold mb-4">About this {isFoodService ? 'service' : 'place'}</h2>
            <p className="text-gray-700 mb-6">{listing.description}</p>

            {hasRoomDetails || isFoodService ? (
                <>
                    <h3 className="font-semibold text-lg mb-4">
                        {isFoodService ? 'Service Details' : 'Room Details'}
                    </h3>
                    {isFoodService ? renderFoodServiceDetails() : (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <Home size={20} className="text-primary" />
                                <div>
                                    <p className="text-sm text-gray-500">Type</p>
                                    <p className="font-medium capitalize">{listing.room_type}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <User size={20} className="text-primary" />
                                <div>
                                    <p className="text-sm text-gray-500">Occupancy</p>
                                    <p className="font-medium">{listing.occupancy_limit}</p>
                                </div>
                            </div>
                            {listing.gender_preference && (
                                <div className="flex items-center gap-3">
                                    <Shirt size={20} className="text-primary" />
                                    <div>
                                        <p className="text-sm text-gray-500">Gender</p>
                                        <p className="font-medium capitalize">{listing.gender_preference}</p>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center gap-3">
                                <span>Furnished: {listing.is_furnished ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                    )}
                </>
            ) : null}
        </div>
    )
}

export default AboutCard
