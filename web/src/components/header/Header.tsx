import { constants } from "@shared";
import { Link } from "react-router";
import logo from "../../assets/logo_app.svg";

function Header() {
	return (
		<header className="header">
			<Link to={constants.ROUTE_HOME} className="header-logo">
				<img src={logo} alt="logo_app" className="header-logo-img" />
				{import.meta.env.VITE_APP_NAME}
			</Link>
			<nav className="header-nav" aria-label="Navigation principale">
				<Link to={constants.ROUTE_HOME} className="header-nav-link">
					Accueil
				</Link>
				<a href="#about" className="header-nav-link">
					Le projet
				</a>
				<a href="#stack" className="header-nav-link">
					Stack technique
				</a>
			</nav>
		</header>
	);
}

export default Header;
