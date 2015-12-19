import ConanSteps from "../../lib/conanSteps.js";
import Conan from "../../lib/conan.js";

import sinon from "sinon";

describe("conanSteps.start(callback)", () => {
	let conan,
			steps,
			stepOne,
			stepOneParameters,
			stepTwo,
			stepTwoParameters;

	beforeEach(() => {
		conan = new Conan();
		steps = new ConanSteps(conan);

		stepOne = sinon.spy((parentConan, context, done) => {
			done(null, {apiId: 15});
		});

		stepTwo = sinon.spy((parentConan, context, done) => {
			done(null, {stageId: 8});
		});

		stepOneParameters = {"apiName": "test-dev"};
		steps.add(stepOne, stepOneParameters);

		stepTwoParameters = {"stageName": "production"};
		steps.add(stepTwo, stepTwoParameters);
	});

	it("should run all step functions in order", done => {
		steps.start((error) => {
			sinon.assert.callOrder(stepOne, stepTwo);
			done(error);
		});
	});

	it("should pass conan as the first argument to each step", done => {
		steps.start((error) => {
			stepOne.firstCall.args[0].should.eql(conan);
			done(error);
		});
	});

	it("should pass the step context as the second argument to each step", done => {
		steps.start((error) => {
			stepOne.firstCall.args[1].should.eql({
				parameters: stepOneParameters,
				results: {}
			});
			done(error);
		});
	});
	it("should pass step callback as the last argument to each step", done => {
		steps.start((error) => {
			(typeof stepOne.firstCall.args[2]).should.equal("function");
			done(error);
		});
	});

	it("should pass results to each next steps", done => {
		steps.start((error) => {
			stepTwo.firstCall.args[1].should.eql({
				parameters: stepTwoParameters,
				results: {
					apiId: 15
				}
			});
			done(error);
		});
	});
});
