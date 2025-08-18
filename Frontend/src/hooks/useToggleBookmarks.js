import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleBookmark } from "../lib/api";
import { toast } from "react-toastify";

export default function useToggleBookmark() {
    const queryClient = useQueryClient();

    const { mutate, isPending, error } = useMutation({
        mutationFn: toggleBookmark,
        onSuccess: (data, variables) => {
            // variables will contain { listingId }
            queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
            queryClient.invalidateQueries({ queryKey: ["listing", variables.listingId] });

            if (data?.toggled) {
                toast.success("Bookmark added", { autoClose: 1500 });
            } else {
                toast.info("Bookmark removed", { autoClose: 1500 });
            }
        },
        onError: (err) => {
            toast.error(
                err?.response?.data?.message || "Failed to toggle bookmark",
                { autoClose: 1500 }
            );
        },
    });

    return { toggleBookmarkMutation: mutate, isPending, error };
}