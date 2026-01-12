import { storage } from '$lib/storage';
import type { PageLoad } from './$types';
import { browser } from '$app/environment';

// This page needs to run client-side only because it uses localStorage
export const ssr = false;

export const load: PageLoad = ({ params }) => {
	const phase = parseInt(params.phase);
	const day = parseInt(params.day);

	// Only load from storage in the browser
	const exercises = browser ? storage.getExercisesForDay(phase, day) : [];

	return {
		phase,
		day,
		exercises
	};
};
