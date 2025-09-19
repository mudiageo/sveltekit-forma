<script lang="ts">
	import { setFieldContext, generateId, type FormoteForm, type FormoteFieldContext } from '../form.js';
	import type { Snippet } from 'svelte';

	interface Props {
		form: FormoteForm;
		name: string;
		children: Snippet;
	}

	let { form, name, children }: Props = $props();

	const fieldsetId = generateId('fieldset');
	const legendId = generateId('legend');
	const descriptionId = generateId('fieldset-description');
	const errorId = generateId('fieldset-error');

	const fieldContext: FormoteFieldContext = $derived({
		name,
		form,
		fieldId: fieldsetId,
		labelId: legendId,
		descriptionId,
		errorId,
		hasErrors: ((form.remoteForm.issues?.[name]?.length ?? 0) > 0),
		errors: form.remoteForm.issues?.[name] || [],
		value: form.remoteForm.input?.[name]
	});

	// Set context when the component is mounted or when fieldContext changes
	$effect(() => {
		setFieldContext(fieldContext);
	});
</script>

<fieldset 
	id={fieldsetId} 
	class="formote-fieldset" 
	data-field={name}
	aria-describedby={fieldContext.hasErrors ? errorId : descriptionId}
>
	{@render children()}
</fieldset>

<style>
	.formote-fieldset {
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
		padding: 1rem;
		margin-bottom: 1rem;
	}
</style>