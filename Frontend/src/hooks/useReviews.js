import { useQuery } from "@tanstack/react-query";
import { getReviewsByListingId } from "../lib/api";

const useReviews = (listingId) => {
    const reviews = useQuery({
        queryKey: ["reviews", listingId],
        queryFn: () => getReviewsByListingId(listingId),
        enabled: !!listingId,
    });

    return { isLoading: reviews.isLoading, reviews: reviews.data }
};

export default useReviews;