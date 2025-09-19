<script lang="ts">
	import { getFieldContext } from '../form.js';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	const fieldContext = getFieldContext();
</script>

<legend id={fieldContext.labelId} class="formote-legend">
	{@render children()}
</legend>

<style>
	.formote-legend {
		font-weight: 600;
		margin-bottom: 0.5rem;
		padding: 0 0.25rem;
	}
</style>