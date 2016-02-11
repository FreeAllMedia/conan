"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _conan = require("../../../../conan.js");

var _conan2 = _interopRequireDefault(_conan);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

var _createApiStageStep = require("../../steps/createApiStageStep.js");

var _createApiStageStep2 = _interopRequireDefault(_createApiStageStep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

describe("createApiStageStep", function () {
	var createDeploymentSpy = undefined,
	    constructorSpy = undefined,
	    conan = undefined,
	    context = undefined,
	    parameters = undefined,
	    restApiId = undefined,
	    should = undefined;

	var APIGateway = function () {
		function APIGateway(constructorParameters) {
			_classCallCheck(this, APIGateway);

			constructorSpy(constructorParameters);
		}

		_createClass(APIGateway, [{
			key: "createDeployment",
			value: function createDeployment(params, callback) {
				createDeploymentSpy(params, callback);
			}
		}]);

		return APIGateway;
	}();

	beforeEach(function () {
		conan = new _conan2.default({
			region: "us-east-1"
		});

		constructorSpy = _sinon2.default.spy();
		createDeploymentSpy = _sinon2.default.spy(function (params, callback) {
			callback();
		});
		should = _chai2.default.should();

		parameters = new (function () {
			function MockConanAwsParameters() {
				_classCallCheck(this, MockConanAwsParameters);
			}

			_createClass(MockConanAwsParameters, [{
				key: "name",
				value: function name() {
					return "testStage";
				}
			}, {
				key: "description",
				value: function description() {
					return "testStage description";
				}
			}]);

			return MockConanAwsParameters;
		}())();

		restApiId = "23sysh";

		context = {
			parameters: parameters,
			results: {
				restApiId: restApiId
			},
			libraries: {
				AWS: {
					APIGateway: APIGateway
				}
			}
		};
	});

	it("should be a function", function () {
		(typeof _createApiStageStep2.default === "undefined" ? "undefined" : _typeof(_createApiStageStep2.default)).should.equal("function");
	});

	describe("(parameters)", function () {
		beforeEach(function (done) {
			(0, _createApiStageStep2.default)(conan, context, function () {
				done();
			});
		});

		it("should send the appropiate parameters to the AWS call", function () {
			createDeploymentSpy.firstCall.args[0].should.eql({
				restApiId: restApiId,
				stageName: "testStage",
				description: "conan deployment for stage creation",
				stageDescription: "testStage description"
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
			createDeploymentSpy = _sinon2.default.spy();
		});

		it("should skip the function call entirely", function (done) {
			(0, _createApiStageStep2.default)(conan, context, function () {
				createDeploymentSpy.called.should.be.false;
				done();
			});
		});
	});

	describe("(stage created)", function () {
		var responseData = undefined;

		beforeEach(function () {
			responseData = { name: "testStage", id: 2 };
			createDeploymentSpy = _sinon2.default.spy(function (params, callback) {
				callback(null, responseData);
			});
		});

		it("should return with no error for that stage", function (done) {
			(0, _createApiStageStep2.default)(conan, context, function (error) {
				should.not.exist(error);
				done();
			});
		});

		it("should return the deployment id", function (done) {
			(0, _createApiStageStep2.default)(conan, context, function (error, result) {
				result.deploymentId.should.equal(responseData.id);
				done();
			});
		});

		it("should return the stage name", function (done) {
			(0, _createApiStageStep2.default)(conan, context, function (error, result) {
				result.stageName.should.equal(parameters.name());
				done();
			});
		});
	});

	describe("(unknown error)", function () {
		beforeEach(function () {
			createDeploymentSpy = _sinon2.default.spy(function (params, callback) {
				callback({ statusCode: 401 });
			});
		});

		it("should return error", function (done) {
			(0, _createApiStageStep2.default)(conan, context, function (error) {
				should.exist(error);
				done();
			});
		});
	});
});