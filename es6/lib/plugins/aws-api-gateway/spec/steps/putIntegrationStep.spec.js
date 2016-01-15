import Conan from "../../../../conan.js";
import sinon from "sinon";
import chai from "chai";
import putIntegrationStep from "../../steps/putIntegrationStep.js";

describe("putIntegrationStep", () => {
	let putIntegrationSpy,
		constructorSpy,
		conan,
		context,
		parameters,
		restApiId,
		apiResourceId,
		lambdaArn,
		uri,
		requestTemplates,
		should;

	class APIGateway {
		constructor(constructorParameters) {
			constructorSpy(constructorParameters);
		}

		putIntegration(params, callback) {
			putIntegrationSpy(params, callback);
		}
	}

	beforeEach(() => {
		conan = new Conan({
			region: "us-east-1"
		});

		constructorSpy = sinon.spy();
		putIntegrationSpy = sinon.spy((params, callback) => {
			callback();
		});
		should = chai.should();

		parameters = new class MockConanAwsParameters {
			method() { return "GET"; }
			path() { return "/account/items"; }
			headers() { return []; }
			queryStrings() { return []; }
		}();


		// uri according to aws docs
		// arn:aws:apigateway:{region}:{service}:{path|action}/{service_api}

		restApiId = "23sysh";
		apiResourceId = "23sysh3";
		lambdaArn = "arn:aws:lambda:us-east-1:166191849902:function:accounts";
		uri = `arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/${lambdaArn}/invocations`;

		requestTemplates = {"application/json": "{\n  \"params\": {\n \"header\": {\n},\n \"queryString\": {\n},\n \"path\": {\n}},\n \"data\": $input.json('$')\n}"};

		context = {
			parameters,
			results: {
				restApiId,
				apiResourceId,
				lambdaArn
			},
			libraries: {
				AWS: {
					APIGateway
				}
			}
		};
	});

	it("should be a function", () => {
		(typeof putIntegrationStep).should.equal("function");
	});

	describe("(parameter mapping)", () => {
		describe("(header)", () => {
			beforeEach(done => {
				context.parameters = new class MockConanAwsParameters {
					path() { return "/accounts/items"; }
					method() { return "GET"; }
					headers() { return ["Access-Token"]; }
					queryStrings() { return []; }
				}();
				requestTemplates = {"application/json": "{\n  \"params\": {\n \"header\": {\n\"accessToken\": \"$input.params('Access-Token')\"\n},\n \"queryString\": {\n},\n \"path\": {\n}},\n \"data\": $input.json('$')\n}"};
				putIntegrationStep(conan, context, () => {
					done();
				});
			});

			it("should map the header parameters", () => {
				putIntegrationSpy.firstCall.args[0].requestTemplates.should.eql(requestTemplates);
			});
		});

		describe("(queryStrings)", () => {
			beforeEach(done => {
				context.parameters = new class MockConanAwsParameters {
					method() { return "GET"; }
					path() { return "/accounts/items"; }
					headers() { return []; }
					queryStrings() { return ["pageSize"]; }
				}();
				requestTemplates = {"application/json": "{\n  \"params\": {\n \"header\": {\n},\n \"queryString\": {\n\"pageSize\": \"$input.params('pageSize')\"\n},\n \"path\": {\n}},\n \"data\": $input.json('$')\n}"};
				putIntegrationStep(conan, context, () => {
					done();
				});
			});

			it("should map the header parameters", () => {
				putIntegrationSpy.firstCall.args[0].requestTemplates.should.eql(requestTemplates);
			});
		});

		describe("(path)", () => {
			beforeEach(done => {
				context.parameters = new class MockConanAwsParameters {
					method() { return "GET"; }
					path() { return "/account/{id}"; }
					headers() { return []; }
					queryStrings() { return []; }
				}();
				requestTemplates = {"application/json": "{\n  \"params\": {\n \"header\": {\n},\n \"queryString\": {\n},\n \"path\": {\n\"id\": \"$input.params('id')\"\n}},\n \"data\": $input.json('$')\n}"};
				putIntegrationStep(conan, context, () => {
					done();
				});
			});

			it("should map the header parameters", () => {
				putIntegrationSpy.firstCall.args[0].requestTemplates.should.eql(requestTemplates);
			});
		});
	});

	describe("(parameters)", () => {
		beforeEach(done => {
			putIntegrationStep(conan, context, () => {
				done();
			});
		});

		it("should send the appropiate parameters to the AWS call", () => {
			putIntegrationSpy.firstCall.args[0].should.eql({
				resourceId: apiResourceId,
				httpMethod: parameters.method(),
				type: "AWS",
				integrationHttpMethod: "POST",
				uri,
				requestTemplates,
				restApiId
			});
		});

		it("should set the constructor parameters", () => {
			constructorSpy.firstCall.args[0].should.eql({
				region: conan.config.region
			});
		});
	});

	describe("(resource method created)", () => {
		let responseData;

		beforeEach(() => {
			responseData = {};
			putIntegrationSpy = sinon.spy((awsParameters, callback) => {
				callback(null, responseData);
			});
		});

		it("should return with no error", done => {
			putIntegrationStep(conan, context, (error) => {
				should.not.exist(error);
				done();
			});
		});
	});

	describe("(rest api id is not present)", () => {
		beforeEach(() => {
			delete context.results.restApiId;
			putIntegrationSpy = sinon.spy();
		});

		it("should skip the function call entirely", done => {
			putIntegrationStep(conan, context, () => {
				putIntegrationSpy.called.should.be.false;
				done();
			});
		});
	});

	describe("(api resource id is not present)", () => {
		beforeEach(() => {
			delete context.results.apiResourceId;
			putIntegrationSpy = sinon.spy();
		});

		it("should skip the function call entirely", done => {
			putIntegrationStep(conan, context, () => {
				putIntegrationSpy.called.should.be.false;
				done();
			});
		});
	});

	describe("(lambda arn is not present)", () => {
		beforeEach(() => {
			delete context.results.lambdaArn;
			requestTemplates = {"application/json": "{\"statusCode\": 200}"};
		});

		it("should put a mock integration", done => {
			putIntegrationStep(conan, context, () => {
				putIntegrationSpy.firstCall.args[0].should.eql({
					resourceId: apiResourceId,
					httpMethod: parameters.method(),
					type: "MOCK",
					integrationHttpMethod: "POST",
					requestTemplates,
					restApiId
				});
				done();
			});
		});
	});

	describe("(unknown error)", () => {
		beforeEach(() => {
			putIntegrationSpy = sinon.spy((params, callback) => {
				callback({ statusCode: 401 });
			});
		});

		it("should return an error when is just one", done => {
			putIntegrationStep(conan, context, (error) => {
				should.exist(error);
				done();
			});
		});
	});
});
