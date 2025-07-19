import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../lib/api';

export default function useUser() {
    const user = useQuery({
        queryKey: ['user'],
        queryFn: getUsers,
        retry: false,
    });

    return { isLoading: user.isLoading, user: user.data }
}