<script lang="ts">
	import { Field, Control, Label, FieldErrors, Description, Fieldset, Legend } from '$lib/index.js';
	import type { FormoteForm } from '$lib/index.js';
	import { createUser, getUsers } from '../users.remote.js';
	import { z } from 'zod';

	// Create a client-side preflight schema for instant validation
	const clientSchema = z.object({
		email: z.string().email('Please enter a valid email address'),
		name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
		bio: z.string().max(250, 'Bio must be less than 250 characters').optional(),
		language: z.enum(['en', 'es', 'fr'], { message: 'Please select a valid language' }),
		theme: z.enum(['light', 'dark'], { message: 'Please select a valid theme' }),
		marketingEmails: z.string().optional()
	});

	// Wrap the remote form in our FormoteForm interface
	const form: FormoteForm = {
		remoteForm: createUser.preflight(clientSchema),
		name: 'createUser'
	};
</script>

<div class="container">
	<h1>SvelteKit Formote - Remote Functions</h1>
	<p>A form library built on SvelteKit's latest remote functions API</p>
	
	<div class="form-section">
		<h2>Create User</h2>
		
		<!-- Use the remote form directly with our component wrapper -->
		<form 
			{...form.remoteForm}
			class="example-form"
		>
			<Field {form} name="email">
				<Label>Email Address</Label>
				<Control>
					{#snippet children({ props })}
						<input 
							type="email" 
							{...props} 
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

		{#if form.remoteForm.result?.success}
			<div class="success-message">
				<p>✅ User created successfully!</p>
			</div>
		{/if}
	</div>

	<div class="live-section">
		<h2>Form State (Live)</h2>
		<div class="state-display">
			<h3>Current Input</h3>
			<pre class="values-display">{JSON.stringify(form.remoteForm.input, null, 2)}</pre>
			
			{#if form.remoteForm.issues && Object.keys(form.remoteForm.issues).length > 0}
				<h3>Validation Issues</h3>
				<pre class="errors-display">{JSON.stringify(form.remoteForm.issues, null, 2)}</pre>
			{/if}
		</div>
	</div>

	<div class="users-section">
		<h2>Users</h2>
		<div class="users-container">
			{#await getUsers()}
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

	.success-message {
		background: #f0fdf4;
		border: 1px solid #bbf7d0;
		border-radius: 0.5rem;
		padding: 1rem;
		margin-top: 1rem;
		color: #166534;
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