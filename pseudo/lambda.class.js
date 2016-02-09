import Database from "almaden";

export class GetFirstName {
	constructor(event, context) {
		this.database = context.database || new Database();
	}

	handler(event, context) {
		this.database
			.select("first_name").one
			.from("users")
			.where("id", 1)
			.results((error, row) => {
				context.succeed(row.first_name);
			});
	}
}
