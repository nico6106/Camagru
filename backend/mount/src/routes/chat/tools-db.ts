export type T_ListRequest = {
	fields: string[];
	values: any[];
}

/*return an object with :
1. tab of strings representing the field ['field', 'field']
2. tab of values representing the ids [ids[0], ids[1]] */
export function giveListIdToRequest(field: string, ids: any[]): T_ListRequest {
	const fields: string[] = [];
	const values: any[] = [];

	for (const elem of ids) {
		fields.push(field);
		values.push(elem);
	}
	
	const returnValue: T_ListRequest = {
		fields: fields,
		values: values,
	}
	return returnValue;
}