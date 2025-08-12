import React, { useState } from 'react';
import { useListings } from '../hooks/useListings';
import ListingCard from '../components/ListingCard';
import { Search, Grid2x2, List, Filter, X, Ban, Phone, MessagesSquare, Key, LogIn, UserPlus, SquareChartGantt } from 'lucide-react';
import { IndianRupee } from 'lucide-react';
import useUser from '../hooks/useUser';
import { useNavigate } from 'react-router';
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

    const { user } = useUser();
    const isAuthorized = Boolean(user);
    const visibleListings = isAuthorized ? listings : listings.slice(0, 5);
    const navigate = useNavigate();

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

    if (!isAuthorized) {
        return (
            <div className="container mx-auto px-6 py-4 lg:px-40 lg:py-10">
                <h1 className="text-3xl font-bold mb-2">Browse Listings</h1>
                <p className="text-gray-600 mb-6">
                    Search for PGs, hostels, mess, tiffin, tutors...
                </p>

                {/* Sample listings preview */}
                {visibleListings.length === 0 ? (
                    <div className="text-center py-12">
                        <h3 className="text-xl font-medium">
                            No listings found matching your criteria
                        </h3>
                        <p className="text-gray-500 mt-2">
                            Try adjusting your search or filters
                        </p>
                    </div>
                ) : viewMode === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {visibleListings.map((listing) => (
                            <ListingCard listing={listing} key={listing.id} view={viewMode}/>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {visibleListings.map((listing) => (
                            <ListingCard listing={listing} key={listing.id} view={viewMode}/>
                        ))}
                    </div>
                )}

                {/* Enhanced CTA Section with DaisyUI */}
                <div className="card bg-gradient-to-r from-primary/10 to-secondary/10 mt-12 border border-primary/20">
                    <div className="card-body items-center text-center">
                        <div className="max-w-2xl">
                            <h3 className="card-title text-2xl mb-3">
                                <Key className="w-6 h-6 mr-2" />
                                Unlock {listings.length - 5}+ More Listings!
                            </h3>
                            <p className="mb-6">
                                Join our community to view all available accommodations and get full access
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                <div className="card bg-base-100 shadow-sm">
                                    <div className="card-body items-center">
                                        <Search className="w-8 h-8 text-primary mb-2" />
                                        <p className="font-medium">Full search results</p>
                                    </div>
                                </div>
                                <div className="card bg-base-100 shadow-sm">
                                    <div className="card-body items-center">
                                        <Phone className="w-8 h-8 text-primary mb-2" />
                                        <p className="font-medium">Direct contact details</p>
                                    </div>
                                </div>
                                <div className="card bg-base-100 shadow-sm">
                                    <div className="card-body items-center">
                                        <SquareChartGantt className="w-8 h-8 text-primary mb-2" />
                                        <p className="font-medium">Detailed Overview with Images</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <button
                                    onClick={() => navigate("/login")}
                                    className="btn btn-primary gap-2"
                                >
                                    <LogIn className="w-5 h-5" />
                                    Login to Continue
                                </button>

                                <button
                                    onClick={() => navigate("/signup")}
                                    className="btn btn-outline btn-primary gap-2"
                                >
                                    <UserPlus className="w-5 h-5" />
                                    Create Free Account
                                </button>
                            </div>

                            {/* <p className="text-sm mt-4">
                                Already have an account?{' '}
                                <button
                                    onClick={() => navigate("/login")}
                                    className="link link-primary"
                                >
                                    Sign in
                                </button>
                            </p> */}
                        </div>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="container mx-auto px-6 py-4 lg:px-40 lg:py-10">
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
                    <Ban />
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
                                <ListingCard listing={listing} key={listing.id} view={viewMode} />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {listings.map((listing) => (
                                <ListingCard listing={listing} key={listing.id} view={viewMode} />
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
export default Browse;