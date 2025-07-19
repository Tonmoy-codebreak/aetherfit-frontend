import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../AuthProvider/useAuth';
import useAxios from './useAxios';

const useTrainerHook = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxios();

  const [isLoadingRole, setIsLoadingRole] = useState(true);
  const [isTrainer, setIsTrainer] = useState(false); // State for trainer role

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

      
        if (dbUser && dbUser.role === 'trainer') {
          setIsTrainer(true);
        } else {
          setIsTrainer(false);
          navigate('/unauthorizedaccess', { replace: true });
        }
      } catch (error) {
        console.error("Failed to fetch trainer role from backend:", error);
        setIsTrainer(false);
        if (error.response?.status !== 401 && error.response?.status !== 403) {
            navigate('/unauthorizedaccess', { replace: true });
        }
      } finally {
        setIsLoadingRole(false);
      }
    };

    checkUserRole();
  }, [user, authLoading, navigate, axiosSecure]);

  // Return relevant states for Trainer Dashboard
  return { user, loading: authLoading || isLoadingRole, isTrainer };
};

export default useTrainerHook;