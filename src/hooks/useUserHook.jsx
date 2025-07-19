import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../AuthProvider/useAuth';
import useAxios from './useAxios';
import { useQuery } from '@tanstack/react-query';

const useUserHook = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const axiosSecure = useAxios();

    const {
        data: isMember,
        isLoading: isRoleChecking,
        isError: isRoleError,
    } = useQuery({
        queryKey: ['userRole', user?.email],
        queryFn: async () => {
            const response = await axiosSecure.get(`/normal_users/profile?email=${user.email}`);
            return response.data;
        },
        enabled: !!user && !authLoading,
        select: (dbUser) => dbUser?.role === 'member',
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5,
    });

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            navigate('/unauthorizedaccess', { replace: true });
            return;
        }

        if (!isRoleChecking && (isRoleError || isMember === false)) {
            navigate('/unauthorizedaccess', { replace: true });
        }
    }, [user, authLoading, isMember, isRoleChecking, isRoleError, navigate]);

    return {
        user,
        loading: authLoading || isRoleChecking,
        isMember,
    };
};

export default useUserHook;