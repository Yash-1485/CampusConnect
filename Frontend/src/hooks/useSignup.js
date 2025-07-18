// hooks/useSignup.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup } from "../lib/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

export default function useSignup() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { mutate, isPending, error } = useMutation({
        mutationFn: signup,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
            toast.success("Signup successful!", { autoClose: 1500 });
            navigate("/");
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || "Signup failed");
        }
    });

    return { signupMutation: mutate, isPending, error };
}
