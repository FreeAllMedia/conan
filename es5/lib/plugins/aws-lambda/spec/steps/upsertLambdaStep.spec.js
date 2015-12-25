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
// 	const lambdaClient = {
// 		getFunction: sinon.spy((params, callback) => {
// 			callback(awsError, awsData);
// 		})
// 	};
//
// 	const AWS = {
// 		Lambda: sinon.spy(() => {
// 			return lambdaClient;
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
// 			"FunctionName": "SomeFunction",
// 			"Description": "This is some function. It does things.",
// 			"Handler": "/some/function.handler",
// 			"MemorySize": "128",
// 			"Role": ,
// 			"Timeout": context.parameters.timeout
// 		};
//
// 		context = {
// 			parameters: stepParameters,
// 			dependencies: { AWS: AWS },
// 			results: {
// 				lambda: {
// 					id: "arn:aws:lambda:us-east-1:166191841105:function:SomeLambda"
// 				}
// 			}
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
// 	describe("(Lambda is Found)", () => {
// 		beforeEach(done => {
// 			awsData = {
// 				Configuration: {
// 					FunctionArn: "arn:aws:lambda:us-east-1:166191841105:function:SomeLambda"
// 				}, Code: {}
// 			};
//
// 			upsertLambdaStep(conan, context, (error, data) => {
// 				stepReturnData = data;
// 				done();
// 			});
// 		});
//
// 		it("should set the designated region on the lambda client", () => {
// 			AWS.Lambda.calledWith({
// 				region: conanConfig.region
// 			}).should.be.true;
// 		});
//
// 		it("should call AWS with the designated function name parameter", () => {
// 			lambdaClient.getFunction.calledWith({
// 				FunctionName: stepParameters.name
// 			}).should.be.true;
// 		});
//
// 		it("should return the found lambda id", () => {
// 			stepReturnData.should.eql({
// 				lambda: {
// 					id: awsData.Configuration.FunctionArn
// 				}
// 			});
// 		});
// 	});
//
// 	describe("(Lambda is not Found)", () => {
// 		beforeEach(done => {
// 			awsError = { statusCode: 404 };
// 			upsertLambdaStep(conan, context, (error, data) => {
// 				stepReturnData = data;
// 				done();
// 			});
// 		});
//
// 		it("should return the lambda id as null", () => {
// 			stepReturnData.should.eql({
// 				lambda: {
// 					id: null
// 				}
// 			});
// 		});
// 	});
//
// 	describe("(Unknown Error is Returned)", () => {
// 		it("should return an error which stops the step runner", done => {
// 			const errorMessage = "AWS returned status code 401";
// 			awsError = { statusCode: 401, message: errorMessage };
// 			upsertLambdaStep(conan, context, (error) => {
// 				error.message.should.eql(errorMessage);
// 				done();
// 			});
// 		});
// 	});
// });