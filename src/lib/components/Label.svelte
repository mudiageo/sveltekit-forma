<script lang="ts">
	import { getFieldContext } from '../form.js';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	const fieldContext = getFieldContext();
</script>

<label for={fieldContext.fieldId} id={fieldContext.labelId} class="formote-label">
	{@render children()}
</label>

<style>
	.formote-label {
		display: block;
		font-weight: 500;
		margin-bottom: 0.25rem;
		cursor: pointer;
	}
</style>