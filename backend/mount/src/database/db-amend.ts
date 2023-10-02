import { QueryResult } from "pg";
import { Database } from "./db";
import { TableUser } from "./data";

/*select a value in the table*/
export async function exec_AmendOneElemFromTable(db: Database, table: string, field: string, whereField: string, whereId: any , elem: any): Promise<QueryResult | null> {
	const query: string = `UPDATE ${table} SET ${field} = $1 WHERE ${whereField} = ${whereId}`;
	const values: any[] = [];
	values.push(elem);
	try {
		const retour = await db.executeQueryArgs(query, values)
		if (retour && retour.rowCount !== 0) {
			return retour;
		}
		return null;
	} catch (err) {
		return null;
	}
}
