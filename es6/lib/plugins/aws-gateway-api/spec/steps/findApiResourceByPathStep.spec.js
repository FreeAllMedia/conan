import Conan from "../../../../conan.js";
import sinon from "sinon";
import chai from "chai";
import findApiResourceByPathStep from "../../steps/findApiResourceByPathStep.js";

describe("findApiResourceByPathStep", () => {
	let getResourcesSpy,
		constructorSpy,
		conan,
		context,
		parameters,
		restApiId,
		should;

	class APIGateway {
		constructor(constructorParameters) {
			constructorSpy(constructorParameters);
		}

		getResources(params, callback) {
			getResourcesSpy(params, callback);
		}
	}

	beforeEach(() => {
		conan = new Conan({
			region: "us-east-1"
		});

		constructorSpy = sinon.spy();
		getResourcesSpy = sinon.spy((params, callback) => {
			callback();
		});
		should = chai.should();

		parameters = new class MockConanAwsParameters {
			path() { 				return "/testPath"; }
		}();

		restApiId = "23sysh";

		context = {
			parameters,
			results: {
				restApiId
			},
			libraries: {
				AWS: {
					APIGateway
				}
			}
		};
	});

	it("should be a function", () => {
		(typeof findApiResourceByPathStep).should.equal("function");
	});

	describe("(parameters)", () => {
		beforeEach(done => {
			findApiResourceByPathStep(conan, context, () => {
				done();
			});
		});

		it("should send the appropiate parameters to the AWS get function call", () => {
			getResourcesSpy.firstCall.args[0].should.eql({
				restApiId,
				limit: 500
			});
		});

		it("should throw if there is no restApiId in the previous steps results", done => {
			delete context.results.restApiId;
			findApiResourceByPathStep(conan, context, (error) => {
				error.should.eql(new Error("There is no api defined as a previous step or there was an error o that step."));
				done();
			});
		});

		it("should set the constructor parameters", () => {
			constructorSpy.firstCall.args[0].should.eql({
				region: conan.config.region
			});
		});
	});

	describe("(api resource full path found)", () => {
		let responseData;

		describe("(on a completely new path)", () => {
			beforeEach(() => {
				context.parameters = new class MockConanAwsParameters {
					path() { return "/accounts/items"; }
				}();

				responseData = {
					items: [
						{path: "/a/cool/resource"},
						{path: "/different/item"},
						{path: "/", id: "v6x4ma2fog"}
					]
				};
				getResourcesSpy = sinon.spy((params, callback) => {
					callback(null, responseData);
				});
			});

			it("should queue the missing resources", done => {
				findApiResourceByPathStep(conan, context, (error, result) => {
					result.newApiResources.should.eql(["accounts", "items"]);
					done();
				});
			});

			it("should use the right parent id as the root resource", done => {
				findApiResourceByPathStep(conan, context, (error, result) => {
					result.resourceParentId.should.equal("v6x4ma2fog");
					done();
				});
			});
		});

		describe("(when the resource leaf is missing)", () => {
			beforeEach(() => {
				context.parameters = new class MockConanAwsParameters {
					path() { return "/accounts/items"; }
				}();

				responseData = {
					items: [
						{path: "/a/cool/resource"},
						{path: "/different/item"},
						{path: "/accounts", id: "v6x4ma2sss"},
						{path: "/", id: "v6x4ma2fog"}
					]
				};

				getResourcesSpy = sinon.spy((params, callback) => {
					callback(null, responseData);
				});
			});

			it("should queue the missing resource", done => {
				findApiResourceByPathStep(conan, context, (error, result) => {
					result.newApiResources.should.eql(["items"]);
					done();
				});
			});

			it("should use the right parent id for the missing resource", done => {
				findApiResourceByPathStep(conan, context, (error, result) => {
					result.resourceParentId.should.equal("v6x4ma2sss");
					done();
				});
			});
		});

		describe("(when there is two or more missing resources)", () => {
			beforeEach(() => {
				context.parameters = new class MockConanAwsParameters {
					path() { return "/accounts/items/subItems"; }
				}();

				responseData = {
					items: [
						{path: "/a/cool/resource"},
						{path: "/different/item"},
						{path: "/accounts", id: "v6x4ma2sss"},
						{path: "/", id: "v6x4ma2fog"}
					]
				};

				getResourcesSpy = sinon.spy((params, callback) => {
					callback(null, responseData);
				});
			});

			it("should queue the missing resources", done => {
				findApiResourceByPathStep(conan, context, (error, result) => {
					result.newApiResources.should.eql(["items", "subItems"]);
					done();
				});
			});

			it("should use the right parent id for the first missing resource", done => {
				findApiResourceByPathStep(conan, context, (error, result) => {
					result.resourceParentId.should.equal("v6x4ma2sss");
					done();
				});
			});
		});

		describe("(on a existing path)", () => {
			beforeEach(() => {
				context.parameters = new class MockConanAwsParameters {
					path() { return "/accounts/items/subItems"; }
				}();

				responseData = {
					items: [
						{path: "/a/cool/resource"},
						{path: "/different/item"},
						{path: "/accounts", id: "v6x4ma2ss1", parentId: "v6x4ma2fog"},
						{path: "/accounts/items", id: "v6x4ma2ss2", parentId: "v6x4ma2ss1"},
						{path: "/accounts/items/subItems", id: "v6x4ma2ss3", parentId: "v6x4ma2ss2"},
						{path: "/", id: "v6x4ma2fog"}
					]
				};

				getResourcesSpy = sinon.spy((params, callback) => {
					callback(null, responseData);
				});
			});

			it("should return the existing resource id", done => {
				findApiResourceByPathStep(conan, context, (error, result) => {
					result.resourceId.should.equal("v6x4ma2ss3");
					done();
				});
			});

			it("should return the existing resource parent id", done => {
				findApiResourceByPathStep(conan, context, (error, result) => {
					result.resourceParentId.should.equal("v6x4ma2ss2");
					done();
				});
			});

			it("should return and empty resource queue to create", done => {
				findApiResourceByPathStep(conan, context, (error, result) => {
					result.newApiResources.should.eql([]);
					done();
				});
			});
		});
	});

	describe("(unknown error)", () => {
		beforeEach(() => {
			getResourcesSpy = sinon.spy((params, callback) => {
				callback({ statusCode: 401 });
			});
		});

		it("should return error", done => {
			findApiResourceByPathStep(conan, context, (error) => {
				should.exist(error);
				done();
			});
		});
	});
});
