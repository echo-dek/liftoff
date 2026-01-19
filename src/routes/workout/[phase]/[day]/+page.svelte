<script lang="ts">
	import { goto } from '$app/navigation';
	import { storage } from '$lib/storage';
	import type { Exercise } from '$lib/types';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let currentDate = $state(new Date().toLocaleDateString());
	let availableDays = $state(storage.getAllAvailableDays());

	function selectExercise(exercise: Exercise) {
		goto(`/workout/${data.phase}/${data.day}/${encodeURIComponent(exercise.exercise)}`);
	}

	function navigateToDay(phase: number, day: number) {
		storage.setCurrentDayOverride(phase, day);
		goto(`/workout/${phase}/${day}`);
	}
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4">
	<div class="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-2xl">
		<div class="mb-6">
			<h1 class="text-3xl font-bold text-gray-800">Phase {data.phase}, Day {data.day}</h1>
			<p class="mt-2 text-gray-600">{currentDate}</p>
		</div>

		<!-- Navigation Section -->
		<div class="mb-6">
			<div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
				<h3 class="mb-3 text-sm font-semibold text-gray-600">Navigate to a different day:</h3>
				<div class="grid grid-cols-3 gap-2">
					{#each availableDays as dayOption}
						<button
							onclick={() => navigateToDay(dayOption.phase, dayOption.day)}
							class="rounded-lg px-3 py-2 text-sm transition-all duration-200 {dayOption.phase ===
								data.phase && dayOption.day === data.day
								? 'bg-blue-500 font-semibold text-white'
								: 'border border-gray-300 bg-white text-gray-700 hover:bg-blue-50'}"
						>
							Navigate to Day {dayOption.day}
						</button>
					{/each}
				</div>
			</div>
		</div>

		<div class="space-y-4">
			<h2 class="mb-4 text-xl font-semibold text-gray-700">Exercises</h2>
			{#each data.exercises as exercise}
				<button
					onclick={() => selectExercise(exercise)}
					class="w-full rounded-lg border-2 border-gray-200 bg-white p-4 text-left transition-all duration-200 hover:border-blue-500 hover:shadow-lg"
				>
					<div class="flex items-center justify-between">
						<div>
							<h3 class="text-lg font-semibold text-gray-800">{exercise.exercise}</h3>
							<p class="text-sm text-gray-600">
								{exercise.sets} sets × {exercise.reps} reps
								{#if exercise.weights}
									• Weighted
								{/if}
							</p>
						</div>
						<svg
							class="h-6 w-6 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</div>
				</button>
			{/each}
		</div>
	</div>
</div>
