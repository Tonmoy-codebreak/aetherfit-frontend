import { createBrowserRouter } from "react-router";

import MainLayout from "../Layouts/MainLayout";
import HomePage from "../Pages/HomePage";
import AuthLayout from "../Layouts/AuthLayout";
import LoginPage from "../Pages/AuthPage/LoginPage";
import RegisterPage from "../Pages/AuthPage/RegisterPage";
import DashboardLayout from "../Layouts/DashboardLayout";
import PrivateRoute from "./PrivateRoute";

import ProfilePage from "../Pages/ProfilePage";
import TrainersPage from "../Pages/TrainersPage";
import ForumPage from "../Pages/ForumPage";
import TrainerDetailsPage from "../Pages/TrainerDetailsPage";
import TrainerBookingPage from "../Pages/TrainerBookingPage";
import PaymentPage from "../Pages/PaymentPage";
import AllClassesPage from "../Pages/AllClassesPage";
import BeTrainerPage from "../Pages/BeTrainerPage";

import UserDashboard from "../Layouts/UserDashboard";
import TrainerDashboard from "../Layouts/TrainerDashboard";
import AdminDashboard from "../Layouts/AdminDashboard";

import ActivityLogPage from "../Pages/ActivityLogPage";
import BookedTrainersPage from "../Pages/BookedTrainersPage";
import Alltrainers from "../Pages/Admin Dashboard Pages/Alltrainers";
import TrainerApplication from "../Pages/Admin Dashboard Pages/TrainerApplication";
import TrainerApplicationDetails from "../Pages/Admin Dashboard Pages/TrainerApplicationDetails";
import BalanceAdmin from "../Pages/Admin Dashboard Pages/BalanceAdmin";
import AddNewClass from "../Pages/Admin Dashboard Pages/AddNewClass";
import Subscriber from "../Pages/Admin Dashboard Pages/Subscriber";
import AddForumAdmin from "../Pages/Admin Dashboard Pages/AddForumAdmin";
import ForumPostDetails from "../Pages/ForumPostDetails";

import AddSlot from "../Pages/Trainer Dashboard pages/AddSlot";
import AddForumTrainer from "../Pages/Trainer Dashboard pages/AddForumTrainer";
import ManageSlot from "../Pages/Trainer Dashboard pages/ManageSlot";
import DefaultMember from "../Layouts/DefaultMember";
import DefaultTrainer from "../Layouts/DefaultTrainer";
import DefaulltAdmin from "../Layouts/DefaulltAdmin";
import ErrorPage from "../Pages/ErrorPage";
import UnAuthorizedPage from "../Pages/UnAuthorizedPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement : <ErrorPage></ErrorPage>,
    children: [
      { path: "/", element: <HomePage /> },
      {
        path: "profile",
        element: (
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        ),
      },
      { path: "classes", element: <AllClassesPage /> },
      { path: "trainers", element: <TrainersPage /> },
      { path: "trainers/:id", element: <TrainerDetailsPage /> },
      { path: "betrainer", element:<PrivateRoute> <BeTrainerPage /> </PrivateRoute>},
      { path: "booking/:trainerId/:day/:time", element: <PrivateRoute><TrainerBookingPage /></PrivateRoute>    },
      { path: "payment", element:  <PrivateRoute> <PaymentPage /></PrivateRoute>},
      { path: "forum", element: <ForumPage /> },
      { path: "forum/:id", element:<ForumPostDetails></ForumPostDetails> }
    ],
  },
  {
    path: "/auth",
    errorElement: <ErrorPage></ErrorPage>,
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
    ],
  },
  {
    path: "/dashboard",
    errorElement: <ErrorPage></ErrorPage>,
    element: <PrivateRoute>  <DashboardLayout /></PrivateRoute>,
    children: [
      {
        path: "member",
        element: <UserDashboard />,
        children: [
          {index:true, element: <DefaultMember></DefaultMember>},
          { path: "profile", element: <ProfilePage /> },
          { path: "activity-log", element: <ActivityLogPage /> },
          { path: "booked-trainer", element: <BookedTrainersPage /> },
          
        ],
      },
      {
        path: "trainer",
        element: <TrainerDashboard />,
        children: [
           {index:true, element: <DefaultTrainer></DefaultTrainer>},
          { path: "manageslots", element: <ManageSlot></ManageSlot> },
          { path: "addslot", element: <AddSlot></AddSlot> },
          { path: "addforumbytrainer", element: <AddForumTrainer></AddForumTrainer>}
        ],
      },
      {
        path: "admin",
        element: <AdminDashboard />,
        children: [
           {index:true, element: <DefaulltAdmin></DefaulltAdmin>},
          { path: "alltrainers", element: <Alltrainers></Alltrainers> },
          {path:"appliedtrainers" , element: <TrainerApplication></TrainerApplication>},
          { path: "appliedtrainers/:id", element: <TrainerApplicationDetails></TrainerApplicationDetails> },
          {path:"balancelogs", element:<BalanceAdmin></BalanceAdmin>},
          {path:"addnewclass" , element: <AddNewClass></AddNewClass>},
          {path : "subscriber" , element: <Subscriber></Subscriber>},
          {path : "addforum" , element: <AddForumAdmin></AddForumAdmin>}
        ],
      },
    ],
  },
  {
    path: "/unauthorizedaccess",
    element: <UnAuthorizedPage></UnAuthorizedPage>
  }
]);

export default router;
