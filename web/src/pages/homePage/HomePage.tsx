import { constants } from "@shared";
import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import LocalBusinessSchema from "../../components/seo/LocalBusinessSchema";
import Seo from "../../components/seo/Seo";
import "./HomePage.css";
import "@fontsource/caveat/400.css";

type HeroSlide = {
	src: string;
	alt: string;
};

type Stat = {
	value: string;
	label: string;
};

const HERO_SLIDES: readonly HeroSlide[] = [
	{ src: "/images/stock/motorboat-aerial-pexels.jpg", alt: "Bateau photographié depuis les airs au large" },
	{ src: "/images/stock/motorboat-cockpit-pexels.jpg", alt: "Poste de pilotage d'un bateau sur l'eau" },
	{ src: "/images/stock/ocean-waves-unsplash.jpg", alt: "Vagues de l'océan" },
];

// TODO : remplacer par les vrais chiffres de l'entreprise
const STATS: readonly Stat[] = [
	{ value: "15 ans", label: "d'expérience" },
	{ value: "Gratuit", label: "devis sous 48 h" },
	{ value: "24 h", label: "délai de réponse" },
	{ value: "500+", label: "bateaux réparés" },
];

const SERVICES = [
	{
		slug: "flotteur",
		path: constants.ROUTE_FLOTTEUR,
		navLabel: "Changement de flotteur",
		summary: "Votre flotteur est usé ou déchiré ? Nous le remplaçons entièrement, à l'identique ou sur mesure.",
		cardImage: "/images/stock/motorboat-cockpit-pexels.jpg",
		cardImageAlt: "Poste de pilotage d'un bateau sur l'eau, photo illustrative",
	},
	{
		slug: "entretien",
		path: constants.ROUTE_ENTRETIEN,
		navLabel: "Entretien bateau",
		summary: "Fuite, couture ouverte, boudin qui se dégonfle : nous remettons votre bateau en état rapidement.",
		cardImage: "/images/stock/motorboat-aerial-pexels.jpg",
		cardImageAlt: "Bateau photographié depuis les airs au large, photo illustrative",
	},
	{
		slug: "gonflable",
		path: constants.ROUTE_GONFLABLE,
		navLabel: "Pneumatiques divers",
		summary: "Événementiel, publicité, aires de jeux : nous réparons et entretenons vos structures gonflables.",
		cardImage: "/images/stock/ocean-waves-unsplash.jpg",
		cardImageAlt: "Vagues de l'océan, photo illustrative",
	},
] as const;

type Partner = {
	name: string;
	logo: string;
	url?: string;
};

// TODO : remplacer par les vrais partenaires et déposer les logos dans public/partners/
const PARTNERS: readonly Partner[] = [
	{ name: "Partenaire 1", logo: "/partners/partenaire-1.svg", url: "https://www.example.com" },
	{ name: "Partenaire 2", logo: "/partners/partenaire-1.svg", url: "https://www.example.com" },
	{ name: "Partenaire 3", logo: "/partners/partenaire-1.svg" },
	{ name: "Partenaire 4", logo: "/partners/partenaire-1.svg" },
	{ name: "Partenaire 5", logo: "/partners/partenaire-1.svg" },
	{ name: "Partenaire 6", logo: "/partners/partenaire-1.svg" },
	{ name: "Partenaire 7", logo: "/partners/partenaire-1.svg" },
	{ name: "Partenaire 8", logo: "/partners/partenaire-1.svg" },
];

const SLIDE_DELAY_MS = 6000;

function HeroCarousel(): ReactElement {
	const [current, setCurrent] = useState<number>(0);
	const [isPaused, setIsPaused] = useState<boolean>(false);

	useEffect(() => {
		const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (isPaused || reduceMotion) {
			return undefined;
		}
		const timer = window.setInterval(() => {
			setCurrent((previous) => (previous + 1) % HERO_SLIDES.length);
		}, SLIDE_DELAY_MS);
		return () => window.clearInterval(timer);
	}, [isPaused]);

	return (
		<section className="hero" aria-label="Présentation">
			{HERO_SLIDES.map((slide, index) => (
				<div key={slide.src} className={`hero__slide${index === current ? " hero__slide--active" : ""}`} aria-hidden={index !== current}>
					<img src={slide.src} alt={slide.alt} loading="eager" decoding="async" />
				</div>
			))}
			<div className="hero__shade" />

			<div className="container hero__content">
				<h1 className="hero__title">{constants.COMPANY.slogan}</h1>
				<p className="hero__text">Réparation de bateaux pneumatiques et semi-rigides, ainsi que de structures gonflables, à Ancenis-Saint-Géréon.</p>
				<div className="hero__actions">
					<a href="#services" className="btn btn--primary">
						Découvrir nos services
					</a>
					<Link to="/contact" className="btn btn--outline">
						Nous contacter
					</Link>
				</div>
			</div>

			<div className="hero__dots">
				<button type="button" className="hero__pause" onClick={() => setIsPaused((previous) => !previous)}>
					{isPaused ? "Lecture" : "Pause"}
				</button>
				{HERO_SLIDES.map((slide, index) => (
					<button key={slide.src} type="button" className={`hero__dot${index === current ? " hero__dot--active" : ""}`} aria-label={`Afficher l'image ${index + 1} sur ${HERO_SLIDES.length}`} aria-current={index === current} onClick={() => setCurrent(index)} />
				))}
			</div>
		</section>
	);
}

