"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _conan = require("../../../../conan.js");

var _conan2 = _interopRequireDefault(_conan);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

var _createApiResourcesStep = require("../../steps/createApiResourcesStep.js");

var _createApiResourcesStep2 = _interopRequireDefault(_createApiResourcesStep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

describe("createApiResourcesStep", function () {
	var createResourceSpy = undefined,
	    constructorSpy = undefined,
	    conan = undefined,
	    context = undefined,
	    parameters = undefined,
	    restApiId = undefined,
	    apiResourceParentId = undefined,
	    newApiResources = undefined,
	    should = undefined;

	var APIGateway = function () {
		function APIGateway(constructorParameters) {
			_classCallCheck(this, APIGateway);

			constructorSpy(constructorParameters);
		}

		_createClass(APIGateway, [{
			key: "createResource",
			value: function createResource(params, callback) {
				createResourceSpy(params, callback);
			}
		}]);

		return APIGateway;
	}();

	beforeEach(function () {
		conan = new _conan2.default({
			region: "us-east-1"
		});

		constructorSpy = _sinon2.default.spy();
		createResourceSpy = _sinon2.default.spy(function (params, callback) {
			callback();
		});
		should = _chai2.default.should();

		parameters = new function MockConanAwsParameters() {
			_classCallCheck(this, MockConanAwsParameters);
		}();

		restApiId = "23sysh";
		apiResourceParentId = "23sysh3";
		newApiResources = ["accounts"];

		context = {
			parameters: parameters,
			results: {
				restApiId: restApiId,
				apiResourceParentId: apiResourceParentId,
				newApiResources: newApiResources
			},
			libraries: {
				AWS: {
					APIGateway: APIGateway
				}
			}
		};
	});

	it("should be a function", function () {
		(typeof _createApiResourcesStep2.default === "undefined" ? "undefined" : _typeof(_createApiResourcesStep2.default)).should.equal("function");
	});

	describe("(parameters)", function () {
		beforeEach(function (done) {
			(0, _createApiResourcesStep2.default)(conan, context, function () {
				done();
			});
		});

		it("should send the appropiate parameters to the AWS call", function () {
			createResourceSpy.firstCall.args[0].should.eql({
				parentId: apiResourceParentId,
				pathPart: "accounts",
				restApiId: restApiId
			});
		});

		it("should set the constructor parameters", function () {
			constructorSpy.firstCall.args[0].should.eql({
				region: conan.config.region
			});
		});
	});

	describe("(rest api id is not present)", function () {
		beforeEach(function () {
			delete context.results.restApiId;
			createResourceSpy = _sinon2.default.spy();
		});

		it("should skip the function call entirely", function (done) {
			(0, _createApiResourcesStep2.default)(conan, context, function () {
				createResourceSpy.called.should.be.false;
				done();
			});
		});
	});

	describe("(api resource parent id is not present)", function () {
		beforeEach(function () {
			delete context.results.apiResourceParentId;
			createResourceSpy = _sinon2.default.spy();
		});

		it("should skip the function call entirely", function (done) {
			(0, _createApiResourcesStep2.default)(conan, context, function () {
				createResourceSpy.called.should.be.false;
				done();
			});
		});
	});

	describe("(new api resources is not an array)", function () {
		beforeEach(function () {
			delete context.results.newApiResources;
			createResourceSpy = _sinon2.default.spy();
		});

		it("should skip the function call entirely", function (done) {
			(0, _createApiResourcesStep2.default)(conan, context, function () {
				createResourceSpy.called.should.be.false;
				done();
			});
		});
	});

	describe("(everything good but no new api resources)", function () {
		beforeEach(function () {
			context.results.newApiResources = [];
			createResourceSpy = _sinon2.default.spy();
		});

		it("should skip the function call entirely", function (done) {
			(0, _createApiResourcesStep2.default)(conan, context, function () {
				createResourceSpy.called.should.be.false;
				done();
			});
		});

		it("should avoid deleting the api resource id for the resource found", function (done) {
			(0, _createApiResourcesStep2.default)(conan, context, function (error, results) {
				results.should.not.have.property("apiResourceId");
				done();
			});
		});
	});

	describe("(there are new api resources to create)", function () {
		var responseData = undefined;

		describe("(one new api resource)", function () {
			describe("(normal response)", function () {
				beforeEach(function () {
					responseData = { id: "sjhd72k" };
					createResourceSpy = _sinon2.default.spy(function (awsParameters, callback) {
						callback(null, responseData);
					});
				});

				it("should set the newly created api resource id", function (done) {
					(0, _createApiResourcesStep2.default)(conan, context, function (error, results) {
						results.apiResourceId.should.equal(responseData.id);
						done();
					});
				});
			});
		});

		describe("(two or more new api resources)", function () {
			var secondResponseData = undefined;
			var currentCall = undefined;

			describe("(normal response)", function () {
				beforeEach(function () {
					context.results.newApiResources.push("items");

					responseData = { id: "sjhd72k" };
					secondResponseData = { id: "zksd872" };
					currentCall = 0;

					createResourceSpy = _sinon2.default.spy(function (awsParameters, callback) {
						var currentResponse = undefined;
						if (currentCall === 0) {
							currentResponse = responseData;
							currentCall++;
						} else {
							currentResponse = secondResponseData;
						}
						callback(null, currentResponse);
					});
				});

				it("should set the result id for the leaf - api resource", function (done) {
					(0, _createApiResourcesStep2.default)(conan, context, function (error, results) {
						results.apiResourceId.should.equal(secondResponseData.id);
						done();
					});
				});

				it("should use the parent id from the previous resource on the next one", function (done) {
					(0, _createApiResourcesStep2.default)(conan, context, function () {
						createResourceSpy.secondCall.args[0].should.eql({
							parentId: "sjhd72k",
							pathPart: "items",
							restApiId: restApiId
						});
						done();
					});
				});
			});
		});
	});

	describe("(unknown error)", function () {
		beforeEach(function () {
			createResourceSpy = _sinon2.default.spy(function (params, callback) {
				callback({ statusCode: 401 });
			});
		});

		it("should return an error when is just one", function (done) {
			(0, _createApiResourcesStep2.default)(conan, context, function (error) {
				should.exist(error);
				done();
			});
		});

		it("should explicitly set tu null the api resource id", function (done) {
			(0, _createApiResourcesStep2.default)(conan, context, function (error, result) {
				(result.apiResourceId === null).should.be.true;
				done();
			});
		});
	});
});