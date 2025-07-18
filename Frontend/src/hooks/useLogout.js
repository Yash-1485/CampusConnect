import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../lib/api";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

export default function useLogout(onLogout = () => { }) {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { mutate, isPending, error } = useMutation({
        mutationFn: logout,
        onMutate: async () => {
            // Cancel any outgoing refetches to avoid overwriting
            await queryClient.cancelQueries({ queryKey: ['user'] });

            // Snapshot the previous value
            const previousUser = queryClient.getQueryData(['user']);

            // Optimistically update to null
            queryClient.setQueryData(['user'], null);

            return { previousUser };
        },
        onError: (err, variables, context) => {
            // Rollback on error
            if (context?.previousUser) {
                queryClient.setQueryData(['user'], context.previousUser);
            }
        },
        onSettled: () => {
            // Always refetch after error or success
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
        onSuccess: () => {
            onLogout();
            toast.success("Logged out successfully!", { autoClose: 1500 });
            navigate("/login");
        }
    });

    return { logoutMutation: mutate, isPending, error };
}