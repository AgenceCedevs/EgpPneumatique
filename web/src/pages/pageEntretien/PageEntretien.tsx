import { constants } from "@shared";
import type { ReactElement } from "react";
import { Link } from "react-router";
import BeforeAfter from "../../components/beforeAfter/BeforeAfter";
import Seo from "../../components/seo/Seo";

const DESCRIPTION = [
	"Quel que soit le problème rencontré avec le pneumatique de votre bateau, notre équipe peut vous accompagner : de la réparation au retubage complet, en passant par l'entretien et la conservation de votre embarcation.",
	"Nous intervenons notamment sur les fuites de toutes dimensions, le doublage du flotteur, la liaison coque-flotteur, le remplacement de flotteur, le recollage de tableau ou de fond d'annexe et le remplacement d'accessoires.",
	"Une petite boutique est également disponible à l'atelier. Contactez-nous pour connaître les articles proposés.",
];

const KEY_FACTS = [
	{ value: "06", label: "types d'intervention" },
	{ value: "03", label: "axes : entretien, réparation, conservation" },
	{ value: "Toutes", label: "tailles de fuites" },
	{ value: "01", label: "atelier avec boutique" },
];

const SKILLS = [
	{ title: "Réparation de fuites", text: "Recherche et réparation de fuites, quelle que soit leur dimension." },
	{ title: "Doublage et remplacement", text: "Doublage du flotteur ou remplacement complet lorsqu'une réparation ne suffit plus." },
	{ title: "Liaison coque-flotteur", text: "Réparation des collages et de la liaison entre la coque et le flotteur." },
	{ title: "Recollage d'annexe", text: "Recollage du tableau et du fond d'annexe." },
	{ title: "Remplacement d'accessoires", text: "Remplacement des valves et des accessoires usés ou endommagés." },
	{ title: "Conseils d'entretien", text: "Des conseils adaptés pour entretenir et conserver votre bateau pneumatique." },
];

const GALLERY = [
	{
		id: "entretien-comparison-1",
		title: "Entretien bateau — illustration 1",
		before: "/images/stock/ocean-waves-unsplash.jpg",
		beforeAlt: "Vagues de l'océan, photo d'illustration",
		after: "/images/stock/motorboat-aerial-pexels.jpg",
		afterAlt: "Bateau vu du dessus, photo d'illustration",
	},
	{
		id: "entretien-comparison-2",
		title: "Entretien bateau — illustration 2",
		before: "/images/stock/motorboat-aerial-pexels.jpg",
		beforeAlt: "Bateau vu du dessus, photo d'illustration",
		after: "/images/stock/motorboat-cockpit-pexels.jpg",
		afterAlt: "Poste de pilotage d'un bateau, photo d'illustration",
	},
	{
		id: "entretien-comparison-3",
		title: "Entretien bateau — illustration 3",
		before: "/images/stock/motorboat-cockpit-pexels.jpg",
		beforeAlt: "Poste de pilotage d'un bateau, photo d'illustration",
		after: "/images/stock/ocean-waves-unsplash.jpg",
		afterAlt: "Vagues de l'océan, photo d'illustration",
	},
	{
		id: "entretien-gallery-1",
		title: "Bateau de plaisance — photo d'illustration",
		image: "/images/stock/motorboat-cockpit-pexels.jpg",
		imageAlt: "Poste de pilotage d'un bateau, photo d'illustration",
	},
];

function PageEntretien(): ReactElement {
	return (
		<>
			<Seo title="Entretien et réparation bateau pneumatique" description="Entretien, recherche de fuite et petites réparations de bateaux pneumatiques et semi-rigides près d'Ancenis." path={constants.ROUTE_ENTRETIEN} />
			<main id="main-content" tabIndex={-1}>
				<section className="service-hero" style={{ backgroundImage: "url(/images/stock/motorboat-aerial-pexels.jpg)" }}>
					<div className="service-hero__overlay">
						<div className="container">
							<h1 className="service-hero__title">Entretien et petites réparations</h1>
						</div>
					</div>
				</section>

				<section className="section">
					<div className="container service-intro">
						<div className="service-intro__heading">
							<p className="service-kicker">Entretien et réparations</p>
							<h2>Notre service</h2>
							<fieldset className="service-intro__stats">
								<legend className="visually-hidden">Chiffres clés des prestations d'entretien</legend>
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
							<p>{DESCRIPTION[2]}</p>
							<Link className="service-intro__cta" to={constants.ROUTE_CONTACT}>Demander un diagnostic</Link>
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
						<h2>Besoin d'entretenir ou de réparer votre bateau ?</h2>
						<p>Parlez-nous du problème rencontré et nous vous orienterons vers la bonne solution.</p>
						<Link to={constants.ROUTE_CONTACT} className="btn btn--primary">
							Demander un diagnostic
						</Link>
					</div>
				</section>
			</main>
		</>
	);
}

export default PageEntretien;
