import { Helmet } from "react-helmet-async";

interface SeoProps {
	title?: string;
	description: string;
	path?: string;
	image?: string;
	ogTitle?: string;
	ogDescription?: string;
	noIndex?: boolean;
}

function Seo({ title, description, path, image = "/og-image.webp", ogTitle, ogDescription, noIndex = false }: SeoProps) {
	const siteUrl = new URL(import.meta.env.VITE_APP_URL);
	const fullTitle = title ? `${title} | ${import.meta.env.VITE_APP_NAME}` : import.meta.env.VITE_APP_NAME;
	const socialTitle = ogTitle ?? fullTitle;
	const socialDescription = ogDescription ?? description;
	const canonicalUrl = path ? new URL(path, siteUrl).toString() : undefined;
	const imageUrl = new URL(image, siteUrl).toString();

	return (
		<Helmet>
			<title>{fullTitle}</title>
			<meta name="description" content={description} />
			<meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
			{canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
			<meta property="og:type" content="website" />
			{canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
			<meta property="og:title" content={socialTitle} />
			<meta property="og:description" content={socialDescription} />
			<meta property="og:image" content={imageUrl} />
		</Helmet>
	);
}

export default Seo;
