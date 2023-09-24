export function isUsername(username: string): boolean {
	const usernamePattern = /^[a-zA-Z0-9\-+\/\[\]*?]{1,15}$/;
	return usernamePattern.test(username);
}
