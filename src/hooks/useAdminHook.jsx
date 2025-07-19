import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router'; 
import { useAuth } from '../AuthProvider/useAuth';
import useAxios from './useAxios';

const useAdminHook = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxios();

  const [isLoadingRole, setIsLoadingRole] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkUserRole = async () => {
      if (authLoading) {
        return;
      }

      if (!user) {
        setIsLoadingRole(false);
        navigate('/unauthorizedaccess', { replace: true });
        return;
      }

      try {
        const response = await axiosSecure.get(`/normal_users/profile?email=${user.email}`);
        const dbUser = response.data;

        // *** KEY CHANGE HERE: Check for 'admin' role ***
        if (dbUser && dbUser.role === 'admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          navigate('/unauthorizedaccess', { replace: true });
        }
      } catch (error) {
        console.error("Failed to fetch admin role from backend:", error);
        setIsAdmin(false);
        if (error.response?.status !== 401 && error.response?.status !== 403) {
            navigate('/unauthorizedaccess', { replace: true });
        }
      } finally {
        setIsLoadingRole(false);
      }
    };

    checkUserRole();
  }, [user, authLoading, navigate, axiosSecure]);

  // Return relevant states for Admin Dashboard
  return { user, loading: authLoading || isLoadingRole, isAdmin };
};

export default useAdminHook;