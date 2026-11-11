import { constants } from "@shared";
import type { ReactElement } from "react";
import { useState } from "react";
import { Link } from "react-router";
import logo from "../../assets/logo_app.svg";
import type { LegalKind } from "../legalModal/LegalModal";
import LegalModal from "../legalModal/LegalModal";
import "./Footer.css";

function Footer(): ReactElement {
	const [legal, setLegal] = useState<LegalKind | null>(null);

	return (
		<footer className="footer">
			<div className="container footer__grid">
				<div className="footer__brand">
					<Link to="/" className="footer__logo">
						<img src={logo} alt="EGP Pneumatique" />
					</Link>
					<p>{constants.COMPANY.slogan}</p>
					<Link to="/contact" className="btn btn--primary">
						Nous contacter
					</Link>
				</div>

				<nav className="footer__col" aria-label="Plan du site">
					<h2 className="footer__title">Navigation</h2>
					<ul className="footer__list">
						<li>
							<Link to="/" className="footer__link">
								Accueil
							</Link>
						</li>
						{constants.NAV_LINKS.map((link) => (
							<li key={link.to}>
								<Link to={link.to} className="footer__link">
									{link.label}
								</Link>
							</li>
						))}
					</ul>
				</nav>

				<address className="footer__col footer__address">
					<h2 className="footer__title">Nous trouver</h2>
					<p>
						<a className="footer__link" href={constants.COMPANY.phoneHref}>
							{constants.COMPANY.phoneDisplay}
						</a>
					</p>
					<p>
						<a className="footer__link" href={constants.COMPANY.mapsUrl} target="_blank" rel="noopener noreferrer">
							{constants.COMPANY.street}
							<br />
							{constants.COMPANY.postalCode} {constants.COMPANY.city}
						</a>
					</p>
					<p>{constants.COMPANY.hours}</p>
				</address>

				<div className="footer__col">
					<h2 className="footer__title">Informations</h2>
					<ul className="footer__list">
						<li>
							<button type="button" className="footer__link footer__legal-button" onClick={() => setLegal("mentions")}>
								Mentions légales
							</button>
						</li>
						<li>
							<button type="button" className="footer__link footer__legal-button" onClick={() => setLegal("cgu")}>
								CGU
							</button>
						</li>
						<li>
							<a className="footer__link" href={constants.COMPANY.googleReviewUrl} target="_blank" rel="noopener noreferrer">
								Laisser un avis Google
							</a>
						</li>
						{constants.COMPANY.socials.map((social) => (
							<li key={social.label}>
								<a className="footer__link" href={social.href} target="_blank" rel="noopener noreferrer">
									{social.label}
								</a>
							</li>
						))}
					</ul>
				</div>
			</div>

			<div className="footer__bottom">
				<div className="container">
					<p className="footer__credits">
						Tous droits réservés | site internet développé par{" "}
						<a className="footer__link" href="https://cedevs.fr" target="_blank" rel="noopener noreferrer">
							cedevs.fr
						</a>{" "}
						- Hébergé en France
					</p>
				</div>
			</div>
			<LegalModal kind={legal} onClose={() => setLegal(null)} />
		</footer>
	);
}

export default Footer;
