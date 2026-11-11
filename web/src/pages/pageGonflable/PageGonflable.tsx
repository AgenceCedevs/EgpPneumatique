import { constants } from "@shared";
import type { ReactElement } from "react";
import { Link } from "react-router";
import BeforeAfter from "../../components/beforeAfter/BeforeAfter";
import Seo from "../../components/seo/Seo";

const DESCRIPTION = [
	"Avec des années d'expérience pratique et de la connaissance EGP Pneumatique, nous pouvons également vous assister dans la fabrication et la réparation d'une large gamme de structures gonflables, et bien plus encore.",
	"Notre équipe sera heureuse de vous écouter, de comprendre votre projet et de travailler avec vous pour vous proposer une solution sur mesure.",
];

const KEY_FACTS = [
	{ value: "06", label: "prestations proposées" },
	{ value: "02", label: "expertises : confection et réparation" },
	{ value: "04", label: "types de confection" },
	{ value: "02", label: "équipements : paddle et spa" },
];

const SKILLS = [
	{ title: "Réparation Paddle", text: "Réparation de structures gonflables de type paddle." },
	{ title: "Réparation SPA", text: "Réparation de structures gonflables de type spa." },
	{ title: "Confection et réparation d'Arche gonflable", text: "Confection et réparation d'arches gonflables." },
	{ title: "Confection et réparation Bouée", text: "Confection et réparation de bouées gonflables." },
	{ title: "Confection Bain de soleil gonflable", text: "Confection de bains de soleil gonflables." },
	{ title: "Confection Prototype sur mesure", text: "Étude et confection de prototypes selon votre projet." },
];

const GALLERY = [
	{
		id: "gonflable-comparison-1",
		title: "Pneumatiques divers — illustration 1",
		before: "/images/stock/motorboat-cockpit-pexels.jpg",
		beforeAlt: "Poste de pilotage d'un bateau, photo d'illustration",
		after: "/images/stock/ocean-waves-unsplash.jpg",
		afterAlt: "Vagues de l'océan, photo d'illustration",
	},
	{
		id: "gonflable-comparison-2",
		title: "Pneumatiques divers — illustration 2",
		before: "/images/stock/ocean-waves-unsplash.jpg",
		beforeAlt: "Vagues de l'océan, photo d'illustration",
		after: "/images/stock/motorboat-aerial-pexels.jpg",
		afterAlt: "Bateau vu du dessus, photo d'illustration",
	},
	{
		id: "gonflable-comparison-3",
		title: "Pneumatiques divers — illustration 3",
		before: "/images/stock/motorboat-aerial-pexels.jpg",
		beforeAlt: "Bateau vu du dessus, photo d'illustration",
		after: "/images/stock/motorboat-cockpit-pexels.jpg",
		afterAlt: "Poste de pilotage d'un bateau, photo d'illustration",
	},
	{
		id: "gonflable-gallery-1",
		title: "Structures gonflables — photo d'illustration",
		image: "/images/stock/motorboat-cockpit-pexels.jpg",
		imageAlt: "Poste de pilotage d'un bateau, photo d'illustration",
	},
];

function PageGonflable(): ReactElement {
	return (
		<>
			<Seo title="Réparation de structures gonflables" description="Réparation de structures gonflables pour l'événementiel, la publicité et les aires de jeux, à Ancenis-Saint-Géréon." path={constants.ROUTE_GONFLABLE} />
			<main id="main-content" tabIndex={-1}>
				<section className="service-hero" style={{ backgroundImage: "url(/images/stock/ocean-waves-unsplash.jpg)" }}>
					<div className="service-hero__overlay">
						<div className="container">
							<h1 className="service-hero__title">Structures gonflables</h1>
						</div>
					</div>
				</section>

				<section className="section">
					<div className="container service-intro">
						<div className="service-intro__heading">
							<p className="service-kicker">Structures gonflables</p>
							<h2>Notre service</h2>
							<fieldset className="service-intro__stats">
								<legend className="visually-hidden">Chiffres clés des prestations</legend>
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
							<Link className="service-intro__cta" to={constants.ROUTE_CONTACT}>
								Parlons de votre projet
							</Link>
						</div>
					</div>
				</section>

				<section className="section section--surface">
					<div className="container">
						<h2>Notre savoir-faire en pneumatiques divers</h2>
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
						<h2>Un projet de structure gonflable ?</h2>
						<p>Parlez-nous de votre besoin, nous vous répondons rapidement.</p>
						<Link to="/contact" className="btn btn--primary">
							Demander un devis
						</Link>
					</div>
				</section>
			</main>
		</>
	);
}

export default PageGonflable;
