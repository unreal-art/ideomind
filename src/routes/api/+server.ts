import { json } from "@sveltejs/kit";
import axios from "axios";

export const POST = async ({ request }) => {
	const data = await request.json();
	
	const response = await axios.post("https://darts.decenterai.com:8080/darts", data, {
		headers: {
			"Content-Type": "application/json" // Explicitly set Content-Type
		}
	});


	return json({ message: "Received data", data: response.data });
};
