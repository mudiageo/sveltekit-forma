<script lang="ts">
	import { getFieldContext } from '../form.js';

	const fieldContext = getFieldContext();
</script>

{#if fieldContext.hasErrors}
	<div id={fieldContext.errorId} class="forma-field-errors" role="alert" aria-live="polite">
		{#each fieldContext.errors as error}
			<div class="forma-error">{error}</div>
		{/each}
	</div>
{/if}

<style>
	.forma-field-errors {
		margin-top: 0.25rem;
	}
	
	.forma-error {
		color: #ef4444;
		font-size: 0.875rem;
		line-height: 1.25rem;
	}
</style>