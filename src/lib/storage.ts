import type { Exercise, WorkoutSession } from './types';
import defaultPlan from '$lib/assets/default_training_plan.json';

const WORKOUT_PLAN_KEY = 'workoutPlan';
const WORKOUT_HISTORY_KEY = 'workoutHistory';
const CURRENT_DAY_OVERRIDE_KEY = 'currentDayOverride';

export const storage = {
	getWorkoutPlan(): Exercise[] {
		if (typeof window === 'undefined') return [];
		const data = localStorage.getItem(WORKOUT_PLAN_KEY);
		if (data) {
			return JSON.parse(data);
		}
		// Initialize with default plan if none exists
		const plan = defaultPlan as Exercise[];
		this.setWorkoutPlan(plan);
		return plan;
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

	setCurrentDayOverride(phase: number, day: number): void {
		if (typeof window === 'undefined') return;
		localStorage.setItem(CURRENT_DAY_OVERRIDE_KEY, JSON.stringify({ phase, day }));
	},

	getCurrentDayOverride(): { phase: number; day: number } | null {
		if (typeof window === 'undefined') return null;
		const data = localStorage.getItem(CURRENT_DAY_OVERRIDE_KEY);
		return data ? JSON.parse(data) : null;
	},

	clearCurrentDayOverride(): void {
		if (typeof window === 'undefined') return;
		localStorage.removeItem(CURRENT_DAY_OVERRIDE_KEY);
	},

	getNextWorkout(): {
		phase: number;
		day: number;
		type: 'start' | 'continue' | 'next-phase';
	} | null {
		const plan = this.getWorkoutPlan();
		const history = this.getWorkoutHistory();
		const override = this.getCurrentDayOverride();

		if (plan.length === 0) return null;

		// If there's an override, use it and clear it
		if (override) {
			this.clearCurrentDayOverride();
			return { phase: override.phase, day: override.day, type: 'start' };
		}

		// If no history, start with phase 1, day 1
		if (history.length === 0) {
			return { phase: 1, day: 1, type: 'start' };
		}

		// Get the latest completed workout
		const latestSession = history[history.length - 1];
		const { phase: lastPhase, day: lastDay } = latestSession;

		// Get all unique phases and days from the plan
		const planPhases = new Set(plan.map((ex) => ex.phase));
		const maxPhase = Math.max(...Array.from(planPhases));

		// Get days for the last completed phase
		const daysInLastPhase = new Set(
			plan.filter((ex) => ex.phase === lastPhase).map((ex) => ex.day)
		);
		const maxDayInLastPhase = Math.max(...Array.from(daysInLastPhase));

		// Check if we completed all days in the current phase
		const completedDaysInPhase = new Set(
			history.filter((s) => s.phase === lastPhase).map((s) => s.day)
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
	},

	getAllAvailableDays(): { phase: number; day: number; label: string }[] {
		const plan = this.getWorkoutPlan();
		const uniqueDays = new Map<string, { phase: number; day: number }>();

		plan.forEach((exercise) => {
			const key = `${exercise.phase}-${exercise.day}`;
			if (!uniqueDays.has(key)) {
				uniqueDays.set(key, { phase: exercise.phase, day: exercise.day });
			}
		});

		return Array.from(uniqueDays.values())
			.sort((a, b) => {
				if (a.phase !== b.phase) return a.phase - b.phase;
				return a.day - b.day;
			})
			.map((d) => ({ ...d, label: `Phase ${d.phase}, Day ${d.day}` }));
	}
};
