import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../AuthProvider/useAuth";

const useUserRole = () => {
  const { user: firebaseUser } = useAuth();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["userRole", firebaseUser?.email],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/users?email=${firebaseUser.email}`
      );
      return res.data;
    },
    enabled: !!firebaseUser?.email,
  });

  const isMatch = firebaseUser?.email === data?.email;

  return { userFromDB: data, isLoading, isError, isMatch };
};

export default useUserRole;
