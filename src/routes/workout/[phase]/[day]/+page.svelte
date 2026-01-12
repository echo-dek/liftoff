<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Exercise } from '$lib/types';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let currentDate = $state(new Date().toLocaleDateString());

	function selectExercise(exercise: Exercise) {
		goto(`/workout/${data.phase}/${data.day}/${encodeURIComponent(exercise.exercise)}`);
	}
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4">
	<div class="max-w-2xl mx-auto bg-white rounded-lg shadow-2xl p-6">
		<div class="mb-6">
			<h1 class="text-3xl font-bold text-gray-800">Phase {data.phase}, Day {data.day}</h1>
			<p class="text-gray-600 mt-2">{currentDate}</p>
		</div>

		<div class="space-y-4">
			<h2 class="text-xl font-semibold text-gray-700 mb-4">Exercises</h2>
			{#each data.exercises as exercise}
				<button
					onclick={() => selectExercise(exercise)}
					class="w-full bg-white border-2 border-gray-200 hover:border-blue-500 rounded-lg p-4 text-left transition-all duration-200 hover:shadow-lg"
				>
					<div class="flex justify-between items-center">
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
							class="w-6 h-6 text-gray-400"
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
