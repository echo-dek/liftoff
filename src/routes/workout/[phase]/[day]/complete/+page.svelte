<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { storage } from '$lib/storage';
	import { onMount } from 'svelte';

	let phase = $derived(parseInt($page.params.phase));
	let day = $derived(parseInt($page.params.day));

	// Save workout session to history when page loads
	onMount(() => {
		const session = {
			phase,
			day,
			date: new Date(),
			exercises: [],
			startedAt: new Date(),
			completedAt: new Date()
		};
		storage.addWorkoutSession(session);
	});

	function returnHome() {
		goto('/');
	}
</script>

<div class="min-h-screen bg-gradient-to-br from-green-500 to-blue-600 p-4 flex items-center justify-center">
	<div class="max-w-2xl w-full bg-white rounded-lg shadow-2xl p-8">
		<div class="text-center space-y-6">
			<!-- Celebration -->
			<div class="text-8xl animate-bounce">🎉</div>

			<!-- Main heading -->
			<h1 class="text-4xl font-bold text-gray-800">Great Work!</h1>

			<!-- Completion message -->
			<p class="text-xl text-gray-700">
				You've completed all exercises for Phase {phase}, Day {day}
			</p>

			<!-- Summary section -->
			<div class="workout-summary bg-gray-50 rounded-lg p-6 mt-8" data-testid="workout-summary">
				<h2 class="text-2xl font-semibold text-gray-800 mb-4">Workout Summary</h2>
				<div class="text-gray-700 space-y-2">
					<p class="text-lg">Phase: {phase}</p>
					<p class="text-lg">Day: {day}</p>
					<p class="text-lg">Status: Complete ✓</p>
				</div>
			</div>

			<!-- Return home button -->
			<button
				onclick={returnHome}
				class="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
			>
				Return Home
			</button>
		</div>
	</div>
</div>

<style>
	@keyframes bounce {
		0%, 100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-20px);
		}
	}

	.animate-bounce {
		animation: bounce 1s ease-in-out infinite;
	}
</style>
