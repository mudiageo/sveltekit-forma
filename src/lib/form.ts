import { getContext, setContext } from 'svelte';
import type { Snippet } from 'svelte';

const FORMOTE_FORM_CONTEXT_KEY = Symbol('formote-form');
const FORMOTE_FIELD_CONTEXT_KEY = Symbol('formote-field');

// Type for SvelteKit remote form objects
export interface RemoteForm {
	issues?: Record<string, Array<{ message: string }>> | null;
	input?: Record<string, any>;
	field?: (name: string) => string;
	validate?: (options?: { includeUntouched?: boolean }) => void;
	result?: any;
	[key: string]: any; // For method, action, and other form props
}

// Simplified form interface that wraps the remote form
export interface FormoteForm {
	remoteForm: RemoteForm;
	name: string;
}

export interface FormoteFieldContext {
	name: string;
	form: FormoteForm;
	fieldId: string;
	labelId: string;
	descriptionId: string;
	errorId: string;
	hasErrors: boolean;
	errors: Array<{ message: string }>;
	value: any;
}

/**
 * Sets the form context for child components
 */
export function setFormContext(form: FormoteForm) {
	setContext(FORMOTE_FORM_CONTEXT_KEY, form);
}

/**
 * Gets the form context
 */
export function getFormContext(): FormoteForm {
	const form = getContext<FormoteForm>(FORMOTE_FORM_CONTEXT_KEY);
	if (!form) {
		throw new Error('Form context not found. Make sure to use form components within a Field component.');
	}
	return form;
}

/**
 * Sets the field context for child components
 */
export function setFieldContext(context: FormoteFieldContext) {
	setContext(FORMOTE_FIELD_CONTEXT_KEY, context);
}

/**
 * Gets the field context
 */
export function getFieldContext(): FormoteFieldContext {
	const context = getContext<FormoteFieldContext>(FORMOTE_FIELD_CONTEXT_KEY);
	if (!context) {
		throw new Error('Field context not found. Make sure to use this component within a Field component.');
	}
	return context;
}

/**
 * Generates a unique ID for form elements
 */
export function generateId(prefix: string = 'formote'): string {
	return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}