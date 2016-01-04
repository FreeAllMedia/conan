import Conan from "../../../../conan.js";
import upsertApiStep from "../../steps/upsertApiStep.js";
import sinon from "sinon";
import fileSystem from "fs";
import temp from "temp";
import path from "path";
import inflect from "jargon";

temp.track();

describe(".upsertApiStep(conan, context, stepDone)", () => {
	let conan,
			context,
			stepDone,

			createRestApiError,
			createRestApiData,

			updateApiCodeError,
			updateApiCodeData,

			updateRestApiError,
			updateRestApiData,

			stepReturnError,
			stepReturnData,

			parameters,
			apiZipFilePath,
			apiFilePath,

			roleArn,
			apiArn,

			mockApiSpy,

			createRestApiParameters;

	const mockApi = {
		createRestApi: sinon.spy((params, callback) => {
			createRestApiParameters = params;
			callback(createRestApiError, createRestApiData);
		}),
		updateRestApi: sinon.spy((params, callback) => {
			callback(updateRestApiError, updateRestApiData);
		})
	};

	class MockApi {
		constructor(config) {
			mockApiSpy(config);
			return mockApi;
		}
	}

	const MockAWS = {
		Api: MockApi
	};

	beforeEach(done => {
		conan = new Conan({
			region: "us-east-1"
		});

		apiArn = "arn:aws:api:us-east-1:123895237541:function:SomeApi";
		roleArn = "arn:aws:api:us-east-1:123895237541:role:SomeRole";

		apiFilePath = __dirname + "/fixtures/api.js";
		apiZipFilePath = __dirname + "/fixtures/api.zip";

		const mockConanAwsApi = new class MockConanAwsApi {
			name() { 				return "API v1"; }
		}();

		context = {
			parameters: mockConanAwsApi,
			libraries: { AWS: MockAWS }
		};

		updateRestApiData = {
			ApiArn: apiArn
		};
		updateRestApiError = null;

		createRestApiData = {
			ApiArn: apiArn
		};
		createRestApiError = null;

		mockApiSpy = sinon.spy();

		stepDone = (afterStepCallback) => {
			return (error, data) => {
				stepReturnError = error;
				stepReturnData = data;
				afterStepCallback();
			};
		};

		upsertApiStep(conan, context, stepDone(done));
	});

	afterEach(done => {
		temp.cleanup(done);
	});

	it("should be a function", () => {
		(typeof upsertApiStep).should.equal("function");
	});

	it("should set the designated region on the api client", () => {
		mockApiSpy.calledWith({
			region: conan.config.region
		}).should.be.true;
	});

	describe("(When Api is NOT New)", () => {
		it("should call AWS to update the api configuration with the designated parameters", () => {
			const fileName = path.parse(parameters.filePath()).name;
			const handlerString = `${fileName}.${parameters.handler()}`;

			const updateConfigurationParameters = {
				ApiName: parameters.name(),
				Handler: handlerString,
				Role: roleArn,
				Description: parameters.description(),
				MemorySize: parameters.memorySize(),
				Timeout: parameters.timeout()
			};
			mockApi.updateRestApi.firstCall.args[0].should.eql(updateConfigurationParameters);
		});

		it("should call AWS to update the api with the designated code", () => {
			const updateCodeParameters = {
				ZipFile: fileSystem.readFileSync(apiZipFilePath),
				ApiName: parameters.name(),
				Publish: parameters.publish()
			};
			mockApi.updateApiCode.firstCall.args[0].should.eql(updateCodeParameters);
		});

		describe("(Api is Updated)", () => {
			beforeEach(done => {
				updateRestApiData = {
					ApiArn: createRestApiData.ApiArn
				};
				upsertApiStep(conan, context, stepDone(done));
			});

			it("should return the api Amazon Resource Name", () => {
				stepReturnData.should.eql({
					apiArn: updateRestApiData.ApiArn
				});
			});
		});

		describe("(Api Code is NOT Updated)", () => {
			beforeEach(() => {
				updateApiCodeError = new Error();
				updateApiCodeError.statusCode = 400;
			});

			it("should throw an error", () => {
				() => {
					upsertApiStep(conan, context);
				}.should.throw();
			});
		});

		describe("(Api Configuration is NOT Updated)", () => {
			beforeEach(() => {
				updateRestApiError = new Error();
				updateRestApiError.statusCode = 400;
			});

			it("should throw an error", () => {
				() => {
					upsertApiStep(conan, context);
				}.should.throw();
			});
		});
	});

	describe("(When Api is New)", () => {
		beforeEach(done => {
			context.results.apiArn = null;
			upsertApiStep(conan, context, stepDone(done));
		});

		it("should call AWS with the designated api parameters", () => {
			const expectedCreateApiParameters = {
				ApiName: parameters.name(),
				Handler: parameters.handler(),
				Role: roleArn,
				Description: parameters.description(),
				MemorySize: parameters.memorySize(),
				Timeout: parameters.timeout(),
				Runtime: "nodejs"
			};

			delete createRestApiParameters.Code;

			createRestApiParameters.should.deep.equal(expectedCreateApiParameters);
		});

		it("should call AWS with the designated api code", () => {
			const expectedCodeBuffer = fileSystem.readFileSync(__dirname + "/fixtures/api.zip");

			const codeBuffer = createRestApiParameters.Code.ZipFile;

			codeBuffer.should.deep.equal(expectedCodeBuffer);
		});

		describe("(Api is Created)", () => {
			it("should return the api Amazon Resource Name", () => {
				stepReturnData.should.eql({
					apiArn: createRestApiData.ApiArn
				});
			});
		});

		describe("(Api is NOT Created)", () => {
			beforeEach(() => {
				createRestApiError = new Error();
				createRestApiError.statusCode = 400;
			});

			it("should throw an error", () => {
				() => {
					upsertApiStep(conan, context);
				}.should.throw();
			});
		});

	});
});
