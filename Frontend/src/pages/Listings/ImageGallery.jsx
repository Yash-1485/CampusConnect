import { ArrowLeft, ArrowRight, ChefHat, Home, Key, Utensils } from 'lucide-react';
import React, { useState } from 'react'

const ImageGallery = ({ listing }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const nextImage = () => {
        setCurrentImageIndex(prev => (prev + 1) % listing.images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex(prev => (prev - 1 + listing.images.length) % listing.images.length);
    };

    const getCategoryIcon = () => {
        switch (listing?.category) {
            case 'tiffin': return <Utensils size={24} />;
            case 'mess': return <ChefHat size={24} />;
            case 'hostel': return <Home size={24} />;
            case 'pg': return <Key size={24} />;
            default: return <Home size={24} />;
        }
    };

    return (
        <>
            <div className="space-y-6 flex flex-col gap-1 shadow-md rounded-xl">
                <div className="relative bg-base-200 rounded-xl overflow-hidden h-96">
                    {listing.images.length > 0 ? (
                        <>
                            <img
                                src={listing.images[currentImageIndex].image_url}
                                alt={listing.title}
                                className="w-full h-full object-cover"
                            />
                            {listing.images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 btn btn-circle btn-sm btn-primary"
                                    >
                                        <ArrowLeft size={20} />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 btn btn-circle btn-sm btn-primary"
                                    >
                                        <ArrowRight size={20} />
                                    </button>
                                </>
                            )}
                        </>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                            {getCategoryIcon()}
                            <p className="mt-2">No images available</p>
                        </div>
                    )}
                </div>

                {/* Thumbnail Gallery */}
                {listing.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto py-2 px-2">
                        {listing.images.map((img, index) => (
                            <button
                                key={img.id}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`flex-shrink-0 w-32 h-24 rounded-md overflow-hidden transition-all ${currentImageIndex === index ? 'ring-2 ring-primary' : 'opacity-70 hover:opacity-100'}`}
                            >
                                <img
                                    src={img.image_url}
                                    alt={`Thumbnail ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}

export default ImageGallery
