import axios from 'axios';
import type { JobSpec } from './types';

export async function generateImage(dto: JobSpec) {
	try {
		const res = await axios.post('/darts', dto);
		console.log(res);
		return res.data;
	} catch (error) {
		console.error('Error:', error);
	}
}
