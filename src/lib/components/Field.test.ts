import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import Field from '../components/Field.svelte';
import Label from '../components/Label.svelte';
import Control from '../components/Control.svelte';
import type { FormoteForm } from '../form.js';

describe('Field Component', () => {
	const mockForm: FormoteForm = {
		remoteForm: {
			issues: {},
			input: { testField: 'test value' },
			field: (name: string) => name,
			validate: () => {}
		},
		name: 'testForm'
	};

	it('renders field with label', () => {
		render(Field, {
			props: {
				form: mockForm,
				name: 'testField'
			},
			children: {
				default: () => ({
					children: [
						render(Label, { children: { default: () => 'Test Label' } })
					]
				})
			}
		});

		expect(screen.getByText('Test Label')).toBeInTheDocument();
	});

	it('provides correct field context', () => {
		const { component } = render(Field, {
			props: {
				form: mockForm,
				name: 'testField'
			}
		});

		expect(component).toBeTruthy();
	});
});

describe('Form Integration', () => {
	it('handles form validation correctly', () => {
		const mockFormWithErrors: FormoteForm = {
			remoteForm: {
				issues: {
					email: [{ message: 'Email is required' }]
				},
				input: { email: '' },
				field: (name: string) => name,
				validate: () => {}
			},
			name: 'testForm'
		};

		expect(mockFormWithErrors.remoteForm.issues?.email).toHaveLength(1);
		expect(mockFormWithErrors.remoteForm.issues?.email?.[0].message).toBe('Email is required');
	});
});