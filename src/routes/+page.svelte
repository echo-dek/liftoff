<script lang="ts">
	import { goto } from '$app/navigation';
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
			goto(`/phase-choice?phase=${completedPhase}`);
		} else {
			// Otherwise go directly to the workout
			goto(`/workout/${currentPhase}/${currentDay}`);
		}
	}
</script>

<div class="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-500 to-purple-600">
	<div class="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
		<h1 class="text-4xl font-bold text-gray-800 mb-4">Liftoff</h1>
		<p class="text-lg text-gray-600 mb-2">Track your strength training progress</p>

		<p class="text-sm text-gray-500 mb-8">{currentDate}</p>

		<button
			onclick={handleStart}
			class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
		>
			{buttonText}
		</button>
	</div>
</div>
