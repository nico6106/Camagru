const ID_SIZE = 6;
const ID_BASE = 36;
const ID_MAX = ID_BASE ** ID_SIZE - 1;

export function generateId(): string {
    // while (true) {
        // const id = randomInt(0, ID_MAX).toString(36).padStart(ID_SIZE, '0');
    //     if (!links[id]) {
    //         return id;
    //     }
    // }
	return randomInt(0, ID_MAX).toString(36).padStart(ID_SIZE, '0');
};

export const randomInt = (min: number, max: number): number =>
    Math.floor(Math.random() * (max - min + 1)) + min;