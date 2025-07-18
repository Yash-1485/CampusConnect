import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../lib/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

export default function useLogin() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { mutate, isPending, error } = useMutation({
        mutationFn: login,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["user"]
            });
            toast.success("Login successful!" , { autoClose: 1500 });
            navigate("/");
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || "Login failed");
        },
    });

    return { error, isPending, loginMutation: mutate };
}
