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

export const router = createBrowserRouter([
	// AUTH PROTECTED ROUTES
	{
		path: "/",
		element: <AuthLayer />,
		//errorElement: <ErrorPage />,
		children: [
			{
				path: "/",
				element: <RootLayout />,
				errorElement: <ErrorPage />,
				children: [
					// HOME PAGE
					{
						path: "/",
						element: <HomePage />,
						errorElement: <ErrorPage />,
					},

					//OVERALL VIEWS

					{
						path: "group",
						element: <GroupHomePage />,
						errorElement: <ErrorPage />,
					},
					{
						path: "project",
						element: <ProjectHomePage />,
						errorElement: <ErrorPage />,
					},
					{
						path: "ticket",
						element: <TicketHomePage />,
						errorElement: <ErrorPage />,
					},
					{
						path: "user",
						element: <ProfilePage />,
						errorElement: <ErrorPage />,
					},
					{
						path: "admin",
						element: <AdminPage />,
						errorElement: <ErrorPage />,
					},

					//RESOURCE VIEWS

					{
						path: "group/:id",
						element: <GroupPage />,
						errorElement: <ErrorPage />,
					},
					{
						path: "project/:id",
						element: <ProjectPage />,
						errorElement: <ErrorPage />,
					},
					{
						path: "ticket/:id",
						element: <TicketPage />,
						errorElement: <ErrorPage />,
					},
					{
						path: "user/:id",
						element: <ProfilePage />,
						errorElement: <ErrorPage />,
					},
					{
						path: "settings",
						element: <SettingsPage />,
						errorElement: <ErrorPage />,
					},

					{
						path: "search/:query",
						element: <SearchResultsPage />,
						errorElement: <ErrorPage />,
					},
				],
			},

			// NO AUTH PROTECTION

			{
				path: "login",
				element: <LoginPage />,
				errorElement: <ErrorPage />,
			},
			{
				path: "register",
				element: <RegisterPage />,
				errorElement: <ErrorPage />,
			},
		],
	},
]);
