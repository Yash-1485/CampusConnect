import React, { useState } from 'react';
import { useListings } from '../hooks/useListings';
import ListingCard from '../components/ListingCard';
import { Search, Grid2x2, List, Filter, X } from 'lucide-react';
import { IndianRupee } from 'lucide-react';
const Browse = () => {
    const {
        listings,
        loading,
        error,
        pagination,
        filters,
        updateFilters,
        changePage
    } = useListings();

    const [localFilters, setLocalFilters] = useState(filters);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [showFilters, setShowFilters] = useState(false);
    const [searchInput, setSearchInput] = useState('');

    const handleSearchChange = (e) => {
        setSearchInput(e.target.value);
        // Immediate search as user types
        updateFilters({ ...localFilters, search: e.target.value });
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setLocalFilters({ ...localFilters, [name]: value });
    };

    const applyFilters = () => {
        updateFilters(localFilters);
    };

    const resetFilters = () => {
        const resetFilters = {
            search: '',
            category: '',
            room_type: '',
            gender: '',
            min: '',
            max: '',
            city: '',
            state: '',
            district: ''
        };
        setLocalFilters(resetFilters);
        setSearchInput('');
        updateFilters(resetFilters);
    };

    const categoryOptions = [
        { value: '', label: 'All Categories' },
        { value: 'pg', label: 'PG' },
        { value: 'hostel', label: 'Hostel' },
        { value: 'mess', label: 'Mess' },
        { value: 'tiffin', label: 'Tiffin Service' },
        { value: 'tutor', label: 'Tutor' },
    ];

    const roomTypeOptions = [
        { value: '', label: 'Any Type' },
        { value: 'single', label: 'Single Room' },
        { value: 'double', label: 'Double Sharing' },
        { value: 'triple', label: 'Triple Sharing' },
        { value: 'quad', label: 'Four Sharing' },
        { value: 'dorm', label: 'Dormitory' },
    ];

    const genderOptions = [
        { value: '', label: 'Any Gender' },
        { value: 'male', label: 'Male Only' },
        { value: 'female', label: 'Female Only' },
        { value: 'any', label: 'All Genders' },
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-2">Browse Listings</h1>
            <p className="text-gray-600 mb-6">Search for PGs, hostels, mess, tiffin, tutors...</p>

            {/* Top Controls - Single Line */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                {/* Search Bar */}
                <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search className="w-5 h-5 text-gray-500" />
                    </div>
                    <input
                        type="text"
                        className="input input-bordered w-full pl-10"
                        placeholder="Search listings..."
                        value={searchInput}
                        onChange={handleSearchChange}
                    />
                </div>

                {/* Filter Button */}
                <button
                    className={`btn ${showFilters ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                </button>

                {/* View Toggle Buttons */}
                <div className="flex">
                    <button
                        className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline'} rounded-r-none`}
                        onClick={() => setViewMode('grid')}
                    >
                        <Grid2x2 className="w-4 h-4" />
                    </button>
                    <button
                        className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-outline'} rounded-l-none`}
                        onClick={() => setViewMode('list')}
                    >
                        <List className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Filters Panel - Persistent when opened */}
            {showFilters && (
                <div className="bg-base-200 p-4 rounded-lg mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {/* Category Filter */}
                        <div>
                            <label className="label">
                                <span className="label-text">Category</span>
                            </label>
                            <select
                                name="category"
                                value={localFilters.category}
                                onChange={handleFilterChange}
                                className="select select-bordered w-full"
                            >
                                {categoryOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Room Type */}
                        <div>
                            <label className="label">
                                <span className="label-text">Room Type</span>
                            </label>
                            <select
                                name="room_type"
                                value={localFilters.room_type}
                                onChange={handleFilterChange}
                                className="select select-bordered w-full"
                            >
                                {roomTypeOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="label">
                                <span className="label-text">Gender</span>
                            </label>
                            <select
                                name="gender"
                                value={localFilters.gender}
                                onChange={handleFilterChange}
                                className="select select-bordered w-full"
                            >
                                {genderOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {/* Price Range */}
                        <div>
                            <label className="label">
                                <span className="label-text">Min Price</span>
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <IndianRupee className="w-4 h-4 text-gray-500" />
                                </span>
                                <input
                                    type="number"
                                    name="min"
                                    placeholder="Min"
                                    value={localFilters.min}
                                    onChange={handleFilterChange}
                                    className="input input-bordered w-full pl-8"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text">Max Price</span>
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <IndianRupee className="w-4 h-4 text-gray-500" />
                                </span>
                                <input
                                    type="number"
                                    name="max"
                                    placeholder="Max"
                                    value={localFilters.max}
                                    onChange={handleFilterChange}
                                    className="input input-bordered w-full pl-8"
                                />
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <label className="label">
                                <span className="label-text">City</span>
                            </label>
                            <input
                                type="text"
                                name="city"
                                placeholder="Any city"
                                value={localFilters.city}
                                onChange={handleFilterChange}
                                className="input input-bordered w-full"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2">
                        <button
                            className="btn btn-ghost"
                            onClick={resetFilters}
                        >
                            Reset
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={applyFilters}
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            )}

            {/* Results Count */}
            <div className="mb-4">
                <p className="text-gray-600">Showing {listings.length} results</p>
            </div>

            {/* Loading and Error States */}
            {loading && (
                <div className="flex justify-center py-12">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            )}

            {error && (
                <div className="alert alert-error mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Error loading listings: {error}</span>
                </div>
            )}

            {/* Listings Display */}
            {!loading && !error && (
                <>
                    {listings.length === 0 ? (
                        <div className="text-center py-12">
                            <h3 className="text-xl font-medium">No listings found matching your criteria</h3>
                            <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
                        </div>
                    ) : viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {listings.map((listing) => (
                                <ListingCard listing={listing} key={listing.id} />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {listings.map((listing) => (
                                <ListingRow listing={listing} key={listing.id} />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="flex justify-center mt-8">
                            <div className="join">
                                <button
                                    className="join-item btn"
                                    disabled={pagination.currentPage === 1}
                                    onClick={() => changePage(pagination.currentPage - 1)}
                                >
                                    Previous
                                </button>
                                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                    let pageNum;
                                    if (pagination.totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (pagination.currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (pagination.currentPage >= pagination.totalPages - 2) {
                                        pageNum = pagination.totalPages - 4 + i;
                                    } else {
                                        pageNum = pagination.currentPage - 2 + i;
                                    }
                                    return (
                                        <button
                                            key={pageNum}
                                            className={`join-item btn ${pagination.currentPage === pageNum ? 'btn-active' : ''}`}
                                            onClick={() => changePage(pageNum)}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                                <button
                                    className="join-item btn"
                                    disabled={pagination.currentPage === pagination.totalPages}
                                    onClick={() => changePage(pagination.currentPage + 1)}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

// ListingRow component for list view
const ListingRow = ({ listing }) => {
    return (
        <div className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3">
                    {listing.images && listing.images.length > 0 ? (
                        <img
                            src={listing.images[0].image}
                            alt={listing.title}
                            className="w-full h-48 md:h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-48 md:h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500">No Image</span>
                        </div>
                    )}
                </div>
                <div className="p-6 md:w-2/3">
                    <h2 className="card-title text-xl">{listing.title}</h2>
                    <p className="text-gray-600 text-sm mb-2">{listing.address}, {listing.city}</p>
                    <p className="text-gray-700 mb-3 line-clamp-2">{listing.description}</p>

                    <div className="flex flex-wrap gap-1 mb-3">
                        <span className="badge badge-primary">₹{listing.price}/month</span>
                        <span className="badge badge-outline">{listing.category}</span>
                        {listing.room_type && <span className="badge badge-outline">{listing.room_type}</span>}
                    </div>

                    <div className="card-actions justify-end">
                        <button className="btn btn-sm btn-primary">View Details</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Browse;