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
        element: <PrivateRoute><ProfilePage /></PrivateRoute>,
      },
      {
        path: "/classes",
        element: <ClassesPage></ClassesPage>,
      },
    ],
  },
  // -----------------------------------------
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
  // -------------------------------------------
  {
    path: "/dashboard",
    element: <DashboardLayout></DashboardLayout>,
    children: [
      {
        index:"true",
        element: <PrivateRoute><Dashboard></Dashboard></PrivateRoute>
        
      }
    ]
  },
]);

export default router;
