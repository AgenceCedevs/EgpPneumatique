import Seo from "../../components/seo/Seo";
import "./HomePage.css";

const stack = [
	{ name: "React", cat: "Web", color: "#61DAFB" },
	{ name: "React Native", cat: "Mobile", color: "#61DAFB" },
	{ name: "Expo", cat: "Mobile", color: "#1B1B1B" },
	{ name: "TypeScript", cat: "Language", color: "#3178C6" },
	{ name: "Vite", cat: "Build", color: "#646CFF" },
	{ name: "React Router 7", cat: "Routing", color: "#F44250" },
	{ name: "Express", cat: "Backend", color: "#68A063" },
	{ name: "PostgreSQL", cat: "Database", color: "#336791" },
	{ name: "JWT", cat: "Auth", color: "#D63AFF" },
	{ name: "Stripe", cat: "Payments", color: "#635BFF" },
	{ name: "Nodemailer", cat: "Email", color: "#0EA5E9" },
	{ name: "Biome", cat: "Tooling", color: "#60CFAC" },
	{ name: "Zod", cat: "Validation", color: "#F97316" },
	{ name: "Render", cat: "Deploy", color: "#46E3B7" },
];

const prereqs = [
	{
		icon: "🌐",
		label: "Google Chrome",
		note: "Navigateur principal pour le dev",
		type: "app",
	},
	{ icon: "📝", label: "VS Code", note: "Éditeur recommandé", type: "app" },
	{
		icon: "🟢",
		label: "Node.js 20+",
		note: "LTS - vérifie avec node --version",
		type: "cmd",
	},
	{ icon: "📦", label: "npm", note: "Vérifie avec npm --version", type: "cmd" },
	{ icon: "🔀", label: "Git", note: "Vérifie avec git --version", type: "cmd" },
	{
		icon: "🐳",
		label: "Docker Desktop",
		note: "Pour PostgreSQL en local",
		type: "app",
	},
	{
		icon: "🐘",
		label: "PostgreSQL 15+",
		note: "Via Docker ou installation directe",
		type: "cmd",
	},
	{
		icon: "🗄️",
		label: "TablePlus",
		note: "Client GUI pour la base de données",
		type: "app",
	},
	{
		icon: "📐",
		label: "Biome",
		note: "Extension VS Code - linting & formatting",
		type: "ext",
	},
];

