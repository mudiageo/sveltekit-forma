// Example remote functions for user data using latest SvelteKit remote functions API
import { query, form } from '$app/server';
import { z } from 'zod';

// Example data store (in real app, this would be a database)
let users: Array<{ id: string; email: string; name: string; bio?: string; language: string; theme: string; marketingEmails: boolean }> = [];

// Schema using the new form API - all fields must be string or File from FormData
const userSchema = z.object({
	email: z.string().email('Please enter a valid email address'),
	name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
	bio: z.string().max(250, 'Bio must be less than 250 characters').optional(),
	language: z.enum(['en', 'es', 'fr'], { message: 'Please select a valid language' }),
	theme: z.enum(['light', 'dark'], { message: 'Please select a valid theme' }),
	marketingEmails: z.string().optional() // Checkbox value, will be coerced to boolean
});

export const getUsers = query(async () => {
	return users;
});

export const getUserById = query(z.string(), async (id) => {
	const user = users.find(u => u.id === id);
	if (!user) {
		throw new Error('User not found');
	}
	return user;
});

// Updated form using new API with schema validation
export const createUser = form(
	userSchema,
	async ({ email, name, bio, language, theme, marketingEmails }) => {
		const newUser = {
			id: Math.random().toString(36).substr(2, 9),
			email,
			name,
			bio: bio || '',
			language,
			theme,
			marketingEmails: marketingEmails === 'on' // Convert checkbox string to boolean
		};
		
		users.push(newUser);
		
		// Refresh the users query
		await getUsers().refresh();
		
		return { success: true, user: newUser };
	}
);