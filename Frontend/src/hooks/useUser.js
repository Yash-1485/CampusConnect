import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../lib/api';

export default function useUser() {
    return useQuery({
        queryKey: ['user'],
        queryFn: getUsers,
        retry: false,
        refetchOnWindowFocus: true
    });
}