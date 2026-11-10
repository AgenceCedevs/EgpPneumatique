import logo from "../../assets/logo_app.svg";

function Footer() {
	const year = new Date().getFullYear();

	return (
		<footer className="footer">
			<strong className="footer-brand">
				<img src={logo} alt="logo_app" className="footer-logo-img" />
				{import.meta.env.VITE_APP_NAME}
			</strong>
			<p>
				Tous droits réservés | site internet développé par{" "}
				<a className="footer-link" href="https://cedevs.fr" target="_blank" rel="noopener noreferrer">
					cedevs.fr
				</a>{" "}
				- Hébergé en France
			</p>
			<p>© {year}</p>
		</footer>
	);
}

export default Footer;
