<script lang="ts">
	import { Field, Control, Label, FieldErrors, Description, Fieldset, Legend } from '$lib/index.js';
	import type { FormaForm } from '$lib/index.js';
	import { createUser, getUsers } from './users.remote.js';

	// Create form state using Svelte 5 runes
	let formValues = $state({
		email: '',
		name: '',
		bio: '',
		language: 'en',
		theme: 'light',
		marketingEmails: false
	});

	let formErrors = $state<Record<string, string[]>>({});
	let formTouched = $state<Record<string, boolean>>({});

	// Create form object with validation
	const form: FormaForm = {
		get errors() { return formErrors; },
		get values() { return formValues; },
		get touched() { return formTouched; },

		async validate(name?: string) {
			const errors: Record<string, string> = {};
			
			if (!formValues.email) {
				errors.email = 'Email is required';
			} else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
				errors.email = 'Please enter a valid email address';
			}
			
			if (!formValues.name) {
				errors.name = 'Name is required';
			} else if (formValues.name.length > 100) {
				errors.name = 'Name must be less than 100 characters';
			}
			
			if (formValues.bio && formValues.bio.length > 250) {
				errors.bio = 'Bio must be less than 250 characters';
			}

			if (name) {
				// Validate specific field
				if (errors[name]) {
					formErrors = { ...formErrors, [name]: [errors[name]] };
				} else {
					const newErrors = { ...formErrors };
					delete newErrors[name];
					formErrors = newErrors;
				}
			} else {
				// Validate all fields
				const newErrors: Record<string, string[]> = {};
				Object.keys(errors).forEach(key => {
					newErrors[key] = [errors[key]];
				});
				formErrors = newErrors;
			}
			
			return Object.keys(formErrors).length === 0;
		},

		setError(name: string, error: string | string[]) {
			const newErrors = { ...formErrors };
			newErrors[name] = Array.isArray(error) ? error : [error];
			formErrors = newErrors;
		},

		clearError(name: string) {
			const newErrors = { ...formErrors };
			delete newErrors[name];
			formErrors = newErrors;
		},

		setValue(name: string, value: any) {
			formValues = { ...formValues, [name]: value };
			formTouched = { ...formTouched, [name]: true };
		},

		getValue(name: string) {
			return formValues[name];
		},

		reset() {
			formValues = {
				email: '',
				name: '',
				bio: '',
				language: 'en',
				theme: 'light',
				marketingEmails: false
			};
			formErrors = {};
			formTouched = {};
		},

		async submit() {
			const isValid = await this.validate();
			if (isValid) {
				console.log('Form submitted successfully');
			}
		}
	};

	// Get the remote form handler
	const remoteForm = createUser;

	// Handle form submission with remote functions
	async function handleSubmit() {
		const isValid = await form.validate();
		if (!isValid) return;

		try {
			// The form will be submitted via the enhance function
			// This is just for demonstration
			console.log('Form is valid and ready to submit');
		} catch (error) {
			console.error('Submission error:', error);
		}
	}
</script>

