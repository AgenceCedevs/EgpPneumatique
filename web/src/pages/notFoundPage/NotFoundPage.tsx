import { constants } from "@shared";
import { Link, useLocation } from "react-router";
import Seo from "../../components/seo/Seo";
import "./NotFoundPage.css";

function NotFoundPage() {
	const { pathname } = useLocation();

	return (
		<>
			<Seo title="Page introuvable" description="La page demandée est introuvable." path={pathname} noIndex />
			<main className="nf" id="main-content" tabIndex={-1}>
				<div className="container nf__inner">
					<p className="nf__code" aria-hidden="true">
						404
					</p>
					<h1>Page introuvable</h1>
					<p>Cette page n'existe pas ou a été déplacée.</p>
					<Link to={constants.ROUTE_HOME} className="btn btn--primary">
						Retour à l'accueil
					</Link>
				</div>
			</main>
		</>
	);
}

export default NotFoundPage;
