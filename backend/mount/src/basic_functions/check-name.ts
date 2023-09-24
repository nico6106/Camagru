export function isName(username: string): boolean {
	const usernamePattern = /^[a-zA-ZÀ-ÖØ-öø-ÿ\d\s\-+*?']{1,15}$/;
	return usernamePattern.test(username);  
}
