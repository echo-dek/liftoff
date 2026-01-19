import type { Exercise } from '$lib/types';
import defaultPlan from '$lib/assets/default_training_plan.json';

const WORKOUT_PLAN_KEY = 'workoutPlan';

/**
 * Loads the training plan from localStorage, or initializes with the default plan if none exists
 */
export function loadTrainingPlan(): Exercise[] {
	if (typeof window === 'undefined') {
		// Server-side: return default plan
		return defaultPlan as Exercise[];
	}

	const stored = localStorage.getItem(WORKOUT_PLAN_KEY);

	if (stored) {
		try {
			return JSON.parse(stored) as Exercise[];
		} catch (e) {
			console.error('Failed to parse stored workout plan, using default', e);
			return initializeDefaultPlan();
		}
	}

	return initializeDefaultPlan();
}

/**
 * Initializes localStorage with the default training plan
 */
function initializeDefaultPlan(): Exercise[] {
	const plan = defaultPlan as Exercise[];
	saveTrainingPlan(plan);
	return plan;
}

/**
 * Saves the training plan to localStorage
 */
export function saveTrainingPlan(plan: Exercise[]): void {
	if (typeof window === 'undefined') {
		return;
	}
	localStorage.setItem(WORKOUT_PLAN_KEY, JSON.stringify(plan));
}

/**
 * Gets exercises for a specific phase and day
 */
export function getExercisesForDay(plan: Exercise[], phase: number, day: number): Exercise[] {
	return plan.filter((ex) => ex.phase === phase && ex.day === day);
}
