import emailjs from "@emailjs/browser";
import { constants } from "@shared";
import type { FormEvent } from "react";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Seo from "../../components/seo/Seo";
import "./PageContact.css";

type Step = {
	title: string;
	text: string;
};

const STEPS: readonly Step[] = [
	{
		title: "Vous nous contactez",
		text: "Par téléphone ou via le formulaire, avec quelques photos si possible.",
	},
	{
		title: "Diagnostic et devis",
		text: "Nous examinons votre demande et vous envoyons un devis clair et gratuit.",
	},
	{
		title: "Réparation",
		text: "Dès votre accord, nous réalisons les travaux dans notre atelier.",
	},
	{
		title: "Livraison",
		text: "Nous vous remettons votre bateau contrôlé et prêt à naviguer.",
	},
];

const OTHER_SERVICE = "Autre demande";
const SERVICES = ["Changement de flotteur", "Entretien bateau", "Pneumatiques divers"] as const;
const MAX_ATTACHMENT_SIZE = 5 * 1024 * 1024;

function ContactForm() {
	const [isSending, setIsSending] = useState<boolean>(false);

	const onSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
		event.preventDefault();
		const form = event.currentTarget;
		const data = new FormData(form);

		// Anti-spam : le champ « website » doit rester vide
		if (data.get("website")) {
			return;
		}

		const attachment = data.get("attachment");
		if (attachment instanceof File && attachment.name && attachment.size > MAX_ATTACHMENT_SIZE) {
			toast.error("La pièce jointe dépasse la taille maximale de 5 Mo.");
			return;
		}

		const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
		const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
		const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

		if (!serviceId || !templateId || !publicKey) {
			toast.error(`Le formulaire n'est pas disponible pour le moment. Appelez-nous au ${constants.COMPANY.phoneDisplay}.`);
			return;
		}

		setIsSending(true);
		try {
			await emailjs.sendForm(serviceId, templateId, form, { publicKey });
			form.reset();
			toast.success("Merci, votre message est bien envoyé. Nous vous répondons rapidement.");
		} catch {
			toast.error(`L'envoi a échoué. Réessayez ou appelez-nous au ${constants.COMPANY.phoneDisplay}.`);
		} finally {
			setIsSending(false);
		}
	};

	return (
		<form className="form" onSubmit={onSubmit}>
			<div className="form__row">
				<label className="form__field">
					Nom et prénom
					<input type="text" name="name" autoComplete="name" required />
				</label>
				<label className="form__field">
					Téléphone
					<input type="tel" name="phone" autoComplete="tel" required />
				</label>
			</div>

			<div className="form__row">
				<label className="form__field">
					E-mail
					<input type="email" name="email" autoComplete="email" required />
				</label>
				<label className="form__field">
					Votre demande concerne
					<select name="service" defaultValue={SERVICES[0]}>
						{SERVICES.map((service) => (
							<option key={service} value={service}>
								{service}
							</option>
						))}
						<option value={OTHER_SERVICE}>{OTHER_SERVICE}</option>
					</select>
				</label>
			</div>

			<label className="form__field">
				Votre message
				<textarea name="message" rows={6} required />
			</label>

			<label className="form__field">
				Pièce jointe (facultative)
				<input type="file" name="attachment" accept="image/jpeg,image/png,image/webp,application/pdf" />
				<span className="form__hint">Photo ou PDF, 5 Mo maximum. Ajoutez ce champ comme pièce jointe de formulaire « attachment » dans votre modèle EmailJS.</span>
			</label>

			{/* Champ piège anti-spam, invisible pour les personnes */}
			<div className="visually-hidden" aria-hidden="true">
				<label>
					Ne pas remplir
					<input type="text" name="website" tabIndex={-1} autoComplete="off" />
				</label>
			</div>

			<label className="form__consent">
				<input type="checkbox" name="consent" required />
				<span>J'accepte que mes informations soient utilisées pour répondre à ma demande.</span>
			</label>

			<button type="submit" className="btn btn--primary" disabled={isSending}>
				{isSending ? "Envoi en cours…" : "Envoyer ma demande"}
			</button>
		</form>
	);
}

function PageContact() {
	return (
		<>
			<Seo title="Contact et devis gratuit" description="Contactez EGP Pneumatique à Ancenis-Saint-Géréon pour un devis gratuit : réparation de bateaux pneumatiques, semi-rigides et structures gonflables." path={constants.ROUTE_CONTACT} />
			<main id="main-content" tabIndex={-1}>
				<section className="service-hero" style={{ backgroundImage: "url(/images/stock/motorboat-cockpit-pexels.jpg)" }}>
					<div className="service-hero__overlay">
						<div className="container">
							<h1 className="service-hero__title">Contact</h1>
						</div>
					</div>
				</section>

				<section className="section">
					<div className="container contact">
						<div className="contact__info">
							<h2>Parlons de votre bateau</h2>
							<ul className="contact__list">
								<li>
									<span className="contact__label">Téléphone</span>
									<a href={constants.COMPANY.phoneHref}>{constants.COMPANY.phoneDisplay}</a>
								</li>
								<li>
									<span className="contact__label">E-mail</span>
									<a href={`mailto:${constants.COMPANY.email}`}>{constants.COMPANY.email}</a>
								</li>
								<li>
									<span className="contact__label">Adresse</span>
									<a href={constants.COMPANY.mapsUrl} target="_blank" rel="noopener noreferrer">
										{constants.COMPANY.street}, {constants.COMPANY.postalCode} {constants.COMPANY.city}
									</a>
								</li>
								<li>
									<span className="contact__label">Horaires</span>
									{constants.COMPANY.hours}
								</li>
							</ul>
						</div>
						<ContactForm />
					</div>
				</section>

				<section className="section section--surface">
					<div className="container">
						<h2>Comment ça se passe ?</h2>
						<ol className="steps">
							{STEPS.map((step) => (
								<li key={step.title} className="steps__item">
									<h3>{step.title}</h3>
									<p>{step.text}</p>
								</li>
							))}
						</ol>
					</div>
				</section>

				<section className="map" aria-label="Plan d'accès">
					<div className="container map__heading">
						<h2>Où sommes-nous ?</h2>
					</div>
					<iframe title="Carte : EGP Pneumatique, Ancenis-Saint-Géréon" src={constants.COMPANY.mapsEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
				</section>

				<ToastContainer position="top-center" />
			</main>
		</>
	);
}

export default PageContact;
