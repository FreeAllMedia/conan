import ConanSteps from "../../../lib/components/conanSteps.js";
import Conan from "../../../lib/conan.js";

import sinon from "sinon";
import temp from "temp";
import fs from "fs";

describe("conanSteps.start(callback)", () => {
	let conan,
			steps,
			stepOne,
			stepOneParameters,
			stepTwo,
			stepTwoParameters,

			temporaryFilePath;

	beforeEach(done => {
		conan = new Conan();
		steps = new ConanSteps(conan);

		steps.library("sinon", sinon);

		stepOne = sinon.spy((parentConan, context, stepDone) => {
			temporaryFilePath = `${context.temporaryDirectoryPath}/temp.file`;
			fs.writeFile(temporaryFilePath, "Hello!", () => {
				stepDone(null, {apiId: 15});
			});
		});

		stepTwo = sinon.spy((parentConan, context, stepDone) => {
			stepDone(null, {stageId: 8});
		});

		stepOneParameters = {"apiName": "test-dev"};
		steps.add(stepOne, stepOneParameters);

		stepTwoParameters = {"stageName": "production"};
		steps.add(stepTwo, stepTwoParameters);

		steps.start(done);
	});

	it("should run all step functions in order", () => {
		sinon.assert.callOrder(stepOne, stepTwo);
	});

	it("should pass conan as the first argument to each step", () => {
		stepOne.firstCall.args[0].should.eql(conan);
	});

	it("should pass the step parameters through the context", () => {
		stepOne.firstCall.args[1].parameters.should.eql(stepOneParameters);
	});

	it("should pass the step libraries through the context", () => {
		stepOne.firstCall.args[1].libraries.should.eql({
			sinon: sinon
		});
	});

	it("should pass the step a temp directory path through the context", () => {
		stepOne.firstCall.args[1].temporaryDirectoryPath.should.include("conanSteps");
	});

	it("should pass the step results through the context", () => {
		stepTwo.firstCall.args[1].results.should.eql({
			apiId: 15
		});
	});

	it("should pass step callback as the last argument to each step", () => {
		(typeof stepOne.firstCall.args[2]).should.equal("function");
	});

	describe("(Error handling)", () => {
		let stepError;

		beforeEach(() => {
			conan = new Conan();
			steps = new ConanSteps(conan);
			stepError = new Error("Some step error");

			stepOne = sinon.spy((parentConan, context, stepDone) => {
				stepDone(stepError);
			});

			stepOneParameters = {"apiName": "test-dev"};
			steps.add(stepOne, stepOneParameters);
		});

		it("should return the step error to the final callback so the user knows why the proccess failed", done => {
			steps.start((error)=> {
				error.should.eql(stepError);
				done();
			});
		});
	});

	describe("(Temp Directory)", () => {
		it("should create the temp directory", done => {
			const stepThree = sinon.spy((parentConan, context, stepDone) => {
				fs.existsSync(context.temporaryDirectoryPath).should.be.true;
				stepDone();
			});
			steps.add(stepThree, {});
			steps.start(() => {
				done();
			});
		});

		// it("should track and remove all temp files after all steps have finished", done => {
		// 	fs.exists(temporaryFilePath, tempfileExists => {
		// 		tempfileExists.should.be.false;
		// 		done();
		// 	});
		// });
	});
});
