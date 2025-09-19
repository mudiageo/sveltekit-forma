// Formote - The most powerful form library for SvelteKit with native remote functions support

// Import types first
import type { FormoteForm } from './form.js';

// Core types for formote library - simplified for latest remote functions API
export interface FormoteFieldProps {
	form: FormoteForm;
	name: string;
}

export interface FormoteControlProps {
	children?: any;
}

export interface FormoteLabelProps {
	children?: any;
}

export interface FormoteFieldErrorsProps {}

export interface FormoteDescriptionProps {
	children?: any;
}

export interface FormoteFieldsetProps {
	form: FormoteForm;
	name: string;
}

export interface FormoteLegendProps {
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
export type { FormoteForm, FormoteFieldContext, RemoteForm } from './form.js';