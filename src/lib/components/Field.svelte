<script lang="ts">
	import { setFieldContext, generateId, type FormaForm, type FormaFieldContext } from '../form.js';
	import type { Snippet } from 'svelte';

	interface Props {
		form: FormaForm;
		name: string;
		children: Snippet;
	}

	let { form, name, children }: Props = $props();

	const fieldId = generateId('field');
	const labelId = generateId('label');
	const descriptionId = generateId('description');
	const errorId = generateId('error');

	const fieldContext: FormaFieldContext = $derived({
		name,
		form,
		fieldId,
		labelId,
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

<div class="forma-field" data-field={name}>
	{@render children()}
</div>

<style>
	.forma-field {
		margin-bottom: 1rem;
	}
</style>