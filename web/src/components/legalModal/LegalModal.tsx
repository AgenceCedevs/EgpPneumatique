import { constants } from "@shared";
import type { ReactElement } from "react";
import { useEffect, useRef } from "react";
import "./LegalModal.css";

export type LegalKind = "mentions" | "cgu";

type LegalModalProps = {
	kind: LegalKind | null;
	onClose: () => void;
};

function Mentions(): ReactElement {
	return (
		<>
			<h2 id="legal-title">Mentions légales</h2>
			<h3>Éditeur du site</h3>
			<p>
				{constants.COMPANY.name}
				<br />
				{constants.COMPANY.street}, {constants.COMPANY.postalCode} {constants.COMPANY.city}
				<br />
				Téléphone : {constants.COMPANY.phoneDisplay}
				<br />
				E-mail : {constants.COMPANY.email}
			</p>
			{/* TODO : compléter avec les informations légales réelles */}
			<p>Forme juridique : [à compléter]. SIRET : [à compléter]. Directeur de la publication : [à compléter].</p>
			<h3>Conception et hébergement</h3>
			<p>Site développé par cedevs.fr. Hébergeur : [à compléter]. Hébergé en France.</p>
			<h3>Données personnelles</h3>
			<p>Les informations saisies dans le formulaire de contact servent uniquement à répondre à votre demande. Vous pouvez demander leur accès, leur rectification ou leur suppression en nous écrivant à l'adresse e-mail ci-dessus.</p>
		</>
	);
}

function Cgu(): ReactElement {
	return (
		<>
			<h2 id="legal-title">Conditions générales d'utilisation</h2>
			{/* TODO : faire valider ce texte par un professionnel du droit */}
			<h3>Objet</h3>
			<p>Ces conditions encadrent l'utilisation du site {constants.COMPANY.name}. En naviguant sur ce site, vous les acceptez.</p>
			<h3>Contenu du site</h3>
			<p>Les textes, images et logos présents sur ce site sont la propriété d'{constants.COMPANY.name}. Toute reproduction sans autorisation est interdite.</p>
			<h3>Responsabilité</h3>
			<p>Nous veillons à l'exactitude des informations publiées, sans pouvoir garantir l'absence d'erreur. Les devis restent établis après examen de votre bateau ou de votre structure.</p>
			<h3>Droit applicable</h3>
			<p>Le droit français s'applique. Les tribunaux français sont compétents.</p>
		</>
	);
}

function LegalModal({ kind, onClose }: LegalModalProps): ReactElement {
	const dialogRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) {
			return undefined;
		}
		if (kind && !dialog.open) {
			dialog.showModal();
		}
		if (!kind && dialog.open) {
			dialog.close();
		}
		return undefined;
	}, [kind]);

	return (
		<dialog ref={dialogRef} className="legal-modal" aria-labelledby="legal-title" onClose={onClose}>
			<div className="legal-modal__body">
				{kind === "mentions" ? <Mentions /> : null}
				{kind === "cgu" ? <Cgu /> : null}
			</div>
			<button type="button" className="btn btn--primary" onClick={onClose}>
				Fermer
			</button>
		</dialog>
	);
}

export default LegalModal;
