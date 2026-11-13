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

			<h3>1. Édition du site</h3>
			<p>En vertu de l'article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique, il est précisé l'identité des intervenants du site.</p>
			{/* TODO : compléter avec les informations légales réelles (supprimer les lignes sans objet) */}
			<address>
				<strong>Raison sociale :</strong> {constants.COMPANY.name}
				<br />
				<strong>Forme juridique :</strong> [à compléter]
				<br />
				<strong>Capital social :</strong> [à compléter, si société]
				<br />
				<strong>Adresse :</strong> {constants.COMPANY.street}, {constants.COMPANY.postalCode} {constants.COMPANY.city}, France
				<br />
				<strong>SIREN / SIRET :</strong> [à compléter]
				<br />
				<strong>Immatriculation :</strong> [RCS ou Répertoire des métiers, ville, à compléter]
				<br />
				<strong>Code APE / NAF :</strong> [à compléter]
				<br />
				<strong>N° TVA intracommunautaire :</strong> [à compléter]
				<br />
				<strong>Directeur de la publication :</strong> [à compléter]
				<br />
				<strong>Assurance responsabilité civile professionnelle :</strong> [assureur, n° de contrat et couverture géographique, à compléter]
				<br />
				<strong>Contact :</strong> <a href={`mailto:${constants.COMPANY.email}`}>{constants.COMPANY.email}</a> | {constants.COMPANY.phoneDisplay}
			</address>

			<h3>2. Conception et développement</h3>
			<p>
				Site conçu et développé par <strong>Cédevs</strong> (Cédric Gouyon, entrepreneur individuel) –{" "}
				<a href="https://cedevs.fr" target="_blank" rel="noopener noreferrer">
					cedevs.fr
				</a>
				.
			</p>

			<h3>3. Hébergement</h3>
			{/* TODO : vérifier que l'hébergeur indiqué est bien celui de ce site */}
			<p>Le site est hébergé par la société Clever Cloud (SAS), 4 rue Voltaire, 44000 Nantes, France (téléphone : 02 85 52 07 69), sur des serveurs situés en France.</p>

			<h3>4. Propriété intellectuelle</h3>
			<p>
				L'ensemble des contenus présents sur ce site (textes, photographies, logos, graphisme, code source propre au site) est la propriété exclusive de {constants.COMPANY.name}, hors contenus tiers mentionnés à la section 9 et hors composants open source soumis à leurs licences respectives. Toute reproduction,
				distribution ou modification, même partielle, est strictement interdite sans accord écrit préalable, conformément au Code de la propriété intellectuelle.
			</p>

			<h3>5. Limitation de responsabilité</h3>
			<p>
				{constants.COMPANY.name} s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site, sans pouvoir garantir l'absence d'erreur ou d'omission. Les informations présentées sont données à titre indicatif et ne constituent pas une offre contractuelle : seul un devis signé engage{" "}
				{constants.COMPANY.name}. Le site peut être rendu momentanément indisponible, notamment pour des raisons de maintenance, sans que {constants.COMPANY.name} puisse en être tenu responsable. Les liens vers des sites tiers sont fournis à titre informatif, et {constants.COMPANY.name} n'est pas responsable de leur
				contenu.
			</p>

			<h3>6. Droit applicable et juridiction</h3>
			<p>Les présentes mentions légales sont régies par le droit français. Après toute tentative de résolution amiable, tout litige est porté devant les tribunaux compétents. Lorsque l'utilisateur est un consommateur, il conserve le bénéfice des règles légales de compétence.</p>

			<h3>7. Données personnelles et RGPD</h3>
			<p>Conformément au règlement (UE) 2016/679 du 27 avril 2016 (RGPD) et à la loi Informatique et Libertés n° 78-17 du 6 janvier 1978 modifiée, vous disposez de droits sur vos données personnelles.</p>
			<p>
				<strong>Responsable du traitement :</strong> {constants.COMPANY.name}, {constants.COMPANY.street}, {constants.COMPANY.postalCode} {constants.COMPANY.city}. Contact : <a href={`mailto:${constants.COMPANY.email}`}>{constants.COMPANY.email}</a>
			</p>
			{/* TODO : adapter la liste des champs à ceux du formulaire réel */}
			<p>
				<strong>Données collectées et finalités :</strong> via le formulaire de contact, nous collectons votre nom, votre adresse e-mail, votre numéro de téléphone (si vous le renseignez) et le contenu de votre message. Ces données sont utilisées exclusivement pour :
			</p>
			<ul>
				<li>répondre à vos demandes d'informations ou de devis ;</li>
				<li>assurer le suivi de la relation commerciale.</li>
			</ul>
			<p>Elles ne sont jamais cédées, vendues ou louées à des tiers.</p>
			<p>
				<strong>Base légale :</strong> le traitement repose sur l'exécution de mesures précontractuelles prises à votre demande et sur l'intérêt légitime de {constants.COMPANY.name} à assurer le suivi de la relation commerciale (articles 6.1.b et 6.1.f du RGPD).
			</p>
			<p>
				<strong>Durée de conservation :</strong> vos données sont conservées pendant une durée maximale de 3 ans à compter du dernier contact, sauf obligation légale de conservation prolongée.
			</p>
			{/* TODO : lister les vrais prestataires (messagerie, service d'envoi du formulaire, etc.) */}
			<p>
				<strong>Destinataires :</strong> les données sont accessibles uniquement à {constants.COMPANY.name} et à ses sous-traitants techniques strictement nécessaires : Clever Cloud (hébergement), [service d'envoi du formulaire, à compléter] et [messagerie professionnelle, à compléter].
			</p>
			<p>
				<strong>Transferts hors Union européenne :</strong> [à compléter : « Aucun transfert de données hors de l'Union européenne n'est effectué. » ou, si un prestataire est situé hors UE, préciser les garanties : Data Privacy Framework, clauses contractuelles types].
			</p>
			<p>
				<strong>Sécurité :</strong> des mesures techniques (protocole HTTPS, hébergement sécurisé) sont en place pour protéger vos échanges.
			</p>
			<p>
				<strong>Vos droits :</strong> vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité de vos données. Vous pouvez également définir des directives relatives au sort de vos données après votre décès. Pour exercer ces droits, écrivez à :{" "}
				<a href={`mailto:${constants.COMPANY.email}`}>{constants.COMPANY.email}</a>
			</p>
			<p>
				En cas de réclamation, vous pouvez saisir la Commission nationale de l'informatique et des libertés (CNIL) :{" "}
				<a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">
					cnil.fr
				</a>
				{" – "}3 Place de Fontenoy, TSA 80715, 75334 Paris Cedex 07.
			</p>

			<h3>8. Cookies et traceurs</h3>
			{/* TODO : à adapter selon les traceurs réellement utilisés (analytics, chat, réseaux sociaux, cartes) */}
			<p>Ce site utilise uniquement des traceurs techniques strictement nécessaires à son fonctionnement, qui ne requièrent pas votre accord. [À compléter : « Aucun outil de mesure d'audience ni de profilage publicitaire n'est utilisé. » ou, sinon, détailler les traceurs et le mécanisme de consentement.]</p>
			<p>Vous pouvez à tout moment configurer votre navigateur pour refuser les cookies. Cette action peut toutefois limiter certaines fonctionnalités du site.</p>

			<h3>9. Crédits médias</h3>
			{/* TODO : indiquer l'origine des photos (photos de l'entreprise ou banques d'images) */}
			<p>Les photographies présentes sur ce site sont [la propriété de {constants.COMPANY.name} / issues de banques d'images libres de droits, à compléter]. Les polices et icônes utilisées sont placées sous licences libres.</p>

			<h3>10. Marques citées</h3>
			<p>Les noms, marques et logos de tiers éventuellement mentionnés sur ce site (fabricants, partenaires, fournisseurs) demeurent la propriété exclusive de leurs détenteurs respectifs. Leur mention n'implique aucun lien de partenariat, d'affiliation ou d'approbation, sauf mention contraire explicite.</p>

			<h3>11. Mise à jour</h3>
			<p>{constants.COMPANY.name} se réserve le droit de modifier les présentes mentions légales à tout moment. Dernière mise à jour : [date, à compléter].</p>
		</>
	);
}

