<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { storage } from '$lib/storage';
	import type { Exercise } from '$lib/types';
	import { onMount } from 'svelte';

	let phase = $derived(parseInt($page.params.phase));
	let day = $derived(parseInt($page.params.day));
	let exerciseName = $derived(decodeURIComponent($page.params.exercise));

	let exercise = $state<Exercise | undefined>(undefined);
	let totalSets = $state(0);
	let completedSets = $state(0);
	let isCompleted = $state(false);
	let showWeightInput = $state(true);
	let weight = $state<number | null>(null);

	onMount(() => {
		const exercises = storage.getExercisesForDay(phase, day);
		exercise = exercises.find((ex) => ex.exercise === exerciseName);

		if (exercise) {
			totalSets = exercise.sets;
		}
	});

	function startExercise() {
		if (weight === null || weight <= 0) {
			return;
		}
		showWeightInput = false;
	}

	function completeSet() {
		completedSets += 1;

		if (completedSets >= totalSets) {
			isCompleted = true;
			// Auto-navigate after 3 seconds
			setTimeout(() => {
				navigateToNextExercise();
			}, 3000);
		}
	}

	function navigateToNextExercise() {
		const exercises = storage.getExercisesForDay(phase, day);
		const currentIndex = exercises.findIndex((ex) => ex.exercise === exerciseName);

		if (currentIndex < exercises.length - 1) {
			const nextExercise = exercises[currentIndex + 1];
			goto(`/workout/${phase}/${day}/${encodeURIComponent(nextExercise.exercise)}`);
		} else {
			// All exercises completed, return to workout day page
			goto(`/workout/${phase}/${day}`);
		}
	}

	let setsRemainingText = $derived(() => {
		if (isCompleted) {
			return `${exerciseName} completed`;
		}

		const remaining = totalSets - completedSets;
		if (remaining === 1) {
			return `${remaining} set remaining`;
		}
		return `${remaining} sets remaining`;
	});
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4">
	<div class="max-w-2xl mx-auto bg-white rounded-lg shadow-2xl p-8">
		<h1 class="text-3xl font-bold text-gray-800 mb-8">{exerciseName}</h1>

		{#if showWeightInput && exercise?.weights}
			<div class="space-y-6">
				<div>
					<label for="weight-input" class="block text-lg font-semibold text-gray-700 mb-2">
						Weight (kg)
					</label>
					<input
						id="weight-input"
						type="number"
						bind:value={weight}
						min="0"
						step="0.5"
						class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
						placeholder="Enter weight"
					/>
				</div>

				<button
					onclick={startExercise}
					disabled={weight === null || weight <= 0}
					class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
				>
					Start {exerciseName}
				</button>
			</div>
		{:else}
			<div class="space-y-8">
				<div class="text-center">
					<p class="text-xl text-gray-700 mb-4">{setsRemainingText()}</p>

					{#if exercise}
						<p class="text-lg text-gray-600">
							{exercise.reps} reps per set
							{#if weight}
								• {weight}kg
							{/if}
						</p>
					{/if}
				</div>

				{#if !isCompleted}
					<button
						onclick={completeSet}
						class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-6 px-8 rounded-lg text-2xl transition-colors duration-200 shadow-lg hover:shadow-xl"
					>
						Set Complete
					</button>
				{:else}
					<div class="text-center py-8 animate-bounce celebration">
						<div class="text-6xl mb-4">🎉</div>
						<p class="text-2xl font-bold text-green-600">{exerciseName} completed!</p>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	.celebration {
		animation: celebration 0.5s ease-in-out;
	}

	@keyframes celebration {
		0% {
			transform: scale(0.8);
			opacity: 0;
		}
		50% {
			transform: scale(1.1);
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}
</style>
