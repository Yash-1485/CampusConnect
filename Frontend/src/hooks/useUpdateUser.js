import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfile } from '../lib/api';
import { toast } from 'react-toastify';

const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateProfile,
        onSuccess: (data) => {
            queryClient.setQueryData(['user'], data.data.user);
            queryClient.invalidateQueries({ queryKey: ['user'] });
            toast.success(data.data.message || 'Profile updated successfully', { position: "top-center", autoClose: 3000, });
            return data.data;
        },
        onError: (error) => {
            const errorMessage = error.response?.data?.message || 'Profile update failed';
            toast.error(errorMessage, { position: "top-center", autoClose: 3000 });
            throw error;
        }
    });
};

export default useUpdateUser;