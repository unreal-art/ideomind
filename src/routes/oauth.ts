export function getRedirectURL(): string {
	// const redirectToUrl = import.meta.env.DEV
	// 	? import.meta.env.VITE_DEV_BASE_URL
	// 	: import.meta.env.VITE_PROD_BASE_URL;
	const redirectToUrl = window.location.origin;

	console.log("redirect to: " + redirectToUrl);

	return redirectToUrl;
}
