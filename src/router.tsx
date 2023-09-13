import ProjectTaskPage from "./pages/ProjectTaskPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./pages/error-page.tsx";
import "./index.css";
import TicketPage from "./pages/TicketPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import RootLayout from "./layout/RootLayout.tsx";
import SearchResultsPage from "./pages/SearchResultsPage.tsx";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <RootLayout />,
		errorElement: <ErrorPage />,
		children: [
			{ path: "/", element: <HomePage />, errorElement: <ErrorPage /> },
			{ path: "group/:id", element: null, errorElement: <ErrorPage /> },
			{
				path: "project/:id",
				element: <ProjectTaskPage />,
				errorElement: <ErrorPage />,
			},
			{
				path: "ticket/:id",
				element: <TicketPage />,
				errorElement: <ErrorPage />,
			},
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
			{
				path: "search/:query",
				element: <SearchResultsPage />,
				errorElement: <ErrorPage />,
			},
		],
	},
]);
