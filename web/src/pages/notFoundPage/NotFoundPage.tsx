import "./NotFoundPage.css";
import { Link, useLocation } from "react-router";
import Seo from "../../components/seo/Seo";

function NotFoundPage() {
	const { pathname } = useLocation();

	return (
		<>
			<Seo title="Page introuvable" description="La page demandée est introuvable." path={pathname} noIndex />
			<main className="nf" id="main-content" tabIndex={-1}>
				<div className="nf__grid" aria-hidden="true" />
				<section className="nf__inner">
					<span className="nf__code" aria-hidden="true">
						404
					</span>
					<h1 className="nf__title">Page introuvable.</h1>
					<p className="nf__sub">Cette page n'existe pas ou a été déplacée.</p>
					<nav aria-label="Navigation de la page introuvable">
						<Link to="/" className="nf__btn">
							Retour à l'accueil
						</Link>
					</nav>
				</section>
			</main>
		</>
	);
}

export default NotFoundPage;
