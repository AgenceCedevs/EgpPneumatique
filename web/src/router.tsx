import { useEffect, useRef } from "react";
import { createBrowserRouter, Outlet, useLocation } from "react-router";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/homePage/HomePage";
import NotFoundPage from "./pages/notFoundPage/NotFoundPage";

function Root() {
	const location = useLocation();
	const prevPathname = useRef(location.pathname);

	useEffect(() => {
		if (prevPathname.current !== location.pathname) {
			prevPathname.current = location.pathname;
			window.scrollTo(0, 0);
		}
	});

	return <Outlet />;
}

const router = createBrowserRouter([
	{
		path: "/",
		element: <Root />,
		children: [
			{
				element: <Layout />,
				errorElement: <NotFoundPage />,
				children: [{ index: true, element: <HomePage /> }],
			},
		],
	},
	{ path: "*", element: <NotFoundPage /> },
]);

export default router;
