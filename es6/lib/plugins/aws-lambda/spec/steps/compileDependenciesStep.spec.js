import Conan from "../../../../conan.js";
import compileDependenciesStep from "../../steps/compileDependenciesStep.js";
import sinon from "sinon";

describe(".compileDependenciesStep(conan, context, stepDone)", () => {
	let conan,
			context,
			stepDone,

			lambdaResponseError,
			lambdaResponseData,

			s3ResponseError,
			s3ResponseData,

			stepReturnError,
			stepReturnData,

			payload;

	const mockLambda = {
		invoke: sinon.spy((params, callback) => {
			callback(lambdaResponseError, lambdaResponseData);
		})
	};

	const mockGetObjectStream = {};

	const mockS3 = {
		getObject: sinon.spy((params) => {
			return mockGetObjectStream;
		})
	};

	const MockAWS = {
		S3: sinon.spy(() => {
			return mockS3;
		}),
		Lambda: sinon.spy(() => {
			return mockLambda;
		})
	};

	beforeEach(done => {
		conan = new Conan({
			region: "us-east-1"
		});

		payload = {
			packages: { "dovima": "^1.0.0" },
			bucket: "some-bucket-here",
			key: "something.zip"
		};

		context = {
			parameters: payload,
			dependencies: { AWS: MockAWS },
			results: {}
		};

		// "Lambda Found" response by default
		lambdaResponseData = {};
		lambdaResponseError = null;

		stepDone = (afterStepCallback) => {
			return (error, data) => {
				stepReturnError = error;
				stepReturnData = data;
				afterStepCallback();
			};
		};

		compileDependenciesStep(conan, context, stepDone(done));
	});

	it("should be a function", () => {
		(typeof compileDependenciesStep).should.equal("function");
	});

	it("should set the designated region on the lambda client", () => {
		MockAWS.Lambda.calledWith({
			region: conan.config.region
		}).should.be.true;
	});

	it("should set the designated region on the s3 client", () => {
		MockAWS.S3.calledWith({
			region: conan.config.region
		}).should.be.true;
	});

	it("should call AWS with the designated lambda parameters", () => {
		mockLambda.invoke.firstCall.args[0].should.eql({
			FunctionName: "Thaumaturgy",
			InvocationType: "RequestResponse",
			LogType: "Tail",
			Payload: JSON.stringify(payload)
		});
	});

	it("should call AWS with the designated S3 parameters", () => {
		mockS3.getObject.firstCall.args[0].should.eql({
			Bucket: payload.bucket,
			Key: payload.key
		});
	});

	it("should return the dependency zip files read stream", () => {
		stepReturnData.should.eql({
			dependencyZipStream: mockGetObjectStream
		});
	})
});
