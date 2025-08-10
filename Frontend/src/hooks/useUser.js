import { useQuery } from '@tanstack/react-query';
import { getUser } from '../lib/api';

export default function useUser() {
    const user = useQuery({
        queryKey: ['user'],
        queryFn: getUser,
        retry: false,
    });

    return { isLoading: user.isLoading, user: user.data }
}