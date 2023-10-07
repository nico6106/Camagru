import { Database } from "../../database/db";
import { TableUser, TableUsersName } from "../../database/data";

type OptionComputeFame = 'viewed' | 'liked' | 'unliked' | 'fake' | 'GPS' | 'match';

export async function computeFame(db: Database, type: OptionComputeFame, user: TableUser) {
	const option: OptionComputeFame[] = ['viewed', 'liked', 'unliked', 'fake', 'GPS', 'match'];
	const note: number[] = [1, 2, -2, -5, 10, 2];

	const indexData: number = option.findIndex((elem) => elem === type);

	let newFameEvol: number = user.fame_evol + note[indexData];

	let newFameRating: number = user.fame_rating;
	if (newFameEvol >= 10) {
		if (newFameRating < 10)
			newFameRating++;
		newFameEvol = newFameEvol - 10;
	}
	else if (newFameEvol <= -10) {
		if (newFameRating > 1)
			newFameRating--;
		newFameEvol = newFameEvol + 10;
	}

	await db.AmendElemsFromTable(
		TableUsersName,
		'id',
		user.id,
		['fame_rating', 'fame_evol'],
		[newFameRating, newFameEvol],
	);
}
