// Simple user management without remote functions for now
export let users: Array<{ id: string; email: string; name: string; bio?: string; language: string; theme: string; marketingEmails: boolean }> = [];

export async function getUsers() {
	return users;
}

export async function createUser(userData: any) {
	const newUser = {
		id: Math.random().toString(36).substr(2, 9),
		...userData
	};
	users.push(newUser);
	return { success: true, user: newUser };
}