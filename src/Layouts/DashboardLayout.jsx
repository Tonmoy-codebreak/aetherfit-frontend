import useUserRole from "../hooks/useUserRole";
import AdminDashboard from "./AdminDashboard";
import TrainerDashboard from "./TrainerDashboard";
import UserDashboard from "./UserDashboard";

const DashboardLayout = () => {
  const { userFromDB, isLoading, isError, isMatch } = useUserRole();

  if (isLoading) return <p>Loading user data...</p>;
  if (isError) return <p>Failed to load user data.</p>;

  if (!isMatch) {
    console.log(userFromDB);
    return (
      <div className="text-center mt-10 text-red-500">
        <p className="text-4xl">User not valid</p>
      </div>
    );
  }

  if (userFromDB?.role === "admin") return <AdminDashboard />;
  if (userFromDB?.role === "trainer") return <TrainerDashboard />;
  if (userFromDB?.role === "member") return <UserDashboard />;

  return <p>Invalid role detected</p>;
};

export default DashboardLayout;
