import SomeLambda from "lambda.class.js";

class LocalDatabase {}

describe("SomeLambda(event, context)", () => {
	let event;
	let context;
	let lambda;

	beforeEach(() => {
		event = {};
		context = {
			database: new LocalDatabase()
		};
		lambda = new SomeLambda(event, context);
	});

	it("should call the database and return a value", done => {
		context.succeed = (value) => {
			value.should.eql("Bob");
			done();
		};
		lambda.handler(event, context);
	});
});
