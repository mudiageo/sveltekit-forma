import { getContext, setContext } from 'svelte';
import type { Snippet } from 'svelte';

const FORMA_FORM_CONTEXT_KEY = Symbol('forma-form');
const FORMA_FIELD_CONTEXT_KEY = Symbol('forma-field');

export interface FormaForm {
	errors: Record<string, string[]>;
	values: Record<string, any>;
	touched: Record<string, boolean>;
	validate: (name?: string) => Promise<boolean>;
	setError: (name: string, error: string | string[]) => void;
	clearError: (name: string) => void;
	setValue: (name: string, value: any) => void;
	getValue: (name: string) => any;
	reset: () => void;
	submit: () => Promise<void>;
}

export interface FormaFieldContext {
	name: string;
	form: FormaForm;
	fieldId: string;
	labelId: string;
	descriptionId: string;
	errorId: string;
	hasErrors: boolean;
	errors: string[];
	value: any;
}

/**
 * Sets the form context for child components
 */
export function setFormContext(form: FormaForm) {
	setContext(FORMA_FORM_CONTEXT_KEY, form);
}

/**
 * Gets the form context
 */
export function getFormContext(): FormaForm {
	const form = getContext<FormaForm>(FORMA_FORM_CONTEXT_KEY);
	if (!form) {
		throw new Error('Form context not found. Make sure to use form components within a Field component.');
	}
	return form;
}

/**
 * Sets the field context for child components
 */
export function setFieldContext(context: FormaFieldContext) {
	setContext(FORMA_FIELD_CONTEXT_KEY, context);
}

/**
 * Gets the field context
 */
export function getFieldContext(): FormaFieldContext {
	const context = getContext<FormaFieldContext>(FORMA_FIELD_CONTEXT_KEY);
	if (!context) {
		throw new Error('Field context not found. Make sure to use this component within a Field component.');
	}
	return context;
}

/**
 * Generates a unique ID for form elements
 */
export function generateId(prefix: string = 'forma'): string {
	return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}