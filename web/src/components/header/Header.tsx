import { constants } from "@shared";
import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router";
import logo from "../../assets/logo_app.svg";
import "./Header.css";

function Header(): ReactElement {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const closeMenu = (): void => setIsOpen(false);

	useEffect(() => {
		if (!isOpen) {
			return undefined;
		}
		const onKeyDown = (event: KeyboardEvent): void => {
			if (event.key === "Escape") {
				setIsOpen(false);
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [isOpen]);

	return (
		<header className="header">
			<div className="container header__inner">
				<Link to="/" className="header__logo" onClick={closeMenu}>
					<img src={logo} alt="EGP Pneumatique" />
				</Link>

				<button type="button" className="header__burger" aria-expanded={isOpen} aria-controls="menu-principal" aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"} onClick={() => setIsOpen((previous) => !previous)}>
					<span className="header__burger-bar" aria-hidden="true" />
					<span className="header__burger-bar" aria-hidden="true" />
					<span className="header__burger-bar" aria-hidden="true" />
				</button>

				<nav id="menu-principal" className={`header__nav${isOpen ? " header__nav--open" : ""}`} aria-label="Navigation principale">
					<ul className="header__list">
						{constants.NAV_LINKS.map((link) => (
							<li key={link.to}>
								<NavLink to={link.to} className={({ isActive }) => (isActive ? "header__link header__link--active" : "header__link")} onClick={closeMenu}>
									{link.label}
								</NavLink>
							</li>
						))}
					</ul>
					<Link to="/contact" className="btn btn--primary header__cta" onClick={closeMenu}>
						Nous contacter
					</Link>
				</nav>
			</div>
		</header>
	);
}

export default Header;
