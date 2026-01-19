<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolveRoute } from '$app/paths';
	import { page } from '$app/stores';
	import { storage } from '$lib/storage';
	import { onMount } from 'svelte';

	let phase = $derived(parseInt($page.params.phase ?? ''));
	let day = $derived(parseInt($page.params.day ?? ''));

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
		goto(resolveRoute('/'));
	}
</script>

<div
	class="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-500 to-blue-600 p-4"
>
	<div class="w-full max-w-2xl rounded-lg bg-white p-8 shadow-2xl">
		<div class="space-y-6 text-center">
			<!-- Celebration -->
			<div class="animate-bounce text-8xl">🎉</div>

			<!-- Main heading -->
			<h1 class="text-4xl font-bold text-gray-800">Great Work!</h1>

			<!-- Completion message -->
			<p class="text-xl text-gray-700">
				You've completed all exercises for Phase {phase}, Day {day}
			</p>

			<!-- Summary section -->
			<div class="workout-summary mt-8 rounded-lg bg-gray-50 p-6" data-testid="workout-summary">
				<h2 class="mb-4 text-2xl font-semibold text-gray-800">Workout Summary</h2>
				<div class="space-y-2 text-gray-700">
					<p class="text-lg">Phase: {phase}</p>
					<p class="text-lg">Day: {day}</p>
					<p class="text-lg">Status: Complete ✓</p>
				</div>
			</div>

			<!-- Return home button -->
			<button
				onclick={returnHome}
				class="mt-8 rounded-lg bg-blue-600 px-8 py-4 text-xl font-bold text-white shadow-lg transition-colors duration-200 hover:bg-blue-700 hover:shadow-xl"
			>
				Return Home
			</button>
		</div>
	</div>
</div>

<style>
	@keyframes bounce {
		0%,
		100% {
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
