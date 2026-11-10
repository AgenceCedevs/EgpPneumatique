import { Outlet } from "react-router";
import Footer from "../footer/Footer";
import Header from "../header/Header";

function Layout() {
	return (
		<div className="app-wrapper">
			<a className="skip-link" href="#main-content">
				Aller au contenu principal
			</a>
			<Header />
			<div className="main-content">
				<Outlet />
			</div>
			<Footer />
		</div>
	);
}

export default Layout;
