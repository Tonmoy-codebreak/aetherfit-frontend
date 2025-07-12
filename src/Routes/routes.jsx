import { createBrowserRouter } from "react-router";

import MainLayout from "../Layouts/MainLayout";
import HomePage from "../Pages/HomePage";
import AuthLayout from "../Layouts/AuthLayout";
import LoginPage from "../Pages/AuthPage/LoginPage";
import RegisterPage from "../Pages/AuthPage/RegisterPage";
import DashboardLayout from "../Layouts/DashboardLayout";
import Dashboard from "../Pages/Dashboard";
import PrivateRoute from "./PrivateRoute";
import ProfilePage from "../Pages/ProfilePage";
import ClassesPage from "../Pages/ClassesPage";
import TrainersPage from "../Pages/TrainersPage";

import ForumPage from "../Pages/ForumPage";
import TrainerDetailsPage from "../Pages/TrainerDetailsPage";
import TrainerBookingPage from "../Pages/TrainerBookingPage";
import PaymentPage from "../Pages/PaymentPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/profile",
        element: (
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        ),
      },
      {
        path: "/classes",
        element: <ClassesPage />,
      },
      {
        path: "/trainers",
        element: <TrainersPage />,
      },
      {
        path: "/trainers/:id",
        element: <TrainerDetailsPage />,
      },
      {
          
        path: "/booking/:trainerId/:day/:time",
        element: <TrainerBookingPage></TrainerBookingPage>
      
      },
      {
        path: "/payment",
        element: <PaymentPage></PaymentPage>
      },
      {
        path: "/forum",
        element: <ForumPage />,
      },
    ],
  },
  // Auth routes
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
    ],
  },
  // Dashboard routes
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default router;
