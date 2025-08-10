import { useQuery } from "@tanstack/react-query";
import { fetchListings } from "../lib/api";

export const useListings = () => {
    const listings = useQuery({
        queryKey: ['listings'],
        queryFn: fetchListings,
    });
    return { isLoading: listings.isLoading, listings: listings.data?.data }
};