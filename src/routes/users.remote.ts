// Example remote functions for user data
import { query, form, command } from '$app/server';
import { z } from 'zod';

// Example data store (in real app, this would be a database)
let users: Array<{ id: string; email: string; name: string; bio?: string; language: string; theme: string; marketingEmails: boolean }> = [];

const userSchema = z.object({
	email: z.string().email('Please enter a valid email address'),
	name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
	bio: z.string().max(250, 'Bio must be less than 250 characters').optional(),
	language: z.enum(['en', 'es', 'fr'], { message: 'Please select a valid language' }),
	theme: z.enum(['light', 'dark'], { message: 'Please select a valid theme' }),
	marketingEmails: z.boolean()
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

export const createUser = form(async (data: FormData) => {
	const rawData = {
		email: data.get('email'),
		name: data.get('name'),
		bio: data.get('bio'),
		language: data.get('language'),
		theme: data.get('theme'),
		marketingEmails: data.get('marketingEmails') === 'on'
	};

	try {
		const validData = userSchema.parse(rawData);
		
		const newUser = {
			id: Math.random().toString(36).substr(2, 9),
			...validData
		};
		
		users.push(newUser);
		
		return { success: true, user: newUser };
	} catch (error) {
		if (error instanceof z.ZodError) {
			const fieldErrors: Record<string, string[]> = {};
			error.errors.forEach(err => {
				const path = err.path.join('.');
				if (!fieldErrors[path]) {
					fieldErrors[path] = [];
				}
				fieldErrors[path].push(err.message);
			});
			return { errors: fieldErrors };
		}
		throw error;
	}
});

export const updateUser = command(z.object({
	id: z.string(),
	data: userSchema.partial()
}), async ({ id, data }) => {
	const userIndex = users.findIndex(u => u.id === id);
	if (userIndex === -1) {
		throw new Error('User not found');
	}
	
	users[userIndex] = { ...users[userIndex], ...data };
	
	// Refresh the queries
	await getUsers().refresh();
	await getUserById(id).refresh();
	
	return users[userIndex];
});

export const deleteUser = command(z.string(), async (id) => {
	const userIndex = users.findIndex(u => u.id === id);
	if (userIndex === -1) {
		throw new Error('User not found');
	}
	
	users.splice(userIndex, 1);
	
	// Refresh the users list
	await getUsers().refresh();
	
	return { success: true };
});