import Conan from "../../../../conan.js";
import sinon from "sinon";
import chai from "chai";
import createApiResourcesStep from "../../steps/createApiResourcesStep.js";

describe("createApiResourcesStep", () => {
	let createResourceSpy,
		constructorSpy,
		conan,
		context,
		parameters,
		restApiId,
		apiResourceParentId,
		newApiResources,
		should;

	class APIGateway {
		constructor(constructorParameters) {
			constructorSpy(constructorParameters);
		}

		createResource(params, callback) {
			createResourceSpy(params, callback);
		}
	}

	beforeEach(() => {
		conan = new Conan({
			region: "us-east-1"
		});

		constructorSpy = sinon.spy();
		createResourceSpy = sinon.spy((params, callback) => {
			callback();
		});
		should = chai.should();

		parameters = new class MockConanAwsParameters {
		}();

		restApiId = "23sysh";
		apiResourceParentId = "23sysh3";
		newApiResources = ["accounts"];

		context = {
			parameters,
			results: {
				restApiId,
				apiResourceParentId,
				newApiResources
			},
			libraries: {
				AWS: {
					APIGateway
				}
			}
		};
	});

	it("should be a function", () => {
		(typeof createApiResourcesStep).should.equal("function");
	});

	describe("(parameters)", () => {
		beforeEach(done => {
			createApiResourcesStep(conan, context, () => {
				done();
			});
		});

		it("should send the appropiate parameters to the AWS create deployment call", () => {
			createResourceSpy.firstCall.args[0].should.eql({
				parentId: apiResourceParentId,
				pathPart: "accounts",
				restApiId
			});
		});

		it("should set the constructor parameters", () => {
			constructorSpy.firstCall.args[0].should.eql({
				region: conan.config.region
			});
		});
	});

	describe("(rest api id is not present)", () => {
		beforeEach(() => {
			delete context.results.restApiId;
			createResourceSpy = sinon.spy();
		});

		it("should skip the function call entirely", done => {
			createApiResourcesStep(conan, context, () => {
				createResourceSpy.called.should.be.false;
				done();
			});
		});
	});

	describe("(api resource parent id is not present)", () => {
		beforeEach(() => {
			delete context.results.apiResourceParentId;
			createResourceSpy = sinon.spy();
		});

		it("should skip the function call entirely", done => {
			createApiResourcesStep(conan, context, () => {
				createResourceSpy.called.should.be.false;
				done();
			});
		});
	});

	describe("(new api resources is not an array)", () => {
		beforeEach(() => {
			delete context.results.newApiResources;
			createResourceSpy = sinon.spy();
		});

		it("should skip the function call entirely", done => {
			createApiResourcesStep(conan, context, () => {
				createResourceSpy.called.should.be.false;
				done();
			});
		});
	});

	describe("(everything good but no new api resources)", () => {
		beforeEach(() => {
			context.results.newApiResources = [];
			createResourceSpy = sinon.spy();
		});

		it("should skip the function call entirely", done => {
			createApiResourcesStep(conan, context, () => {
				createResourceSpy.called.should.be.false;
				done();
			});
		});
	});

	describe("(there are new api resources to create)", () => {
		let responseData;

		describe("(one new api resource)", () => {
			describe("(normal response)", () => {
				beforeEach(() => {
					responseData = { id: "sjhd72k" };
					createResourceSpy = sinon.spy((awsParameters, callback) => {
						callback(null, responseData);
					});
				});

				it("should set the newly created api resource id", done => {
					createApiResourcesStep(conan, context, (error, results) => {
						results.apiResourceId.should.equal(responseData.id);
						done();
					});
				});
			});
		});

		describe("(two or more new api resources)", () => {
			let secondResponseData;
			let currentCall;

			describe("(normal response)", () => {
				beforeEach(() => {
					context.results.newApiResources.push("items");

					responseData = { id: "sjhd72k" };
					secondResponseData = { id: "zksd872" };
					currentCall = 0;

					createResourceSpy = sinon.spy((awsParameters, callback) => {
						let currentResponse;
						if(currentCall === 0) {
							currentResponse = responseData;
							currentCall++;
						} else {
							currentResponse = secondResponseData;
						}
						callback(null, currentResponse);
					});
				});

				it("should set the result id for the leaf - api resource", done => {
					createApiResourcesStep(conan, context, (error, results) => {
						results.apiResourceId.should.equal(secondResponseData.id);
						done();
					});
				});

				it("should use the parent id from the previous resource on the next one", done => {
					createApiResourcesStep(conan, context, () => {
						createResourceSpy.secondCall.args[0].should.eql({
							parentId: "sjhd72k",
							pathPart: "items",
							restApiId
						});
						done();
					});
				});
			});
		});
	});

	describe("(unknown error)", () => {
		beforeEach(() => {
			createResourceSpy = sinon.spy((params, callback) => {
				callback({ statusCode: 401 });
			});
		});

		it("should return an error when is just one", done => {
			createApiResourcesStep(conan, context, (error) => {
				should.exist(error);
				done();
			});
		});

		it("should explicitly set tu null the api resource id", done => {
			createApiResourcesStep(conan, context, (error, result) => {
				(result.apiResourceId === null).should.be.true;
				done();
			});
		});
	});
});
