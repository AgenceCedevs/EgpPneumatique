import { constants } from "@shared";
import { useEffect, useRef } from "react";
import { createBrowserRouter, Outlet, useLocation } from "react-router";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/homePage/HomePage";
import NotFoundPage from "./pages/notFoundPage/NotFoundPage";
import PageContact from "./pages/pageContact/PageContact";
import PageEntretien from "./pages/pageEntretien/PageEntretien";
import PageFlotteur from "./pages/pageFlotteur/PageFlotteur";
import PageGonflable from "./pages/pageGonflable/PageGonflable";

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
				children: [
					{ index: true, element: <HomePage /> },
					{ path: constants.ROUTE_FLOTTEUR, element: <PageFlotteur /> },
					{ path: constants.ROUTE_ENTRETIEN, element: <PageEntretien /> },
					{ path: constants.ROUTE_GONFLABLE, element: <PageGonflable /> },
					{ path: constants.ROUTE_CONTACT, element: <PageContact /> },
				],
			},
		],
	},
	{ path: "*", element: <NotFoundPage /> },
]);

export default router;
