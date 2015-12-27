"use strict";

// import Conan from "../../../../conan.js";
// import upsertLambdaStep from "../../steps/upsertLambdaStep.js";
// import sinon from "sinon";
//
// describe(".upsertLambdaStep(event, context, stepDone)", () => {
// 	let conan,
// 			conanConfig,
// 			stepParameters,
// 			awsError,
// 			awsData,
// 			stepReturnData,
// 			context;
//
// 	const lambda = {
// 		getRole: sinon.spy((params, callback) => {
// 			callback(awsError, awsData);
// 		})
// 	};
//
// 	const AWS = {
// 		Lambda: sinon.spy(() => {
// 			return lambda;
// 		})
// 	};
//
// 	beforeEach(() => {
// 		conanConfig = {
// 			region: "us-east-1"
// 		};
// 		conan = new Conan(conanConfig);
//
// 		stepParameters = {
// 			name: "Conan"
// 		};
//
// 		context = {
// 			parameters: stepParameters,
// 			dependencies: { AWS: AWS },
// 			results: {}
// 		};
//
// 		awsData = null;
// 		awsError = null;
// 	});
//
// 	it("should be a function", () => {
// 		(typeof upsertLambdaStep).should.equal("function");
// 	});
//
// 	describe("(Lambda ID is set)", () => {
// 		beforeEach(() => {
// 			stepParameters.lambda = { id: "arn:aws:lambda:us-east-1:123895237541:role:SomeRole"};
// 		});
//
// 		it("should update the Lambda configuration with the provided parameters");
// 	});
//
// 	describe("(Lambda ID is NOT set)", () => {
// 		beforeEach(() => {
// 			stepParameters.lambda = { id: null};
// 		});
//
// 		it("should create a new Lambda with the provided parameters");
// 	});
//
// 	describe("(Unknown Error is Returned)", () => {
// 		// it("should return an error which stops the step runner", done => {
// 		// 	const errorMessage = "AWS returned status code 401";
// 		// 	awsError = { statusCode: 401, message: errorMessage };
// 		// 	upsertLambdaStep(conan, context, (error) => {
// 		// 		error.message.should.eql(errorMessage);
// 		// 		done();
// 		// 	});
// 		// });
// 	});
// });