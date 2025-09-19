// Core types for forma library
export interface FormaFieldProps {
	form: any;
	name: string;
}

export interface FormaControlProps {
	children?: any;
}

export interface FormaLabelProps {
	children?: any;
}

export interface FormaFieldErrorsProps {}

export interface FormaDescriptionProps {
	children?: any;
}

export interface FormaFieldsetProps {
	form: any;
	name: string;
}

export interface FormaLegendProps {
	children?: any;
}

// Export main components
export { default as Field } from './components/Field.svelte';
export { default as Control } from './components/Control.svelte';
export { default as Label } from './components/Label.svelte';
export { default as FieldErrors } from './components/FieldErrors.svelte';
export { default as Description } from './components/Description.svelte';
export { default as Fieldset } from './components/Fieldset.svelte';
export { default as Legend } from './components/Legend.svelte';

// Export form utilities
export { 
	setFormContext, 
	getFormContext, 
	setFieldContext, 
	getFieldContext, 
	generateId 
} from './form.js';
export type { FormaForm, FormaFieldContext } from './form.js';