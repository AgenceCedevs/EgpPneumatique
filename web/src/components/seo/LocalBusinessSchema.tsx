import { constants } from "@shared";
import { Helmet } from "react-helmet-async";

function LocalBusinessSchema() {
	const schema = {
		"@context": "https://schema.org",
		"@type": "LocalBusiness",
		name: constants.COMPANY.name,
		url: import.meta.env.VITE_APP_URL,
		telephone: constants.COMPANY.phoneSchema,
		email: constants.COMPANY.email,
		address: {
			"@type": "PostalAddress",
			streetAddress: constants.COMPANY.street,
			postalCode: constants.COMPANY.postalCode,
			addressLocality: constants.COMPANY.city,
			addressCountry: "FR",
		},
	};

	return (
		<Helmet>
			<script type="application/ld+json">{JSON.stringify(schema)}</script>
		</Helmet>
	);
}

export default LocalBusinessSchema;
