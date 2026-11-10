/// <reference types="vite/client" />
interface ImportMetaEnv {
	readonly VITE_APP_NAME: string;
	readonly VITE_APP_URL: string;
	readonly VITE_API_URL: string;
	readonly VITE_EMAILJS_SERVICE_ID: string;
	readonly VITE_EMAILJS_TEMPLATE_ID: string;
	readonly VITE_EMAILJS_PUBLIC_KEY: string;
}

declare module "*.png" {
	const value: string;
	export default value;
}
declare module "*.jpg" {
	const value: string;
	export default value;
}
declare module "*.svg" {
	const value: string;
	export default value;
}
