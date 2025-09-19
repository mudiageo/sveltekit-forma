<script lang="ts">
	import { Field, Control, Label, FieldErrors, Description } from '$lib/index.js';
	import type { FormaForm } from '$lib/index.js';
	import { z } from 'zod';

	// Mock shadcn-svelte components (in real usage, these would be imported from your ui lib)
	const Input = 'input';
	const Button = 'button';
	const Textarea = 'textarea';
	const Select = 'select';

	// Form state using Svelte 5 runes
	let formInput = $state({
		email: '',
		name: '',
		bio: '',
		language: 'en',
		theme: 'light',
		marketingEmails: ''
	});

	let formIssues = $state<Record<string, Array<{ message: string }>>>({});

	// Client-side validation schema
	const clientSchema = z.object({
		email: z.string().email('Please enter a valid email address'),
		name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
		bio: z.string().max(250, 'Bio must be less than 250 characters').optional(),
		language: z.enum(['en', 'es', 'fr'], { message: 'Please select a valid language' }),
		theme: z.enum(['light', 'dark'], { message: 'Please select a valid theme' }),
		marketingEmails: z.string().optional()
	});

	// Mock remote form that demonstrates shadcn-svelte integration
	const mockRemoteForm = {
		method: 'POST',
		action: '/api/users',
		input: formInput,
		issues: formIssues,
		result: null as any,
		field: (name: string) => name,
		validate: (options?: { includeUntouched?: boolean }) => {
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

	// Create FormaForm compatible with shadcn-svelte
	const form: FormaForm = {
		remoteForm: mockRemoteForm,
		name: 'createUser'
	};

	// Handle form submission
	async function handleSubmit(event: Event) {
		event.preventDefault();
		mockRemoteForm.validate();
		
		if (Object.keys(formIssues).length === 0) {
			// Simulate successful submission
			mockRemoteForm.result = { success: true };
			
			// Reset form
			formInput = {
				email: '',
				name: '',
				bio: '',
				language: 'en',
				theme: 'light',
				marketingEmails: ''
			};
		}
	}
</script>

<div class="min-h-screen bg-background p-8">
	<div class="mx-auto max-w-2xl">
		<div class="space-y-6">
			<div class="space-y-2">
				<h1 class="text-3xl font-bold tracking-tight">Remotive + shadcn-svelte</h1>
				<p class="text-muted-foreground">
					A beautiful form using Remotive components with shadcn-svelte styling.
				</p>
			</div>

			<form 
				method={mockRemoteForm.method}
				action={mockRemoteForm.action}
				onsubmit={handleSubmit}
				class="space-y-6 rounded-lg border p-6"
			>
				<div class="space-y-4">
					<Field {form} name="email">
						<div class="space-y-2">
							<Label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
								Email Address
							</Label>
							<Control>
								{#snippet children({ props })}
									<input
										type="email"
										{...props}
										bind:value={formInput.email}
										class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
										placeholder="Enter your email"
									/>
								{/snippet}
							</Control>
							<Description class="text-sm text-muted-foreground">
								We'll send you important updates via email.
							</Description>
							<FieldErrors class="text-sm font-medium text-destructive" />
						</div>
					</Field>

					<Field {form} name="name">
						<div class="space-y-2">
							<Label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
								Full Name
							</Label>
							<Control>
								{#snippet children({ props })}
									<input
										type="text"
										{...props}
										bind:value={formInput.name}
										class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
										placeholder="Enter your full name"
									/>
								{/snippet}
							</Control>
							<FieldErrors class="text-sm font-medium text-destructive" />
						</div>
					</Field>

					<Field {form} name="bio">
						<div class="space-y-2">
							<Label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
								Bio (Optional)
							</Label>
							<Control>
								{#snippet children({ props })}
									<textarea
										{...props}
										bind:value={formInput.bio}
										class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
										placeholder="Tell us a bit about yourself"
										rows="3"
									></textarea>
								{/snippet}
							</Control>
							<Description class="text-sm text-muted-foreground">
								Tell us a bit about yourself (max 250 characters).
							</Description>
							<FieldErrors class="text-sm font-medium text-destructive" />
						</div>
					</Field>

					<Field {form} name="language">
						<div class="space-y-2">
							<Label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
								Preferred Language
							</Label>
							<Control>
								{#snippet children({ props })}
									<select
										{...props}
										bind:value={formInput.language}
										class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
									>
										<option value="en">English</option>
										<option value="es">Spanish</option>
										<option value="fr">French</option>
									</select>
								{/snippet}
							</Control>
							<FieldErrors class="text-sm font-medium text-destructive" />
						</div>
					</Field>

					<Field {form} name="marketingEmails">
						<div class="flex items-center space-x-2">
							<Control>
								{#snippet children({ props })}
									<input
										type="checkbox"
										{...props}
										bind:value={formInput.marketingEmails}
										class="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
									/>
								{/snippet}
							</Control>
							<Label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
								Subscribe to marketing emails
							</Label>
						</div>
						<FieldErrors class="text-sm font-medium text-destructive" />
					</Field>

					<div class="space-y-3">
						<Label class="text-sm font-medium leading-none">Theme Preference</Label>
						<div class="space-y-2">
							{#each ['light', 'dark'] as themeOption}
								<div class="flex items-center space-x-2">
									<input
										type="radio"
										bind:group={formInput.theme}
										value={themeOption}
										id="theme-{themeOption}"
										class="aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
									/>
									<Label for="theme-{themeOption}" class="text-sm font-normal cursor-pointer">
										{themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
									</Label>
								</div>
							{/each}
						</div>
					</div>
				</div>

				<button
					type="submit"
					class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
				>
					Create User
				</button>
			</form>

			{#if mockRemoteForm.result?.success}
				<div class="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
					<div class="flex items-center space-x-2">
						<div class="h-4 w-4 rounded-full bg-green-500"></div>
						<p class="text-sm font-medium">User created successfully!</p>
					</div>
				</div>
			{/if}

			<div class="rounded-lg border bg-card text-card-foreground shadow-sm">
				<div class="p-6 space-y-4">
					<h3 class="text-lg font-semibold">Live Form State</h3>
					<div class="space-y-2">
						<h4 class="text-sm font-medium">Current Input:</h4>
						<pre class="text-xs bg-muted p-3 rounded-md overflow-auto font-mono">{JSON.stringify(formInput, null, 2)}</pre>
					</div>
					
					{#if Object.keys(formIssues).length > 0}
						<div class="space-y-2">
							<h4 class="text-sm font-medium text-destructive">Validation Issues:</h4>
							<pre class="text-xs bg-destructive/10 text-destructive p-3 rounded-md overflow-auto font-mono">{JSON.stringify(formIssues, null, 2)}</pre>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	/* Basic CSS variables for shadcn-svelte theming */
	:global(:root) {
		--background: 0 0% 100%;
		--foreground: 222.2 84% 4.9%;
		--card: 0 0% 100%;
		--card-foreground: 222.2 84% 4.9%;
		--primary: 222.2 47.4% 11.2%;
		--primary-foreground: 210 40% 98%;
		--muted: 210 40% 96%;
		--muted-foreground: 215.4 16.3% 46.9%;
		--border: 214.3 31.8% 91.4%;
		--input: 214.3 31.8% 91.4%;
		--ring: 222.2 84% 4.9%;
		--destructive: 0 84.2% 60.2%;
		--destructive-foreground: 210 40% 98%;
	}

	:global(.dark) {
		--background: 222.2 84% 4.9%;
		--foreground: 210 40% 98%;
		--card: 222.2 84% 4.9%;
		--card-foreground: 210 40% 98%;
		--primary: 210 40% 98%;
		--primary-foreground: 222.2 47.4% 11.2%;
		--muted: 217.2 32.6% 17.5%;
		--muted-foreground: 215 20.2% 65.1%;
		--border: 217.2 32.6% 17.5%;
		--input: 217.2 32.6% 17.5%;
		--ring: 212.7 26.8% 83.9%;
		--destructive: 0 62.8% 30.6%;
		--destructive-foreground: 210 40% 98%;
	}

	:global(*) {
		border-color: hsl(var(--border));
	}

	:global(body) {
		background-color: hsl(var(--background));
		color: hsl(var(--foreground));
	}
</style>