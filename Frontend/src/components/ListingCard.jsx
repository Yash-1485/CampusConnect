// components/ListingCard.jsx
import React, { useState } from 'react';

export default function ListingCard({ listing, view }) {
    const [currentImage, setCurrentImage] = useState(0);

    const handleNextImage = () => {
        setCurrentImage((prev) => (prev + 1) % listing.images.length);
    };

    const handlePrevImage = () => {
        setCurrentImage((prev) => (prev - 1 + listing.images.length) % listing.images.length);
    };

    console.log("localhost:8000/"+listing.images[currentImage].image)

    return (
        <div className={`border rounded-lg shadow p-4 ${view === 'grid' ? 'w-64' : 'w-full flex gap-4'}`}>
            {listing.images.length > 0 && (
                <div className={`${view === 'grid' ? 'w-full h-40' : 'w-48 h-32'} relative`}>
                    <img
                        src={listing.images[currentImage].image}
                        alt={listing.title}
                        className="w-full h-full object-cover rounded"
                    />
                    {listing.images.length > 1 && (
                        <>
                            <button onClick={handlePrevImage} className="absolute left-0 top-1/2 bg-white/70 px-2">‹</button>
                            <button onClick={handleNextImage} className="absolute right-0 top-1/2 bg-white/70 px-2">›</button>
                        </>
                    )}
                </div>
            )}
            <div className="flex flex-col justify-between">
                <h2 className="font-bold text-lg">{listing.title}</h2>
                <p className="text-sm text-gray-600">{listing.city}, {listing.state}</p>
                <p className="font-semibold text-green-600">₹ {listing.price}</p>
                <p className="text-xs text-gray-500">{listing.room_type} • {listing.gender_preference}</p>
            </div>
        </div>
    );
}
