import { Navigate } from 'react-router';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import useAuth from '../hooks/useAuth';

export default function VerifiedUserRoute({ children, verify = true }) {
    const { isAuthenticated, isVerified, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && isAuthenticated && !isVerified && verify) {
            toast.info('Complete profile setup first', { toastId: 'profile-toast', autoClose: 1500 });
        }
    }, [isAuthenticated, isVerified, verify, isLoading]);

    if (isLoading) return null;

    if (isAuthenticated) {
        if (verify && !isVerified) {
            return <Navigate to="/profileSetup" />;
        }
        return children;
    }

    return children;
}