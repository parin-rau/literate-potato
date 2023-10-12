import { createBrowserRouter } from "react-router-dom";
import "./index.css";

import ErrorPage from "./pages/error/error-page.tsx";

import AuthLayer from "./layout/AuthLayer.tsx";
import RootLayout from "./layout/RootLayout.tsx";

import HomePage from "./pages/home/HomePage.tsx";
import GroupHomePage from "./pages/home/GroupHomePage.tsx";
import ProjectHomePage from "./pages/home/ProjectHomePage.tsx";
import TicketHomePage from "./pages/home/TicketHomePage.tsx";

import LoginPage from "./pages/auth/LoginPage.tsx";
import RegisterPage from "./pages/auth/RegisterPage.tsx";

import GroupPage from "./pages/resource/GroupPage.tsx";
import ProjectPage from "./pages/resource/ProjectPage.tsx";
import TicketPage from "./pages/resource/TicketPage.tsx";
import ProfilePage from "./pages/resource/ProfilePage.tsx";
import AdminPage from "./pages/home/AdminPage.tsx";
import SearchResultsPage from "./pages/resource/SearchResultsPage.tsx";
import SettingsPage from "./pages/resource/SettingsPage.tsx";
import NotificationPage from "./pages/resource/NotificationPage.tsx";

export const router = createBrowserRouter([
	// AUTH PROTECTED ROUTES
	{
		path: "/",
		element: <AuthLayer />,
		errorElement: <ErrorPage />,
		children: [
			{
				path: "/",
				element: <RootLayout />,
				errorElement: <ErrorPage />,
				children: [
					// HOME PAGE
					{
						path: "/",
						element: <HomePage title="Home" />,
					},

					//OVERALL VIEWS

					{
						path: "group",
						element: <GroupHomePage />,
					},
					{
						path: "project",
						element: <ProjectHomePage title="Projects Home" />,
					},
					{
						path: "ticket",
						element: <TicketHomePage />,
					},
					{
						path: "user",
						element: <ProfilePage isCurrentUser />,
					},
					{
						path: "admin",
						element: <AdminPage />,
					},

					//RESOURCE VIEWS

					{
						path: "group/:id",
						element: <GroupPage />,
					},
					{
						path: "project/:id",
						element: <ProjectPage />,
					},
					{
						path: "ticket/:id",
						element: <TicketPage />,
					},
					{
						path: "user/:id",
						element: <ProfilePage />,
					},
					{
						path: "notification",
						element: <NotificationPage />,
					},
					{
						path: "settings",
						element: <SettingsPage />,
					},

					{
						path: "search/:query",
						element: <SearchResultsPage />,
					},
				],
			},

			// NO AUTH PROTECTION

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
]);
