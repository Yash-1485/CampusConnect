import { useQuery } from "@tanstack/react-query";
import { getBookmarksByUserId } from "../lib/api";

function useBookmarksUser(userId) {
    const { data, isLoading } = useQuery({
        queryKey: ["bookmarks", userId],
        queryFn: () => getBookmarksByUserId(userId),
        enabled: !!userId,
    });

    return { bookmarks: data, isLoading };
}

export default useBookmarksUser;
