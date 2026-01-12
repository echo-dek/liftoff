<script lang="ts">
	import { goto } from '$app/navigation';
	import { storage } from '$lib/storage';
	import { onMount } from 'svelte';

	let currentPhase = $state(1);
	let currentDay = $state(1);

	function handleStart() {
		goto(`/workout/${currentPhase}/${currentDay}`);
	}
</script>

<div class="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-500 to-purple-600">
	<div class="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
		<h1 class="text-4xl font-bold text-gray-800 mb-4">Liftoff</h1>
		<p class="text-lg text-gray-600 mb-8">Track your strength training progress</p>

		<button
			onclick={handleStart}
			class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
		>
			Start
		</button>
	</div>
</div>
