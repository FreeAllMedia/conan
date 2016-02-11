/* istanbul ignore */

import Database from "almaden";

export function handler(event, context) {
	const database = new Database();

	database
		.select("first_name").one
		.from("users")
		.where("id", 1)
		.results((error, row) => {
			context.succeed(row.first_name);
		});
}
