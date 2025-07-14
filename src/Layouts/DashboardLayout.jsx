import { Outlet, Navigate, useLocation } from "react-router";
import useUserRole from "../hooks/useUserRole";

const DashboardLayout = () => {
  const { userFromDB, isLoading, isError, isMatch } = useUserRole();
  const location = useLocation();

  if (isLoading) return <p>Loading user data...</p>;
  if (isError || !isMatch) return <p>Access Denied or Error.</p>;

  // If user is exactly at "/dashboard" path, redirect by role
  if (location.pathname === "/dashboard") {
    if (userFromDB?.role === "admin") {
      return <Navigate to="/dashboard/admin" replace />;
    }
    if (userFromDB?.role === "trainer") {
      return <Navigate to="/dashboard/trainer" replace />;
    }
    if (userFromDB?.role === "member") {
      return <Navigate to="/dashboard/member" replace />;
    }
    // If role unknown, you can redirect or show message:
    return <p>Invalid role detected</p>;
  }

  // For all other dashboard paths, render children
  return (
    <div className="flex min-h-screen w-full">
      <Outlet />
    </div>
  );
};

export default DashboardLayout;
