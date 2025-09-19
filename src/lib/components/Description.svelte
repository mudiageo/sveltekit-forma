<script lang="ts">
	import { getFieldContext } from '../form.js';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	const fieldContext = getFieldContext();
</script>

<div id={fieldContext.descriptionId} class="formote-description">
	{@render children()}
</div>

<style>
	.formote-description {
		color: #6b7280;
		font-size: 0.875rem;
		line-height: 1.25rem;
		margin-top: 0.25rem;
	}
</style>