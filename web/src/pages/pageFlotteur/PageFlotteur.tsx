import { constants } from "@shared";
import type { ReactElement } from "react";
import { Link } from "react-router";
import BeforeAfter from "../../components/beforeAfter/BeforeAfter";
import Seo from "../../components/seo/Seo";

const DESCRIPTION = [
	"Spécialistes du nautisme, nous vous accompagnons pour l'entretien, la réparation ou le remplacement complet des flotteurs de votre bateau pneumatique ou semi-rigide.",
	"Selon son état, nous réparons le flotteur ou procédons à un retubage complet. Nous prenons les mesures, vous conseillons sur le matériau et la couleur, puis adaptons notre intervention à votre bateau.",
];

const KEY_FACTS = [
	{ value: "06", label: "types d'intervention" },
	{ value: "02", label: "solutions : réparation ou retubage" },
	{ value: "03", label: "éléments : flotteur, coque, accessoires" },
	{ value: "100%", label: "adapté à votre bateau" },
];

const SKILLS = [
	{ title: "Remplacement de flotteur", text: "Remplacement complet ou retubage selon l'état et les besoins de votre bateau." },
	{ title: "Doublage du flotteur", text: "Renforcement des zones sollicitées pour prolonger la durée de vie du flotteur." },
	{ title: "Liaison coque et flotteur", text: "Réparation des collages et des jonctions entre la coque et le flotteur." },
	{ title: "Réparations et recollages", text: "Réparation de fuites, recollage de tableau et du fond d'annexe." },
	{ title: "Remplacement d'accessoires", text: "Remplacement des valves, poignées et autres accessoires usés." },
	{ title: "Conseil et matériaux", text: "Choix des tissus et colles adaptés à votre bateau et à son utilisation." },
];

const GALLERY = [
	{
		id: "flotteur-comparison-1",
		title: "Bateau de plaisance — illustration 1",
		before: "/images/stock/motorboat-aerial-pexels.jpg",
		beforeAlt: "Bateau vu du dessus, photo d'illustration",
		after: "/images/stock/motorboat-cockpit-pexels.jpg",
		afterAlt: "Poste de pilotage d'un bateau, photo d'illustration",
	},
	{
		id: "flotteur-comparison-2",
		title: "Bateau de plaisance — illustration 2",
		before: "/images/stock/ocean-waves-unsplash.jpg",
		beforeAlt: "Vagues de l'océan, photo d'illustration",
		after: "/images/stock/motorboat-aerial-pexels.jpg",
		afterAlt: "Bateau vu du dessus, photo d'illustration",
	},
	{
		id: "flotteur-comparison-3",
		title: "Bateau de plaisance — illustration 3",
		before: "/images/stock/motorboat-cockpit-pexels.jpg",
		beforeAlt: "Poste de pilotage d'un bateau, photo d'illustration",
		after: "/images/stock/ocean-waves-unsplash.jpg",
		afterAlt: "Vagues de l'océan, photo d'illustration",
	},
	{
		id: "flotteur-gallery-1",
		title: "Bateau pneumatique — photo d'illustration",
		image: "/images/stock/motorboat-aerial-pexels.jpg",
		imageAlt: "Bateau vu du dessus, photo d'illustration",
	},
];

function PageFlotteur(): ReactElement {
	return (
		<>
			<Seo title="Changement de flotteur bateau pneumatique" description="Remplacement complet de flotteur pour bateaux pneumatiques et semi-rigides à Ancenis-Saint-Géréon. Devis gratuit." path={constants.ROUTE_FLOTTEUR} />
			<main id="main-content" tabIndex={-1}>
				<section className="service-hero" style={{ backgroundImage: "url(/images/stock/motorboat-cockpit-pexels.jpg)" }}>
					<div className="service-hero__overlay">
						<div className="container">
							<h1 className="service-hero__title">Changement de flotteur complet</h1>
						</div>
					</div>
				</section>

				<section className="section">
					<div className="container service-intro">
						<div className="service-intro__heading">
							<p className="service-kicker">Remplacement sur mesure</p>
							<h2>Notre service</h2>
							<fieldset className="service-intro__stats">
								<legend className="visually-hidden">Chiffres clés des prestations flotteur</legend>
								{KEY_FACTS.map((fact) => (
									<div key={fact.label} className="service-intro__stat">
										<span className="service-intro__stat-value">{fact.value}</span>
										<span className="service-intro__stat-label">{fact.label}</span>
									</div>
								))}
							</fieldset>
						</div>
						<div className="service-intro__copy">
							<p className="service-intro__lead">{DESCRIPTION[0]}</p>
							<p>{DESCRIPTION[1]}</p>
							<Link className="service-intro__cta" to={constants.ROUTE_CONTACT}>Parlons de votre bateau</Link>
						</div>
					</div>
				</section>

				<section className="section section--surface">
					<div className="container">
						<h2>Notre savoir-faire</h2>
						<ul className="skills">
							{SKILLS.map((skill) => (
								<li key={skill.title} className="skills__item">
									<h3>{skill.title}</h3>
									<p>{skill.text}</p>
								</li>
							))}
						</ul>
					</div>
				</section>

				<section className="section service-gallery">
					<div className="container">
						<h2>Nos réalisations en images</h2>
						<p className="service-comparison__note">Photos d'illustration : elles ne montrent pas une intervention EGP Pneumatique.</p>
						<div className="realisations">
							{GALLERY.map((item) => (
								<BeforeAfter key={item.id} item={item} />
							))}
						</div>
					</div>
				</section>

				<section className="section service-cta">
					<div className="container">
						<h2>Un projet de remplacement ou de réparation de flotteur ?</h2>
						<p>Décrivez-nous votre bateau et votre besoin pour obtenir un conseil adapté.</p>
						<Link to={constants.ROUTE_CONTACT} className="btn btn--primary">
							Demander un devis
						</Link>
					</div>
				</section>
			</main>
		</>
	);
}

export default PageFlotteur;
