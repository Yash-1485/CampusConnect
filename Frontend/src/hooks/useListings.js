import { useState } from "react";
import { fetchListings } from "../lib/api"
import { useQuery } from "@tanstack/react-query"

export const useListings = () => {
    const [filters, setFilters] = useState({
        search: "",
        category: "",
        room_type: "",
        gender: "",
        min: "",
        max: "",
        city: "",
        state: "",
        district: "",
    });
    
    const [page, setPage] = useState(1);
    const { data, isLoading, error, refetch,} = useQuery({
        queryKey: ["listings", { page, filters }],
        queryFn: fetchListings,
        keepPreviousData: true,
    });
    
    const updateFilters = (newFilters) => {
        setFilters(newFilters);
        setPage(1);
    };

    return {
        listings: data?.results ?? [],
        pagination: {
            currentPage: data?.current_page ?? 1,
            totalPages: data?.total_pages ?? 1,
            totalItems: data?.total_items ?? 0,
            pageSize: data?.page_size ?? 10,
        },
        filters,
        isLoading,
        error,
        updateFilters,
        changePage: setPage,
        refetch,
    };
};