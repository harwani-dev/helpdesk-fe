import { Register } from "@/pages/register";
import { Login } from "@/pages/login"
import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "@/layout/MainLayout";
import Dashboard from "@/pages/dashboard";
import CreateTicket from "@/pages/CreateTicket";
import Profile from "@/pages/Profile";
import TicketsPage from "@/pages/tickets";
import ActivityPage from "@/pages/activity";
import Feedback from "@/pages/Feedback";
import NotFound from "@/pages/NotFound";

const RootRedirect = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    const target = token ? "/dashboard" : "/login"

    return <Navigate to={target} replace />
}

export const router = createBrowserRouter([
    {
        element: <MainLayout />,
        children: [
            { path: "/dashboard", element: <Dashboard /> },
            { path: "/create", element: <CreateTicket /> },
            { path: "/tickets", element: <TicketsPage /> },
            { path: "/activity", element: <ActivityPage /> },
            { path: "/feedback", element: <Feedback /> },
            { path: "/profile", element: <Profile /> },
        ]
    },
    {
        children: [
            { path: "/", element: <RootRedirect /> },
            { path: "/login", element: <Login /> },
            { path: "/register", element: <Register /> },
            { path: "*", element: <NotFound /> },
        ]
    }
])