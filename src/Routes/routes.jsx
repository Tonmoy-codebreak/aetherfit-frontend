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

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
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
      { path: "betrainer", element: <BeTrainerPage /> },
      { path: "booking/:trainerId/:day/:time", element: <TrainerBookingPage /> },
      { path: "payment", element: <PaymentPage /> },
      { path: "forum", element: <ForumPage /> },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: "member",
        element: <UserDashboard />,
        children: [
          { index: true, element: <ProfilePage /> },
          { path: "activity-log", element: <ActivityLogPage /> },
          { path: "booked-trainer", element: <BookedTrainersPage /> },
          
        ],
      },
      {
        path: "trainer",
        element: <TrainerDashboard />,
        // Add trainer dashboard children routes here if you have any,
        // for example:
        // children: [
        //   { path: "manage-slots", element: <ManageSlotsPage /> },
        //   { path: "add-slot", element: <AddSlotPage /> },
        // ],
      },
      {
        path: "admin",
        element: <AdminDashboard />,
        // Add admin dashboard children routes here if any,
        // for example:
        // children: [
        //   { path: "all-newsletter", element: <AllNewsletterPage /> },
        // ],
      },
    ],
  },
]);

export default router;
