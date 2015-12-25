import Conan from "../../../../conan.js";
import findLambdaByNameStep from "../../steps/findLambdaByNameStep.js";
import sinon from "sinon";

describe(".findLambdaByNameStep(event, context, stepDone)", () => {
	let conan,
			conanConfig,
			stepParameters,
			awsError,
			awsData,
			stepReturnData,
			context;

	const lambdaClient = {
		getFunction: sinon.spy((params, callback) => {
			callback(awsError, awsData);
		})
	};

	function newLambdaClient() {
		return lambdaClient;
	}

	const AWS = {
		Lambda: sinon.spy(newLambdaClient)
	};

	beforeEach(done => {
		awsError = null;
		awsData = {
			Configuration: {
				FunctionArn: "arn:aws:lambda:us-east-1:166191841105:function:SomeLambda"
			}, Code: {}
		};

		conanConfig = {
			region: "us-east-1"
		};
		conan = new Conan(conanConfig);

		stepParameters = {
			name: "SomeLambda"
		};

		context = {
			parameters: stepParameters,
			dependencies: { AWS: AWS },
			results: {}
		};

		findLambdaByNameStep(conan, context, (error, data) => {
			stepReturnData = data;
			done();
		});
	});

	it("should be a function", () => {
		(typeof findLambdaByNameStep).should.equal("function");
	});

	it("should set the designated region on the lambda client", () => {
		AWS.Lambda.calledWith({
			region: conanConfig.region
		}).should.be.true;
	});

	it("should call AWS with the designated function name parameter", () => {
		lambdaClient.getFunction.calledWith({
			FunctionName: stepParameters.name
		}).should.be.true;
	});

	describe("(Lambda is Found)", () => {
		beforeEach(done => {
			findLambdaByNameStep(conan, context, (error, data) => {
				stepReturnData = data;
				done();
			});
		});

		it("should return the found lambda id", () => {
			stepReturnData.should.eql({
				lambda: {
					id: awsData.Configuration.FunctionArn
				}
			});
		});
	});

	describe("(Lambda is not Found)", () => {
		beforeEach(done => {
			awsError = { statusCode: 404 };
			findLambdaByNameStep(conan, context, (error, data) => {
				stepReturnData = data;
				done();
			});
		});

		it("should return the lambda id as null", () => {
			stepReturnData.should.eql({
				lambda: {
					id: null
				}
			});
		});
	});

	describe("(Unknown Error is Returned)", () => {
		it("should return an error which stops the step runner", done => {
			const errorMessage = "AWS returned status code 401";
			awsError = { statusCode: 401, message: errorMessage };
			findLambdaByNameStep(conan, context, (error) => {
				error.message.should.eql(errorMessage);
				done();
			});
		});
	});
});
