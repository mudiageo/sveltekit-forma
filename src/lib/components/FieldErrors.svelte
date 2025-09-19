<script lang="ts">
	import { getFieldContext } from '../form.js';

	const fieldContext = getFieldContext();
</script>

{#if fieldContext.hasErrors}
	<div id={fieldContext.errorId} class="formote-field-errors" role="alert" aria-live="polite">
		{#each fieldContext.errors as issue}
			<div class="formote-error">{issue.message}</div>
		{/each}
	</div>
{/if}

<style>
	.formote-field-errors {
		margin-top: 0.25rem;
	}
	
	.formote-error {
		color: #ef4444;
		font-size: 0.875rem;
		line-height: 1.25rem;
	}
</style>