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
		const phases = new Set(plan.map((ex) => ex.phase));
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

<div
	class="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4"
>
	<div class="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-2xl">
		<h1 class="mb-4 text-3xl font-bold text-gray-800">Choose Your Path</h1>
		<p class="mb-8 text-sm text-gray-500">{currentDate}</p>

		<div class="space-y-4">
			<button
				onclick={continueCurrentPhase}
				class="w-full rounded-lg bg-blue-600 px-8 py-4 text-xl font-bold text-white shadow-lg transition-colors duration-200 hover:bg-blue-700 hover:shadow-xl"
			>
				Continue with Phase {currentPhase}
			</button>

			{#if hasNextPhase}
				<button
					onclick={startNextPhase}
					class="w-full rounded-lg bg-green-600 px-8 py-4 text-xl font-bold text-white shadow-lg transition-colors duration-200 hover:bg-green-700 hover:shadow-xl"
				>
					Start Phase {nextPhase}
				</button>
			{/if}
		</div>
	</div>
</div>