function HomePage() {
	return (
		<>
			<Seo
				description="Découvrez une base de projet web et mobile organisée autour de React, TypeScript et des outils modernes."
				path="/"
				ogTitle={`${import.meta.env.VITE_APP_NAME} - Construire un monorepo web et mobile`}
				ogDescription="Une structure de monorepo pour démarrer des projets web et mobile avec une architecture cohérente."
				image="/og-image.webp"
			/>
			<main className="hp-home" id="main-content" tabIndex={-1}>
				{/* HERO SECTION */}
				<section className="hp-hero">
					<div className="hp-hero__noise" aria-hidden="true" />
					<div className="hp-hero__grid" aria-hidden="true" />
					<header className="hp-hero__inner">
						<span className="hp-badge">{import.meta.env.VITE_APP_NAME} · Monorepo · Web · Mobile · Full-stack</span>
						<h1 className="hp-hero__title">
							<span className="hp-hero__title-accent">{import.meta.env.VITE_APP_NAME}</span>
							<br />
							Le monorepo <br />
							Web & Mobile
							<br />
							dont on a besoin.
						</h1>
						<p className="hp-hero__sub">Une structure claire pour concevoir et faire évoluer des applications web et mobile avec des outils modernes.</p>
						<nav className="hp-hero__cta" aria-label="Navigation dans la page">
							<a href="#about" className="hp-btn hp-btn--primary">
								Découvrir le projet
							</a>
							<a href="#stack" className="hp-btn hp-btn--ghost">
								Découvrir la stack
							</a>
						</nav>
						<dl className="hp-hero__stats">
							<div className="hp-stat">
								<dt className="hp-stat__lbl">Web</dt>
								<dd className="hp-stat__num">React</dd>
							</div>
							<div className="hp-stat">
								<dt className="hp-stat__lbl">Mobile</dt>
								<dd className="hp-stat__num">Expo</dd>
							</div>
							<div className="hp-stat">
								<dt className="hp-stat__lbl">Codebase</dt>
								<dd className="hp-stat__num">1</dd>
							</div>
						</dl>
					</header>
				</section>

				{/* ABOUT SECTION */}
				<section className="hp-about" id="about">
					<header className="hp-section-inner">
						<p className="hp-eyebrow">C'est quoi {import.meta.env.VITE_APP_NAME} ?</p>
						<h2>Une base claire pour vos projets web et mobile.</h2>
					</header>
					<div className="hp-section-inner">
						<div className="hp-about__text">
							<p>{import.meta.env.VITE_APP_NAME} est une base de projet web et mobile qui rassemble les applications et leurs packages partagés dans une structure unique.</p>
							<p>L'objectif n'est pas uniquement d'écrire du code, mais de comprendre comment chaque couche s'articule (frontend, backend, base de données, infrastructure) et pourquoi elle est conçue ainsi.</p>
							<p>Le monorepo fournit un launcher pour démarrer en local le frontend, le backend et la base de données. Un vérificateur contrôle l'intégrité du projet et génère un rapport d'audit.</p>
							<p>Le monorepo {import.meta.env.VITE_APP_NAME} est directement réutilisable et s'adapte immédiatement à de futurs projets.</p>
						</div>
						<div className="hp-about__cards">
							{[
								{
									icon: "🏗️",
									title: "Une architecture modulaire",
									desc: "Les applications et les packages sont regroupés dans un même monorepo.",
								},
								{
									icon: "📱",
									title: "Web et mobile",
									desc: "Une base organisée pour les applications React et React Native.",
								},
								{
									icon: "⌨️",
									title: "TypeScript",
									desc: "Des types partagés pour améliorer la cohérence du code.",
								},
								{
									icon: "🛠️",
									title: "Outils modernes",
									desc: "Vite, Biome et les outils nécessaires au développement.",
								},
							].map((c) => (
								<article className="hp-feature-card" key={c.title}>
									<span className="hp-feature-card__icon" aria-hidden="true">
										{c.icon}
									</span>
									<h3>{c.title}</h3>
									<p>{c.desc}</p>
								</article>
							))}
						</div>
					</div>
				</section>

				{/* PREREQUISITES SECTION */}
				<section className="hp-prereq">
					<div className="hp-section-inner hp-section-inner--narrow">
						<header>
							<p className="hp-eyebrow">Avant de commencer</p>
							<h2>Installation requise</h2>
						</header>
						<dl className="hp-prereq__grid">
							{prereqs.map((p) => (
								<div className="hp-prereq__item" key={p.label}>
									<dt className="hp-prereq__label">
										<span className="hp-prereq__icon" aria-hidden="true">
											{p.icon}
										</span>
										<span className="hp-prereq__name">{p.label}</span>
										<span className={`hp-prereq__tag hp-prereq__tag--${p.type}`}>{p.type === "cmd" ? "CLI" : p.type === "ext" ? "Extension" : "App"}</span>
									</dt>
									<dd className="hp-prereq__description">{p.note}</dd>
								</div>
							))}
						</dl>
						<aside className="hp-prereq__note">
							<p>
								Le reste est fourni dans le monorepo ou accessible en ligne.
								<br /> <br />
								Ce monorepo est optimisé pour un environnement Windows.
								<br /> <br />
								Certaines fonctionnalités peuvent avoir un comportement différent ou ne pas être fonctionnelles sur macOS/Linux.
							</p>
						</aside>
					</div>
				</section>

				{/* TECH STACK SECTION */}
				<section className="hp-stack" id="stack">
					<div className="hp-section-inner">
						<header>
							<p className="hp-eyebrow">Stack technique</p>
							<h2>Des technos qui tiennent en production</h2>
						</header>
						<ul className="hp-stack__grid">
							{stack.map((s) => (
								<li key={s.name}>
									<span className="hp-stack__pill" style={{ "--accent": s.color } as React.CSSProperties}>
										<span className="hp-stack__pill-cat">{s.cat}</span>
										<span className="hp-stack__pill-name">{s.name}</span>
									</span>
								</li>
							))}
						</ul>
					</div>
				</section>

				{/* CTA FINAL SECTION */}
				<section className="hp-cta">
					<div className="hp-cta__noise" aria-hidden="true" />
					<div className="hp-section-inner hp-section-inner--narrow hp-cta__inner">
						<header>
							<h2>Démarrer un projet sur une base solide.</h2>
							<p>Découvrez la stack technique et choisissez les outils adaptés à votre projet.</p>
						</header>
						<nav aria-label="Découvrir la stack technique">
							<a href="#stack" className="hp-btn hp-btn--primary hp-btn--lg">
								Voir la stack technique
							</a>
						</nav>
					</div>
				</section>
			</main>
		</>
	);
}

export default HomePage;
