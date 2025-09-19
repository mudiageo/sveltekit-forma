<script lang="ts">
	import { Field, Control, Label, FieldErrors, Description, Fieldset, Legend } from '$lib/index.js';
	import type { FormoteForm } from '$lib/index.js';

	// Simple reactive form values
	let formValues = $state({
		email: '',
		name: '',
		bio: '',
		language: 'en',
		theme: 'light',
		marketingEmails: false
	});

	let formErrors = $state<Record<string, Array<{ message: string }>>>({});

	// Create mock remote form that matches RemoteForm interface
	const mockRemoteForm = {
		method: 'POST' as const,
		action: '/api/users',
		get input() { return formValues; },
		get issues() { return Object.keys(formErrors).length > 0 ? formErrors : null; },
		result: null
	};

	// Wrap in FormoteForm interface
	const form: FormoteForm = {
		remoteForm: mockRemoteForm,
		name: 'createUser'
	};

	function handleSubmit(event: Event) {
		event.preventDefault();
		
		// Simple validation
		const errors: Record<string, Array<{ message: string }>> = {};
		
		if (!formValues.email) {
			errors.email = [{ message: 'Email is required' }];
		} else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
			errors.email = [{ message: 'Please enter a valid email address' }];
		}
		
		if (!formValues.name.trim()) {
			errors.name = [{ message: 'Name is required' }];
		}

		formErrors = errors;

		if (Object.keys(errors).length === 0) {
			console.log('Form submitted successfully:', formValues);
			alert('Form submitted successfully!');
		}
	}
</script>

<main>
	<h1>SvelteKit Formote Example</h1>
	<p>A form library built on SvelteKit remote functions</p>

	<h2>Create User</h2>

	<form onsubmit={handleSubmit}>
		<Field {form} name="email">
			<Label>Email Address</Label>
			<Control>
				{#snippet children({ props })}
					<input type="email" {...props} bind:value={formValues.email} />
				{/snippet}
			</Control>
			<Description>We'll send you important updates via email.</Description>
			<FieldErrors />
		</Field>

		<Field {form} name="name">
			<Label>Full Name</Label>
			<Control>
				{#snippet children({ props })}
					<input type="text" {...props} bind:value={formValues.name} />
				{/snippet}
			</Control>
			<FieldErrors />
		</Field>

		<Field {form} name="bio">
			<Label>Bio (Optional)</Label>
			<Control>
				{#snippet children({ props })}
					<textarea {...props} bind:value={formValues.bio}></textarea>
				{/snippet}
			</Control>
			<Description>Tell us a bit about yourself (max 250 characters).</Description>
			<FieldErrors />
		</Field>

		<Field {form} name="language">
			<Label>Preferred Language</Label>
			<Control>
				{#snippet children({ props })}
					<select {...props} bind:value={formValues.language}>
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
					<input type="checkbox" {...props} bind:checked={formValues.marketingEmails} />
				{/snippet}
			</Control>
			<Label>Subscribe to marketing emails</Label>
			<FieldErrors />
		</Field>

		<Fieldset {form} name="theme">
			<Legend>Select your theme</Legend>
			
			{#each ['light', 'dark'] as themeOption}
				<div>
					<Control>
						{#snippet children({ props })}
							<input 
								type="radio" 
								{...props}
								id="theme-{themeOption}"
								value={themeOption}
								bind:group={formValues.theme}
							/>
						{/snippet}
					</Control>
					<Label for="theme-{themeOption}">{themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}</Label>
				</div>
			{/each}
			<FieldErrors />
		</Fieldset>

		<button type="submit">Create User</button>
	</form>

	<h2>Form Values (Live)</h2>
	<pre>{JSON.stringify(formValues, null, 2)}</pre>
</main>

<style>
	main {
		max-width: 600px;
		margin: 0 auto;
		padding: 20px;
		font-family: system-ui, sans-serif;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	input, textarea, select {
		width: 100%;
		padding: 8px;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 16px;
	}

	button {
		padding: 12px 24px;
		background: #007acc;
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 16px;
		cursor: pointer;
	}

	button:hover {
		background: #005999;
	}

	pre {
		background: #f5f5f5;
		padding: 1rem;
		border-radius: 4px;
		overflow: auto;
	}
</style>