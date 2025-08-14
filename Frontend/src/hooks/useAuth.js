import { useQuery } from '@tanstack/react-query';
import { getUser } from '../lib/api';

export default function useAuth() {
    const user = useQuery({
        queryKey: ['user'],
        queryFn: getUser,
        retry: false,
    });
    return {
        user: user.data, isLoading: user.isLoading, isAuthenticated: Boolean(user.data), isVerified: user.data?.is_verified
    };
}