<div class="container">
	<h1>SvelteKit Forma Example</h1>
	<p>A form library built on SvelteKit remote functions</p>
	
	<div class="form-section">
		<h2>Create User</h2>
		
		<form 
			{...remoteForm.enhance(async ({ form: formElement, data, submit }) => {
				const isValid = await form.validate();
				if (isValid) {
					try {
						await submit();
						form.reset();
						await getUsers().refresh();
					} catch (error) {
						console.error('Form submission error:', error);
					}
				}
			})}
			class="example-form"
		>
			<Field {form} name="email">
				<Label>Email Address</Label>
				<Control>
					{#snippet children({ props })}
						<input 
							type="email" 
							{...props} 
							bind:value={formValues.email}
							class="input"
						/>
					{/snippet}
				</Control>
				<Description>We'll send you important updates via email.</Description>
				<FieldErrors />
			</Field>

			<Field {form} name="name">
				<Label>Full Name</Label>
				<Control>
					{#snippet children({ props })}
						<input 
							type="text" 
							{...props} 
							bind:value={formValues.name}
							class="input"
						/>
					{/snippet}
				</Control>
				<FieldErrors />
			</Field>

			<Field {form} name="bio">
				<Label>Bio (Optional)</Label>
				<Control>
					{#snippet children({ props })}
						<textarea 
							{...props} 
							bind:value={formValues.bio}
							class="textarea"
							rows="3"
						></textarea>
					{/snippet}
				</Control>
				<Description>Tell us a bit about yourself (max 250 characters).</Description>
				<FieldErrors />
			</Field>

			<Field {form} name="language">
				<Label>Preferred Language</Label>
				<Control>
					{#snippet children({ props })}
						<select 
							{...props} 
							bind:value={formValues.language}
							class="select"
						>
							<option value="en">English</option>
							<option value="es">Spanish</option>
							<option value="fr">French</option>
						</select>
					{/snippet}
				</Control>
				<FieldErrors />
			</Field>

			<Field {form} name="marketingEmails">
				<Control>
					{#snippet children({ props })}
						<input 
							type="checkbox" 
							{...props} 
							bind:checked={formValues.marketingEmails}
							class="checkbox"
						/>
						<Label>Subscribe to marketing emails</Label>
					{/snippet}
				</Control>
				<FieldErrors />
			</Field>

			<Fieldset {form} name="theme">
				<Legend>Select your theme</Legend>
				{#each ['light', 'dark'] as themeOption}
					<div class="radio-group">
						<Control>
							{#snippet children({ props })}
								<input 
									{...props}
									type="radio" 
									bind:group={formValues.theme} 
									value={themeOption}
									class="radio"
								/>
								<label for={props.id} class="radio-label">
									{themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
								</label>
							{/snippet}
						</Control>
					</div>
				{/each}
				<FieldErrors />
			</Fieldset>

			<button type="submit" class="submit-button">
				Create User
			</button>
		</form>
	</div>

	<div class="users-section">
		<h2>Users</h2>
		{#each await getUsers() as user (user.id)}
			<div class="user-card">
				<h3>{user.name}</h3>
				<p><strong>Email:</strong> {user.email}</p>
				{#if user.bio}
					<p><strong>Bio:</strong> {user.bio}</p>
				{/if}
				<p><strong>Language:</strong> {user.language}</p>
				<p><strong>Theme:</strong> {user.theme}</p>
				<p><strong>Marketing Emails:</strong> {user.marketingEmails ? 'Yes' : 'No'}</p>
			</div>
		{/each}
	</div>
</div>

<style>
	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
		font-family: system-ui, sans-serif;
	}

	.form-section, .users-section {
		margin-bottom: 3rem;
	}

	.example-form {
		background: #f9fafb;
		padding: 2rem;
		border-radius: 0.5rem;
		border: 1px solid #e5e7eb;
	}

	.input, .textarea, .select {
		width: 100%;
		padding: 0.5rem 0.75rem;
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
		font-size: 1rem;
		transition: border-color 0.15s ease-in-out;
	}

	.input:focus, .textarea:focus, .select:focus {
		outline: none;
		border-color: #3b82f6;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	.checkbox, .radio {
		margin-right: 0.5rem;
	}

	.radio-group {
		margin-bottom: 0.5rem;
		display: flex;
		align-items: center;
	}

	.radio-label {
		cursor: pointer;
		font-weight: normal;
	}

	.submit-button {
		background: #3b82f6;
		color: white;
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 0.375rem;
		font-size: 1rem;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.15s ease-in-out;
	}

	.submit-button:hover {
		background: #2563eb;
	}

	.user-card {
		background: white;
		padding: 1.5rem;
		border-radius: 0.5rem;
		border: 1px solid #e5e7eb;
		margin-bottom: 1rem;
	}

	.user-card h3 {
		margin: 0 0 1rem 0;
		color: #1f2937;
	}

	.user-card p {
		margin: 0.5rem 0;
		color: #6b7280;
	}

	h1, h2 {
		color: #1f2937;
	}

	h1 {
		margin-bottom: 0.5rem;
	}

	h2 {
		margin-bottom: 1rem;
	}
</style>