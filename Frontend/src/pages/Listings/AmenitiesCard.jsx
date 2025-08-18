import { BatteryCharging, Bike, BookOpen, Droplet, Flame, Home, Key, Leaf, Refrigerator, Shield, ShieldCheck, Shirt, Tv, User, Utensils, Wifi } from "lucide-react";

const AmenitiesCard = ({ listing, isFoodService }) => {
    return (
        <div className="bg-base-100 p-6 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold mb-6">
                {isFoodService ? 'What We Offer' : 'Amenities'}
            </h2>
            <div className="grid grid-cols-2 gap-4">
                {listing.amenities.map(amenity => {
                    const amenityIcons = {
                        wifi: <Wifi size={20} className="text-primary" />,
                        ac: <Leaf size={20} className="text-primary" />,
                        laundry: <Shirt size={20} className="text-primary" />,
                        attached_bathroom: <Key size={20} className="text-primary" />,
                        meals: <Utensils size={20} className="text-primary" />,
                        housekeeping: <User size={20} className="text-primary" />,
                        parking: <Bike size={20} className="text-primary" />,
                        cctv: <Shield size={20} className="text-primary" />,
                        study_table: <BookOpen size={20} className="text-primary" />,
                        wardrobe: <Shirt size={20} className="text-primary" />,
                        water: <Droplet size={20} className="text-primary" />,
                        security: <ShieldCheck size={20} className="text-primary" />,
                        power_backup: <BatteryCharging size={20} className="text-primary" />,
                        fridge: <Refrigerator size={20} className="text-primary" />,
                        tv: <Tv size={20} className="text-primary" />,
                        geyser: <Flame size={20} className="text-primary" />
                    };

                    const amenityLabels = {
                        wifi: "WiFi",
                        ac: "Air Conditioning",
                        laundry: "Laundry",
                        attached_bathroom: "Attached Bathroom",
                        meals: "Meals Included",
                        housekeeping: "Housekeeping",
                        parking: "Parking",
                        cctv: "CCTV Surveillance",
                        study_table: "Study Table",
                        wardrobe: "Wardrobe",
                        water: "24x7 Water",
                        security: "Security Guard",
                        power_backup: "Power Backup",
                        fridge: "Refrigerator",
                        tv: "TV",
                        geyser: "Geyser"
                    };

                    return (
                        <div key={amenity} className="flex items-center gap-3">
                            {amenityIcons[amenity] || <Home size={20} className="text-primary" />}
                            <span>{amenityLabels[amenity] || amenity.split('_').join(' ')}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default AmenitiesCard