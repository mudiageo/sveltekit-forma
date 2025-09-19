import { getContext, setContext } from 'svelte';
const FORMA_FORM_CONTEXT_KEY = Symbol('forma-form');
const FORMA_FIELD_CONTEXT_KEY = Symbol('forma-field');
/**
 * Sets the form context for child components
 */
export function setFormContext(form) {
    setContext(FORMA_FORM_CONTEXT_KEY, form);
}
/**
 * Gets the form context
 */
export function getFormContext() {
    const form = getContext(FORMA_FORM_CONTEXT_KEY);
    if (!form) {
        throw new Error('Form context not found. Make sure to use form components within a Field component.');
    }
    return form;
}
/**
 * Sets the field context for child components
 */
export function setFieldContext(context) {
    setContext(FORMA_FIELD_CONTEXT_KEY, context);
}
/**
 * Gets the field context
 */
export function getFieldContext() {
    const context = getContext(FORMA_FIELD_CONTEXT_KEY);
    if (!context) {
        throw new Error('Field context not found. Make sure to use this component within a Field component.');
    }
    return context;
}
/**
 * Generates a unique ID for form elements
 */
export function generateId(prefix = 'forma') {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}
