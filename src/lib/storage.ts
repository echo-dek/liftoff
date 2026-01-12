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
	}
};
