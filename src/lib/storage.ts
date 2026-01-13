import type { Exercise, WorkoutSession } from './types';

const WORKOUT_PLAN_KEY = 'workoutPlan';
const WORKOUT_HISTORY_KEY = 'workoutHistory';

export const storage = {
	getWorkoutPlan(): Exercise[] {
		if (typeof window === 'undefined') return [];
		const data = localStorage.getItem(WORKOUT_PLAN_KEY);
		return data ? JSON.parse(data) : [];
	},

	setWorkoutPlan(plan: Exercise[]): void {
		if (typeof window === 'undefined') return;
		localStorage.setItem(WORKOUT_PLAN_KEY, JSON.stringify(plan));
	},

	getWorkoutHistory(): WorkoutSession[] {
		if (typeof window === 'undefined') return [];
		const data = localStorage.getItem(WORKOUT_HISTORY_KEY);
		return data ? JSON.parse(data) : [];
	},

	addWorkoutSession(session: WorkoutSession): void {
		if (typeof window === 'undefined') return;
		const history = this.getWorkoutHistory();
		history.push(session);
		localStorage.setItem(WORKOUT_HISTORY_KEY, JSON.stringify(history));
	},

	clearWorkoutHistory(): void {
		if (typeof window === 'undefined') return;
		localStorage.removeItem(WORKOUT_HISTORY_KEY);
	},

	getExercisesForDay(phase: number, day: number): Exercise[] {
		const plan = this.getWorkoutPlan();
		return plan.filter((exercise) => exercise.phase === phase && exercise.day === day);
	},

	getNextWorkout(): { phase: number; day: number; type: 'start' | 'continue' | 'next-phase' } | null {
		const plan = this.getWorkoutPlan();
		const history = this.getWorkoutHistory();

		if (plan.length === 0) return null;

		// If no history, start with phase 1, day 1
		if (history.length === 0) {
			return { phase: 1, day: 1, type: 'start' };
		}

		// Get the latest completed workout
		const latestSession = history[history.length - 1];
		const { phase: lastPhase, day: lastDay } = latestSession;

		// Get all unique phases and days from the plan
		const planPhases = new Set(plan.map(ex => ex.phase));
		const maxPhase = Math.max(...Array.from(planPhases));

		// Get days for the last completed phase
		const daysInLastPhase = new Set(plan.filter(ex => ex.phase === lastPhase).map(ex => ex.day));
		const maxDayInLastPhase = Math.max(...Array.from(daysInLastPhase));

		// Check if we completed all days in the current phase
		const completedDaysInPhase = new Set(
			history.filter(s => s.phase === lastPhase).map(s => s.day)
		);

		if (completedDaysInPhase.size === daysInLastPhase.size) {
			// Completed all days in current phase
			if (lastPhase < maxPhase) {
				// Move to next phase
				return { phase: lastPhase + 1, day: 1, type: 'next-phase' };
			} else {
				// Completed all phases, repeat current phase
				return { phase: lastPhase, day: 1, type: 'continue' };
			}
		} else {
			// Continue with next day in current phase - use 'start' type so button says "Start"
			const nextDay = lastDay + 1;
			return { phase: lastPhase, day: nextDay, type: 'start' };
		}
	}
};
