"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _conanJs = require("../../../../conan.js");

var _conanJs2 = _interopRequireDefault(_conanJs);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

var _stepsCreateStageStepJs = require("../../steps/createStageStep.js");

var _stepsCreateStageStepJs2 = _interopRequireDefault(_stepsCreateStageStepJs);

describe("createStageStep", function () {
	var createDeploymentSpy = undefined,
	    constructorSpy = undefined,
	    conan = undefined,
	    context = undefined,
	    parameters = undefined,
	    restApiId = undefined,
	    should = undefined;

	var APIGateway = (function () {
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
	})();

	beforeEach(function () {
		conan = new _conanJs2["default"]({
			region: "us-east-1"
		});

		constructorSpy = _sinon2["default"].spy();
		createDeploymentSpy = _sinon2["default"].spy(function (params, callback) {
			callback();
		});
		should = _chai2["default"].should();

		parameters = new ((function () {
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
		})())();

		restApiId = "23sysh";

		context = {
			parameters: parameters,
			results: {},
			libraries: {
				AWS: {
					APIGateway: APIGateway
				}
			}
		};
	});

	it("should be a function", function () {
		(typeof _stepsCreateStageStepJs2["default"]).should.equal("function");
	});

	describe("(parameters)", function () {
		beforeEach(function (done) {
			(0, _stepsCreateStageStepJs2["default"])(conan, context, function () {
				done();
			});
		});

		it("should send the appropiate parameters to the AWS get function call", function () {
			createDeploymentSpy.firstCall.args[0].should.eql({
				restApiId: 1,
				stageName: "testStage",
				stageDescription: "testStage description"
			});
		});

		it("should set the constructor parameters", function () {
			constructorSpy.firstCall.args[0].should.eql({
				region: conan.config.region
			});
		});
	});

	describe("(api id is not present)", function () {
		beforeEach(function () {
			delete context.results.restApiId;
			createDeploymentSpy = _sinon2["default"].spy();
		});

		it("should skip the function call entirely", function (done) {
			(0, _stepsCreateStageStepJs2["default"])(conan, context, function () {
				createDeploymentSpy.called.should.be["false"];
				done();
			});
		});
	});

	describe("(rest api id is present but stage already exists)", function () {
		beforeEach(function () {
			context.results = { restApiId: restApiId, stageName: "testStage" };
			createDeploymentSpy = _sinon2["default"].spy();
		});

		it("should skip the function call entirely", function (done) {
			(0, _stepsCreateStageStepJs2["default"])(conan, context, function () {
				createDeploymentSpy.called.should.be["false"];
				done();
			});
		});
	});

	describe("(stage created)", function () {
		var responseData = undefined;

		beforeEach(function () {
			responseData = { name: "testStage", id: 2 };
			createDeploymentSpy = _sinon2["default"].spy(function (params, callback) {
				callback(null, responseData);
			});
		});

		it("should return with no error for that stage", function (done) {
			(0, _stepsCreateStageStepJs2["default"])(conan, context, function (error) {
				should.not.exist(error);
				done();
			});
		});

		it("should return the id", function (done) {
			(0, _stepsCreateStageStepJs2["default"])(conan, context, function (error, result) {
				result.restApiId.should.equal(2);
				done();
			});
		});
	});

	describe("(unknown error)", function () {
		beforeEach(function () {
			createDeploymentSpy = _sinon2["default"].spy(function (params, callback) {
				callback({ statusCode: 401 });
			});
		});

		it("should return error", function (done) {
			(0, _stepsCreateStageStepJs2["default"])(conan, context, function (error) {
				should.exist(error);
				done();
			});
		});
	});
});