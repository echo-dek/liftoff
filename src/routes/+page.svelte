<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolveRoute } from '$app/paths';
	import { storage } from '$lib/storage';
	import { onMount } from 'svelte';

	let currentPhase = $state(1);
	let currentDay = $state(1);
	let buttonText = $state('Start');
	let workoutType: 'start' | 'continue' | 'next-phase' = $state('start');
	let currentDate = $state(new Date().toLocaleDateString());

	onMount(() => {
		const nextWorkout = storage.getNextWorkout();
		if (nextWorkout) {
			currentPhase = nextWorkout.phase;
			currentDay = nextWorkout.day;
			workoutType = nextWorkout.type;

			// Set button text based on workout type
			if (nextWorkout.type === 'next-phase') {
				buttonText = `Start Phase ${currentPhase}`;
			} else if (nextWorkout.type === 'continue') {
				buttonText = `Continue with Phase ${currentPhase}`;
			} else {
				buttonText = 'Start';
			}
		}
	});

	function handleStart() {
		// If user completed a full phase and there's a choice to make, go to choice page
		if (workoutType === 'next-phase' || workoutType === 'continue') {
			// Pass the completed phase, not the next phase
			const completedPhase = workoutType === 'next-phase' ? currentPhase - 1 : currentPhase;
			goto(resolveRoute('/phase-choice') + `?phase=${completedPhase}`);
		} else {
			// Otherwise go directly to the workout
			goto(
				resolveRoute('/workout/[phase]/[day]', {
					phase: String(currentPhase),
					day: String(currentDay)
				})
			);
		}
	}
</script>

<div
	class="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4"
>
	<div class="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-2xl">
		<h1 class="mb-4 text-4xl font-bold text-gray-800">Liftoff</h1>
		<p class="mb-2 text-lg text-gray-600">Track your strength training progress</p>

		<p class="mb-8 text-sm text-gray-500">{currentDate}</p>

		<button
			onclick={handleStart}
			class="rounded-lg bg-blue-600 px-8 py-4 text-xl font-bold text-white shadow-lg transition-colors duration-200 hover:bg-blue-700 hover:shadow-xl"
		>
			{buttonText}
		</button>
	</div>
</div>
