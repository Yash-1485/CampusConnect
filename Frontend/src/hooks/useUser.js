import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getUser } from '../lib/api';

export default function useUser() {
    const queryClient = useQueryClient();

    const user = useQuery({
        queryKey: ['user'],
        queryFn: getUser,
        retry: false,
    });

    const refreshUser = () => queryClient.invalidateQueries(['user']);

    return { isLoading: user.isLoading, user: user.data, refreshUser }
}