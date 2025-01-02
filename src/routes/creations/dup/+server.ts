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

export const POST = async ({ request }) => {
	const data = await request.json();

	const referer = request.headers.get("referer"); // Another way to get the origin
	const host = request.headers.get("host"); // Get the host
	const protocol = "http"; // Assume HTTP for now
	const fullOrigin = `${protocol}://${host}`;

	console.log("Full Origin:", fullOrigin);

	const backendUrl = PUBLIC_API_URL || fullOrigin;

	try {
		// Make the proxy request using `fetch`
		const response = await fetch(`${backendUrl}/darts`, {
			method: "POST",
			headers: request.headers, // Pass the original headers
			body: JSON.stringify(data) // Send the body data
			// agent // Attach the custom HTTPS agent for SSL verification if needed
		});

		const responseData = await response.json(); // Assuming the response is in JSON format

		// Return the success response
		return json({ message: "Received data", data: responseData });
	} catch (error) {
		console.error("Error during API request:", error);

		// Handle errors gracefully
		return json(
			{
				message: "Failed to send data",
				error: error.message || error
			},
			{ status: 500 }
		);
	}
};
