export interface Exercise {
	phase: number;
	day: number;
	exercise: string;
	sets: number;
	reps: number;
	weights: boolean;
}

export interface WorkoutSet {
	completedAt: Date;
	weight?: number;
}

export interface WorkoutExercise {
	exercise: string;
	sets: WorkoutSet[];
	totalSets: number;
	totalReps: number;
	startedAt: Date;
	completedAt?: Date;
}

export interface WorkoutSession {
	phase: number;
	day: number;
	date: Date;
	exercises: WorkoutExercise[];
	startedAt: Date;
	completedAt?: Date;
}
