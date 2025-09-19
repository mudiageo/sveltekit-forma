<script lang="ts">
	import { Field, Control, Label, FieldErrors, Description, Fieldset, Legend } from '$lib/index.js';
	import type { FormoteForm } from '$lib/index.js';
	import { getUsers, createUser } from '../demo-utils.js';
	import { z } from 'zod';

	// Mock remote form object for demonstration
	let formInput = $state({
		email: '',
		name: '',
		bio: '',
		language: 'en',
		theme: 'light',
		marketingEmails: ''
	});

	let formIssues = $state<Record<string, Array<{ message: string }>>>({});

	// Create a client-side validation schema
	const clientSchema = z.object({
		email: z.string().email('Please enter a valid email address'),
		name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
		bio: z.string().max(250, 'Bio must be less than 250 characters').optional(),
		language: z.enum(['en', 'es', 'fr'], { message: 'Please select a valid language' }),
		theme: z.enum(['light', 'dark'], { message: 'Please select a valid theme' }),
		marketingEmails: z.string().optional()
	});

	// Mock remote form object that matches the SvelteKit remote functions API
	const mockRemoteForm = {
		method: 'POST',
		action: '/api/users',
		input: formInput,
		issues: formIssues,
		result: null as any,
		field: (name: string) => name,
		validate: (options?: { includeUntouched?: boolean }) => {
			// Client-side validation
			try {
				clientSchema.parse(formInput);
				formIssues = {};
			} catch (error) {
				if (error instanceof z.ZodError) {
					const newIssues: Record<string, Array<{ message: string }>> = {};
					error.errors.forEach(err => {
						const path = err.path.join('.');
						if (!newIssues[path]) {
							newIssues[path] = [];
						}
						newIssues[path].push({ message: err.message });
					});
					formIssues = newIssues;
				}
			}
		}
	};

	// Wrap the mock remote form in our FormoteForm interface
	const form: FormoteForm = {
		remoteForm: mockRemoteForm,
		name: 'createUser'
	};

	// Handle form submission
	async function handleSubmit(event: Event) {
		event.preventDefault();
		
		// Validate first
		mockRemoteForm.validate();
		
		if (Object.keys(formIssues).length === 0) {
			// Convert form data for submission
			const userData = {
				...formInput,
				marketingEmails: formInput.marketingEmails === 'on'
			};
			
			try {
				const result = await createUser(userData);
				
				// Reset form on success
				formInput = {
					email: '',
					name: '',
					bio: '',
					language: 'en',
					theme: 'light',
					marketingEmails: ''
				};
				
				mockRemoteForm.result = result;
			} catch (error) {
				console.error('Form submission error:', error);
			}
		}
	}

	// Get users for display
	let usersPromise = $state(getUsers());

	function refreshUsers() {
		usersPromise = getUsers();
	}
</script>

<div class="container">
	<h1>SvelteKit Formote - Updated API</h1>
	<p>A form library that's ready for SvelteKit's remote functions</p>
	
	<div class="form-section">
		<h2>Create User</h2>
		
		<form 
			method={mockRemoteForm.method}
			action={mockRemoteForm.action}
			onsubmit={handleSubmit}
			class="example-form"
		>
			<Field {form} name="email">
				<Label>Email Address</Label>
				<Control>
					{#snippet children({ props })}
						<input 
							type="email" 
							{...props} 
							bind:value={formInput.email}
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
							bind:value={formInput.name}
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
							bind:value={formInput.bio}
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
							bind:value={formInput.language}
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
							bind:value={formInput.marketingEmails}
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
									bind:group={formInput.theme}
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

		{#if mockRemoteForm.result?.success}
			<div class="success-message">
				<p>✅ User created successfully!</p>
				<button onclick={() => { mockRemoteForm.result = null; refreshUsers(); }} class="dismiss-button">
					Dismiss
				</button>
			</div>
		{/if}
	</div>

	<div class="live-section">
		<h2>Form State (Live)</h2>
		<div class="state-display">
			<h3>Current Input</h3>
			<pre class="values-display">{JSON.stringify(formInput, null, 2)}</pre>
			
			{#if Object.keys(formIssues).length > 0}
				<h3>Validation Issues</h3>
				<pre class="errors-display">{JSON.stringify(formIssues, null, 2)}</pre>
			{/if}
		</div>
	</div>

	<div class="users-section">
		<h2>Users</h2>
		<div class="users-container">
			{#await usersPromise}
				<p>Loading users...</p>
			{:then users}
				{#each users as user (user.id)}
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
			{:catch error}
				<p>Error loading users: {error.message}</p>
			{/await}
		</div>
	</div>
</div>

<style>
	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
		font-family: system-ui, sans-serif;
	}

	.form-section, .live-section, .users-section {
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

	.submit-button, .dismiss-button {
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

	.submit-button:hover, .dismiss-button:hover {
		background: #2563eb;
	}

	.dismiss-button {
		background: #059669;
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
		margin-left: 1rem;
	}

	.dismiss-button:hover {
		background: #047857;
	}

	.success-message {
		background: #f0fdf4;
		border: 1px solid #bbf7d0;
		border-radius: 0.5rem;
		padding: 1rem;
		margin-top: 1rem;
		color: #166534;
		display: flex;
		align-items: center;
	}

	.state-display {
		background: #f8fafc;
		border: 1px solid #e2e8f0;
		border-radius: 0.5rem;
		padding: 1.5rem;
	}

	.values-display, .errors-display {
		background: #f3f4f6;
		padding: 1rem;
		border-radius: 0.375rem;
		border: 1px solid #e5e7eb;
		font-family: monospace;
		font-size: 0.875rem;
		overflow-x: auto;
		margin-top: 0.5rem;
	}

	.errors-display {
		background: #fef2f2;
		border-color: #fecaca;
		color: #991b1b;
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

	h1, h2, h3 {
		color: #1f2937;
	}

	h1 {
		margin-bottom: 0.5rem;
	}

	h2 {
		margin-bottom: 1rem;
	}
</style>