function Cgu(): ReactElement {
	return (
		<>
			<h2 id="legal-title">Conditions générales d'utilisation</h2>
			{/* TODO : faire valider ce texte par un professionnel du droit */}
			<p>
				<em>Dernière mise à jour : [date, à compléter]</em>
			</p>

			<h3>Article 1 – Objet et éditeur</h3>
			<p>
				Les présentes Conditions Générales d'Utilisation («&nbsp;CGU&nbsp;») définissent les modalités d'accès et d'utilisation du site {constants.COMPANY.name} (ci-après le «&nbsp;site&nbsp;»). Est désignée comme «&nbsp;utilisateur&nbsp;» toute personne qui accède au site ou l'utilise. L'accès et l'utilisation du site
				impliquent l'acceptation sans réserve des présentes CGU.
			</p>
			<p>Le site est édité par {constants.COMPANY.name} (ci-après l'«&nbsp;éditeur&nbsp;»), dont les coordonnées figurent dans les mentions légales du site.</p>
			<p>Les présentes CGU régissent uniquement l'accès et l'utilisation du site. Les prestations de {constants.COMPANY.name} sont régies par le devis signé et, le cas échéant, par les conditions générales de vente, qui prévalent sur les CGU pour tout ce qui concerne ces prestations.</p>

			<h3>Article 2 – Accès au site</h3>
			<p>
				Le site est accessible gratuitement à tout utilisateur disposant d'un accès à internet. Tous les frais nécessaires à cet accès (matériel, connexion) sont à la charge exclusive de l'utilisateur. {constants.COMPANY.name} met tout en œuvre pour assurer un accès continu, sans pouvoir être tenu responsable des
				interruptions liées à la maintenance, à des pannes techniques ou à un cas de force majeure.
			</p>

			<h3>Article 3 – Utilisation du site</h3>
			<p>
				L'utilisateur s'engage à utiliser le site dans le respect des présentes CGU et de la législation en vigueur. Il s'interdit notamment de porter atteinte au bon fonctionnement du site, de l'utiliser à des fins frauduleuses, d'usurper l'identité d'un tiers, de tenter d'y accéder sans autorisation, d'en extraire
				des données de manière automatisée (scraping) et d'y transmettre des contenus malveillants, illicites, injurieux ou publicitaires non sollicités.
			</p>

			<h3>Article 4 – Formulaire de contact</h3>
			<p>
				Le site propose un formulaire de contact. Les champs obligatoires doivent être renseignés de manière exacte et sincère. Les données collectées sont traitées conformément au RGPD et à la loi Informatique et Libertés. Le détail du traitement des données et des cookies figure dans les mentions légales du site.
			</p>

			<h3>Article 5 – Informations, devis et prestations</h3>
			<p>Les informations, descriptions et photographies figurant sur le site sont données à titre indicatif et ne constituent pas une offre contractuelle. Les devis sont établis après examen de votre bateau ou de votre structure, et seul un devis accepté par vos soins engage {constants.COMPANY.name}.</p>

			<h3>Article 6 – Propriété intellectuelle</h3>
			<p>
				L'ensemble des éléments composant le site (textes, images, logos, graphisme, code source) est protégé par le droit de la propriété intellectuelle. Toute reproduction, représentation ou réutilisation, même partielle, est interdite sans autorisation écrite préalable. Les conditions d'utilisation des contenus
				ainsi que les crédits médias figurent dans les mentions légales du site.
			</p>

			<h3>Article 7 – Liens hypertextes</h3>
			<p>
				Le site peut contenir des liens vers des sites tiers. {constants.COMPANY.name} n'exerce aucun contrôle sur leur contenu et décline toute responsabilité à cet égard. Toute création de lien vers le site est soumise à l'accord préalable de {constants.COMPANY.name}, sauf lien simple ne portant pas atteinte à son
				image.
			</p>

			<h3>Article 8 – Responsabilité</h3>
			<p>
				{constants.COMPANY.name} veille à l'exactitude des informations publiées, sans pouvoir garantir l'absence d'erreur ou d'omission. {constants.COMPANY.name} ne saurait être tenu responsable des dommages résultant de l'accès au site ou de son utilisation, y compris l'inaccessibilité ou les pertes de données. Les
				autres limitations de responsabilité sont précisées dans les mentions légales.
			</p>

			<h3>Article 9 – Modification des CGU</h3>
			<p>
				{constants.COMPANY.name} se réserve le droit de modifier à tout moment les présentes CGU. Toute modification est signalée sur le site et la date de mise à jour en tête de page est modifiée. La poursuite de l'utilisation du site après modification vaut acceptation des CGU modifiées. Les CGU applicables sont
				celles en vigueur à la date de consultation du site.
			</p>

			<h3>Article 10 – Médiation de la consommation</h3>
			{/* TODO : obligatoire si vous vendez à des consommateurs, indiquer le médiateur choisi */}
			<p>Conformément au Code de la consommation, tout consommateur peut recourir gratuitement à un médiateur en vue de la résolution amiable d'un litige : [nom, site web et adresse du médiateur, à compléter].</p>

			<h3>Article 11 – Droit applicable et litiges</h3>
			<p>
				Les présentes CGU sont soumises au droit français. En cas de différend, l'utilisateur est invité à contacter {constants.COMPANY.name} à <a href={`mailto:${constants.COMPANY.email}`}>{constants.COMPANY.email}</a> afin de rechercher une solution amiable. À défaut, les règles de compétence des juridictions sont
				précisées dans les mentions légales.
			</p>
		</>
	);
}
function LegalModal({ kind, onClose }: LegalModalProps): ReactElement {
	const dialogRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) {
			return;
		}
		if (kind && !dialog.open) {
			dialog.showModal();
		}
		if (!kind && dialog.open) {
			dialog.close();
		}
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
