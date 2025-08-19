// src/pages/Admin/Listings.jsx
import { useQuery } from "@tanstack/react-query";
import { fetchAllListings } from "../../lib/api";
import { Loader2 } from "lucide-react";

const Listings = () => {
    const { data: listings, isLoading, isError } = useQuery({
        queryKey: ["listings"],
        queryFn: fetchAllListings,
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="animate-spin w-8 h-8 text-primary" />
                <span className="ml-3 text-lg font-medium text-primary">
                    Loading listings...
                </span>
            </div>
        );
    }

    if (isError || !listings) {
        return (
            <div className="text-center text-red-500 font-semibold mt-10 text-lg">
                Failed to load listings. Please try again later.
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-extrabold mb-8 text-primary tracking-wide">
                All Listings
            </h1>

            <div className="overflow-x-auto shadow-xl rounded-xl border border-base-300 overflow-y-auto max-h-[70vh]">
                <table className="table w-full border-collapse">
                    {/* Table Head */}
                    <thead className="sticky top-0">
                        <tr className="bg-gradient-to-r from-primary to-primary text-primary-content">
                            <th className="text-left py-3 px-4">ID</th>
                            <th className="text-left py-3 px-4">Title</th>
                            <th className="text-left py-3 px-4">City</th>
                            <th className="text-left py-3 px-4">State</th>
                            <th className="text-left py-3 px-4">Provider Name</th>
                            <th className="text-left py-3 px-4">Provider Email</th>
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody>
                        {listings.length > 0 ? (
                            listings.map((listing, index) => (
                                <tr
                                    key={listing.id}
                                    className={`${index % 2 === 0 ? "bg-base-100" : "bg-base-200"
                                        } hover:bg-primary/10 transition-colors duration-200`}
                                >
                                    <td className="py-3 px-4 font-medium text-base-content">
                                        {listing.id}
                                    </td>
                                    <td className="py-3 px-4 text-base-content">
                                        {listing.title}
                                    </td>
                                    <td className="py-3 px-4 text-base-content">
                                        {listing.city}
                                    </td>
                                    <td className="py-3 px-4 text-base-content">
                                        {listing.state}
                                    </td>
                                    <td className="py-3 px-4 text-base-content">
                                        {listing.provider_name}
                                    </td>
                                    <td className="py-3 px-4 text-base-content">
                                        {listing.provider_email}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="text-center text-base-content/70 py-6 italic"
                                >
                                    No listings found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Listings;