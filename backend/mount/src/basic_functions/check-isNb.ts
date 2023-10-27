export function isNb(input: string): boolean {
	const floatPattern = /^[+-]?\d+(\.\d+)?$/;
	return floatPattern.test(input);
  }

export function isIntOnly(input: string): boolean {
	const floatPattern = /^\d?$/;
	return floatPattern.test(input);
  }
