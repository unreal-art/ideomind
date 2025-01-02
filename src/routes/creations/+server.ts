import axios from "axios";
import { json } from "@sveltejs/kit";
import { PUBLIC_API_URL } from "$env/static/public";

import https from "https";

const agent = new https.Agent({
	rejectUnauthorized: false, // Disable SSL verification
	ca: `-----BEGIN CERTIFICATE-----
MIIDtTCCAp2gAwIBAgIUOtTgT7SuASjWkIn/ujXWltfZL0UwDQYJKoZIhvcNAQEL
BQAwajELMAkGA1UEBhMCQVUxEzARBgNVBAgMClNvbWUtU3RhdGUxEzARBgNVBAoM
CkRlY2VudGVyQUkxDTALBgNVBAMMBEhpcm8xIjAgBgkqhkiG9w0BCQEWE2hpcm9A
ZGVjZW50ZXJhaS5jb20wHhcNMjQxMjIzMDI1NzQ4WhcNMjUxMjIzMDI1NzQ4WjBq
MQswCQYDVQQGEwJBVTETMBEGA1UECAwKU29tZS1TdGF0ZTETMBEGA1UECgwKRGVj
ZW50ZXJBSTENMAsGA1UEAwwESGlybzEiMCAGCSqGSIb3DQEJARYTaGlyb0BkZWNl
bnRlcmFpLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAJg/WFBA
H9RaiD3toJjTgY+kXuJecxgxq63oUx0wD9mk57QRP/CPcs0eLiezVmvDBr4fVGit
cFwQribNKPEt9O9k3EN8e6ywvNO/3sUybGDYjpD08s68UiMI7Jeybk63nFGUY2oF
ZgkS2nffZATtUhVhvwxl1b6H6jtg7Ts5bZ1c6JJ6kdwefEYpUxdElkXWyH7hV1Dc
2tCOHI3RLm788wX/1AZYJOH9+neh7Jwa26tF04pkjGO8G98MCgcne8I9j5IjQjki
QsNd2lRLDW2+///Y6Y/HTeGymb0xg8ZLaWRRB4+nVSS+aRitTmPkvnRL9WlUh6xF
N+b3lcQt1T8p+BsCAwEAAaNTMFEwHQYDVR0OBBYEFD22hDmAffWveLhzkfLm0P5o
tn8tMB8GA1UdIwQYMBaAFD22hDmAffWveLhzkfLm0P5otn8tMA8GA1UdEwEB/wQF
MAMBAf8wDQYJKoZIhvcNAQELBQADggEBACmztJPRHrzLwhOdgUFid4eUz3TEiV4y
W3+oV9FJX/xPjHIdtehxWL3Fx64sc4MAMutA3lP04mK6BsWKmI04SVHoJ4FCv2Ww
sxjLWnvGxGMzCPdb1utcVjmDyL+3o4h0UEgYDhWMGMl0iILmKGBQ7qnfMy3nsgDy
Y7n1LfRMuwwZcNzTrq4OjpKBjAKPZMy1NZR9cuMEw+fVQOiM4afdsJSt/DOl+aY2
XmIP1S6gHygY805JVAjoGlEv4SYgsJt97/61xZgWZQh8N3PSFn1zR3lbZ3JpDLN2
lQ7Ghuq6/cFOhwmhdh2zUf8x/N8lzzeZqPdy3DYVGPmPyKOAPRsq69s=
-----END CERTIFICATE-----`.trim()
});

const axios1 = axios.create({ httpsAgent: agent });

export const POST = async ({ request }) => {
	const data = await request.json();

	// const origin = request.headers.get("origin");

	// Alternatively, if you want the full URL, you can use the 'referer' or build the origin from the 'host' and 'protocol'
	const referer = request.headers.get("referer"); // Another way to get the origin
	const host = request.headers.get("host"); // Get the host
	const protocol = "http"; // Determine the protocol
	// Combine protocol and host to build the origin if not directly available
	const fullOrigin = protocol + "://" + host;
	// console.log("Request Origin:", origin);
	console.log("Full Origin:", fullOrigin);

	const backendUrl = PUBLIC_API_URL || fullOrigin;

	console.log("request headers", request.headers);

	try {
		const response = await axios1.post(`${backendUrl}/darts`, data, {
			headers: { Authorization: request.headers.get("Authorization") }
		});

		// Return the success response
		return json(response.data, { status: response.status });
	} catch (error) {
		// Handle the error and return an error message
		console.error("Error during API request:", error);

		return json(error, { status: 500 });
	}
};
