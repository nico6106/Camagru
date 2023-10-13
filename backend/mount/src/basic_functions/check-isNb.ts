export function isNb(input: string): boolean {
	const floatPattern = /^[+-]?\d+(\.\d+)?$/;
	return floatPattern.test(input);
  }
