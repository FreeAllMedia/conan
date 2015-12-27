// import Conan from "../../../../conan.js";
// import upsertLambdaStep from "../../steps/upsertLambdaStep.js";
// import sinon from "sinon";
//
// describe(".upsertLambdaStep(conan, context, stepDone)", () => {
// 	let conan,
// 			context,
// 			stepDone,
//
// 			awsResponseError,
// 			awsResponseData,
// 			stepReturnError,
// 			stepReturnData;
//
// 	const mockLambda = {
// 		getFunction: sinon.spy((params, callback) => {
// 			callback(awsResponseError, awsResponseData);
// 		})
// 	};
//
// 	const MockAWS = {
// 		Lambda: sinon.spy(() => {
// 			return mockLambda;
// 		})
// 	};
//
// 	beforeEach(done => {
// 		conan = new Conan({
// 			region: "us-east-1"
// 		});
//
// 		context = {
// 			parameters: {
// 				name: "Conan"
// 			},
// 			dependencies: { AWS: MockAWS },
// 			results: {}
// 		};
//
// 		// "Lambda Found" response by default
// 		awsResponseData = var params = {
// 		  Code: { /* required */
// 		    S3Bucket: 'STRING_VALUE',
// 		    S3Key: 'STRING_VALUE',
// 		    S3ObjectVersion: 'STRING_VALUE',
// 		    ZipFile: new Buffer('...') || 'STRING_VALUE'
// 		  },
// 		  FunctionName: 'STRING_VALUE', /* required */
// 		  Handler: 'STRING_VALUE', /* required */
// 		  Role: 'STRING_VALUE', /* required */
// 		  Runtime: 'nodejs | java8 | python2.7', /* required */
// 		  Description: 'STRING_VALUE',
// 		  MemorySize: 0,
// 		  Publish: true || false,
// 		  Timeout: 0
// 		};
// 		awsResponseError = null;
//
// 		stepDone = (afterStepCallback) => {
// 			return (error, data) => {
// 				stepReturnError = error;
// 				stepReturnData = data;
// 				afterStepCallback();
// 			};
// 		};
//
// 		upsertLambdaStep(conan, context, stepDone(done));
// 	});
//
// 	it("should be a function", () => {
// 		(typeof upsertLambdaStep).should.equal("function");
// 	});
//
// 	it("should set the designated region on the lambda client", () => {
// 		MockAWS.Lambda.calledWith({
// 			region: conan.config.region
// 		}).should.be.true;
// 	});
//
// 	describe("(Lambda ID is provided)", () => {
//
// 	});
//
// 	describe("(Lambda ID is NOT provided)", () => {
//
// 	});
//
// 	//
// 	// describe("(Lambda is Found)", () => {
// 	// 	it("should return the found lambda id", () => {
// 	// 		stepReturnData.should.eql({
// 	// 			lambda: {
// 	// 				id: awsResponseData.Configuration.FunctionArn
// 	// 			}
// 	// 		});
// 	// 	});
// 	// });
// 	//
// 	// describe("(Lambda is not Found)", () => {
// 	// 	beforeEach(done => {
// 	// 		awsResponseError = { statusCode: 404 };
// 	// 		upsertLambdaStep(conan, context, stepDone(done));
// 	// 	});
// 	//
// 	// 	it("should return the lambda id as null", () => {
// 	// 		const expectedData = { lambda: {	id: null } };
// 	// 		stepReturnData.should.eql(expectedData);
// 	// 	});
// 	// });
// 	//
// 	// describe("(Unknown Error is Returned)", () => {
// 	// 	let errorMessage;
// 	//
// 	// 	beforeEach(done => {
// 	// 		errorMessage = "AWS returned status code 401";
// 	// 		awsResponseError = { statusCode: 401, message: errorMessage };
// 	// 		upsertLambdaStep(conan, context, stepDone(done));
// 	// 	});
// 	//
// 	// 	it("should return an error which stops the step runner", () => {
// 	// 		stepReturnError.message.should.eql(errorMessage);
// 	// 	});
// 	// });
// });
