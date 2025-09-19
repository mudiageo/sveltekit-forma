<script lang="ts">
	import { getFieldContext } from '../form.js';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet<[{ props: Record<string, any> }]>;
	}

	let { children }: Props = $props();

	const fieldContext = getFieldContext();

	const controlProps = $derived({
		id: fieldContext.fieldId,
		name: fieldContext.form.remoteForm.field?.(fieldContext.name) || fieldContext.name,
		'aria-describedby': [
			fieldContext.hasErrors ? fieldContext.errorId : null,
			fieldContext.descriptionId
		].filter(Boolean).join(' '),
		'aria-invalid': fieldContext.hasErrors,
		'aria-labelledby': fieldContext.labelId,
		value: fieldContext.value
	});
</script>

{@render children({ props: controlProps })}