function HomePage(): ReactElement {
	return (
		<>
			<Seo title="Réparation de bateaux pneumatiques à Ancenis" description="Réparation de bateaux pneumatiques, semi-rigides et structures gonflables à Ancenis-Saint-Géréon. Changement de flotteur, entretien, devis gratuit." path="/" />
			<LocalBusinessSchema />

			<main id="main-content" tabIndex={-1}>
				<HeroCarousel />

				<section className="band" aria-label="Nos engagements">
					<ul className="container band__list">
						{STATS.map((stat) => (
							<li key={stat.label} className="band__item">
								<span className="band__value">{stat.value}</span>
								<span className="band__label">{stat.label}</span>
							</li>
						))}
					</ul>
				</section>

				<section className="section">
					<div className="container welcome">
						<div>
							<h2>Bienvenue chez EGP Pneumatique</h2>
							<p>EGP Pneumatique, c'est un atelier à taille humaine, spécialisé dans la pneumatique de votre bateau : fabrication, entretien et réparation. Forts de nos années d'expérience, nous proposons des prestations sur mesure, adaptées à votre bateau et à vos attentes.</p>
							<p>
								Depuis notre atelier d'Ancenis-Saint-Géréon, nous réparons et remettons en état les bateaux pneumatiques, les semi-rigides et les structures gonflables. Nous assurons aussi l'entretien complet des bateaux : réparation des pneumatiques, retubage, fabrication sur mesure et nettoyage intérieur et
								extérieur. Un entretien régulier prolonge la durée de vie de vos pneumatiques et de vos équipements.
							</p>
							<p>
								Nous fabriquons et réparons également tous types de structures gonflables (stands, mange-debout, cubes promotionnels, paddles, pontons, bouées, etc.), pour les particuliers comme pour les professionnels. Notre objectif : vous redonner le plaisir de naviguer, en toute confiance, avec une réparation
								durable et un prix annoncé d'avance.
							</p>
							<p className="welcome__signature">
								Emmelyne et Guillaume
								<br />
								gérants d'EGP Pneumatique
							</p>
						</div>
						<img className="welcome__image" src="/images/stock/motorboat-cockpit-pexels.jpg" alt="Poste de pilotage d'un bateau sur l'eau" loading="lazy" />
					</div>
				</section>

				<section id="services" className="section section--surface">
					<div className="container">
						<h2>Nos services</h2>
						<p className="services-intro">Trois savoir-faire, rien de plus : nous nous concentrons sur ce que nous maîtrisons vraiment. Chaque intervention est réalisée dans notre atelier, avec des matériaux adaptés à votre bateau, pour vous garantir un travail soigné, durable et un prix annoncé d'avance.</p>
						<ul className="cards">
							{SERVICES.map((service) => (
								<li key={service.slug} className="card">
									<img className="card__image" src={service.cardImage} alt={service.cardImageAlt} loading="lazy" />
									<div className="card__body">
										<h3>
											<Link to={service.path} className="card__link">
												{service.navLabel}
											</Link>
										</h3>
										<p>{service.summary}</p>
									</div>
								</li>
							))}
						</ul>
					</div>
				</section>

				<section id="partners" className="section section--white" aria-labelledby="partners-title">
					<div className="container">
						<h2 id="partners-title">Nos partenaires</h2>
						<p className="partners__intro">Nous nous appuyons sur des partenaires de confiance pour vous proposer des solutions fiables, adaptées à votre bateau.</p>
						<ul className="partners">
							{PARTNERS.map((partner) => {
								const logo = <img className="partners__logo" src={partner.logo} alt={partner.name} loading="lazy" />;
								return (
									<li key={partner.name} className="partners__item">
										{partner.url ? (
											<a href={partner.url} className="partners__link" target="_blank" rel="noopener noreferrer" aria-label={`${partner.name} (s'ouvre dans un nouvel onglet)`}>
												{logo}
											</a>
										) : (
											logo
										)}
									</li>
								);
							})}
						</ul>
					</div>
				</section>

				<section className="final-cta" aria-labelledby="final-cta-title">
					<div className="container final-cta__inner">
						<h2 id="final-cta-title">Un devis pour votre bateau ?</h2>
						<p className="final-cta__text">Décrivez-nous votre besoin : nous revenons vers vous sous 24 h avec un devis clair et gratuit, sans engagement.</p>
						<div className="final-cta__actions">
							<Link to="/contact" className="btn btn--primary">
								Demander un devis gratuit
							</Link>
						</div>
						<ul className="final-cta__points">
							<li>Devis gratuit sous 48 h</li>
							<li>Réponse sous 24 h</li>
							<li>Atelier à Ancenis-Saint-Géréon</li>
						</ul>
					</div>
				</section>
			</main>
		</>
	);
}

export default HomePage;
