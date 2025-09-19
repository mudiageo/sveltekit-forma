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
		name: fieldContext.name,
		'aria-describedby': [
			fieldContext.hasErrors ? fieldContext.errorId : null,
			fieldContext.descriptionId
		].filter(Boolean).join(' '),
		'aria-invalid': fieldContext.hasErrors,
		'aria-labelledby': fieldContext.labelId,
		value: fieldContext.value,
		onchange: (event: Event) => {
			const target = event.target as HTMLInputElement;
			fieldContext.form.setValue(fieldContext.name, target.value);
		},
		onblur: () => {
			fieldContext.form.validate(fieldContext.name);
		}
	});
</script>

{@render children({ props: controlProps })}