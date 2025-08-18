import { useQuery } from "@tanstack/react-query";
import { getBookmarksByListingId } from "../lib/api";

function useBookmarks(listingId) {
    const { data, isLoading } = useQuery({
        queryKey: ["bookmarks", listingId],
        queryFn: () => getBookmarksByListingId(listingId),
        enabled: !!listingId,
    });

    return { bookmarks: data, isLoading };
}

export default useBookmarks;
