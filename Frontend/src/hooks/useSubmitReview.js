import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitReview } from "../lib/api";
import { toast } from "react-toastify";

export default function useSubmitReview() {
    const queryClient = useQueryClient();

    const { mutate, isPending, error } = useMutation({
        mutationFn: submitReview,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["reviews", variables.review.listing],
            });

            toast.success("Review submitted successfully!", { autoClose: 1500 });
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || "Failed to submit review", { autoClose: 1500 });
        },
    });

    return { submitReviewMutation: mutate, isPending, error };
}