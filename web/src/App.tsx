import { HelmetProvider } from "react-helmet-async";
import { RouterProvider } from "react-router";
import ErrorBoundary from "./components/errorBoundary/ErrorBoundary";
import router from "./router";

function App() {
	return (
		<ErrorBoundary>
			<HelmetProvider>
				<RouterProvider router={router} />
			</HelmetProvider>
		</ErrorBoundary>
	);
}

export default App;
