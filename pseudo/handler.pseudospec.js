import { handler } from "lambda.js";

describe("someHandler(event, context)", () => {
	let returnValue;

	beforeEach(done => {
		handler({}, {succeed: (value) => {
			returnValue = value;
			done();
		}});
	});

	it("should call the database and return a value", () => {
		const expectedValue = "Bob";
		returnValue.should.eql(expectedValue);
	});
});
