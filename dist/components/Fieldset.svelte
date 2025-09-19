<script lang="ts">
	import { setFieldContext, generateId, type FormaForm, type FormaFieldContext } from '../form.js';
	import type { Snippet } from 'svelte';

	interface Props {
		form: FormaForm;
		name: string;
		children: Snippet;
	}

	let { form, name, children }: Props = $props();

	const fieldsetId = generateId('fieldset');
	const legendId = generateId('legend');
	const descriptionId = generateId('fieldset-description');
	const errorId = generateId('fieldset-error');

	const fieldContext: FormaFieldContext = $derived({
		name,
		form,
		fieldId: fieldsetId,
		labelId: legendId,
		descriptionId,
		errorId,
		hasErrors: form.errors[name]?.length > 0,
		errors: form.errors[name] || [],
		value: form.values[name]
	});

	// Set context immediately
	setFieldContext(fieldContext);
</script>

<fieldset 
	id={fieldsetId} 
	class="forma-fieldset" 
	data-field={name}
	aria-describedby={fieldContext.hasErrors ? errorId : descriptionId}
>
	{@render children()}
</fieldset>

<style>
	.forma-fieldset {
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
		padding: 1rem;
		margin-bottom: 1rem;
	}
</style>