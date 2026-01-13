<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { storage } from '$lib/storage';
	import { onMount } from 'svelte';

	let currentPhase = $derived(parseInt($page.url.searchParams.get('phase') || '1'));
	let currentDate = $state(new Date().toLocaleDateString());
	let hasNextPhase = $state(false);
	let nextPhase = $state(2);

	onMount(() => {
		const plan = storage.getWorkoutPlan();
		const phases = new Set(plan.map(ex => ex.phase));
		const maxPhase = Math.max(...Array.from(phases));
		hasNextPhase = currentPhase < maxPhase;
		nextPhase = currentPhase + 1;
	});

	function continueCurrentPhase() {
		goto(`/workout/${currentPhase}/1`);
	}

	function startNextPhase() {
		goto(`/workout/${nextPhase}/1`);
	}
</script>

<div class="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-500 to-purple-600">
	<div class="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
		<h1 class="text-3xl font-bold text-gray-800 mb-4">Choose Your Path</h1>
		<p class="text-sm text-gray-500 mb-8">{currentDate}</p>

		<div class="space-y-4">
			<button
				onclick={continueCurrentPhase}
				class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
			>
				Continue with Phase {currentPhase}
			</button>

			{#if hasNextPhase}
				<button
					onclick={startNextPhase}
					class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
				>
					Start Phase {nextPhase}
				</button>
			{/if}
		</div>
	</div>
</div>
