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

var _stepsUpdateApiStageStepJs = require("../../steps/updateApiStageStep.js");

var _stepsUpdateApiStageStepJs2 = _interopRequireDefault(_stepsUpdateApiStageStepJs);

describe("updateApiStageStep", function () {
	var updateStageSpy = undefined,
	    constructorSpy = undefined,
	    conan = undefined,
	    context = undefined,
	    parameters = undefined,
	    restApiId = undefined,
	    stageName = undefined,
	    should = undefined;

	var APIGateway = (function () {
		function APIGateway(constructorParameters) {
			_classCallCheck(this, APIGateway);

			constructorSpy(constructorParameters);
		}

		_createClass(APIGateway, [{
			key: "updateStage",
			value: function updateStage(params, callback) {
				updateStageSpy(params, callback);
			}
		}]);

		return APIGateway;
	})();

	beforeEach(function () {
		conan = new _conanJs2["default"]({
			region: "us-east-1"
		});

		constructorSpy = _sinon2["default"].spy();
		updateStageSpy = _sinon2["default"].spy(function (params, callback) {
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
		stageName = "testStage";

		context = {
			parameters: parameters,
			results: {
				restApiId: restApiId,
				stageName: stageName
			},
			libraries: {
				AWS: {
					APIGateway: APIGateway
				}
			}
		};
	});

	it("should be a function", function () {
		(typeof _stepsUpdateApiStageStepJs2["default"]).should.equal("function");
	});

	describe("(parameters)", function () {
		beforeEach(function (done) {
			(0, _stepsUpdateApiStageStepJs2["default"])(conan, context, function () {
				done();
			});
		});

		it("should send the appropiate parameters to the AWS get function call", function () {
			updateStageSpy.firstCall.args[0].should.eql({
				restApiId: restApiId,
				stageName: "testStage",
				patchOperations: [{
					op: "replace",
					path: "/description",
					value: "testStage description"
				}]
			});
		});

		it("should set the constructor parameters", function () {
			constructorSpy.firstCall.args[0].should.eql({
				region: conan.config.region
			});
		});
	});

	describe("(rest api id not present)", function () {
		beforeEach(function () {
			delete context.results.restApiId;
			updateStageSpy = _sinon2["default"].spy();
		});

		it("should skip the function call entirely", function (done) {
			(0, _stepsUpdateApiStageStepJs2["default"])(conan, context, function () {
				updateStageSpy.called.should.be["false"];
				done();
			});
		});
	});

	describe("(stage name not present)", function () {
		beforeEach(function () {
			delete context.results.stageName;
			updateStageSpy = _sinon2["default"].spy();
		});

		it("should skip the function call entirely", function (done) {
			(0, _stepsUpdateApiStageStepJs2["default"])(conan, context, function () {
				updateStageSpy.called.should.be["false"];
				done();
			});
		});
	});

	describe("(api stage updated)", function () {
		var responseData = undefined;

		beforeEach(function () {
			responseData = { stageName: "testStage", deploymentId: 3 };
			updateStageSpy = _sinon2["default"].spy(function (params, callback) {
				callback(null, responseData);
			});
		});

		it("should return with no error for that api", function (done) {
			(0, _stepsUpdateApiStageStepJs2["default"])(conan, context, function (error) {
				should.not.exist(error);
				done();
			});
		});

		it("should return the new stage name for that stage", function (done) {
			(0, _stepsUpdateApiStageStepJs2["default"])(conan, context, function (error, results) {
				results.stageName.should.equal(responseData.stageName);
				done();
			});
		});

		it("should return the deployment id for that stage", function (done) {
			(0, _stepsUpdateApiStageStepJs2["default"])(conan, context, function (error, results) {
				results.deploymentId.should.equal(responseData.deploymentId);
				done();
			});
		});
	});

	describe("(unknown error)", function () {
		beforeEach(function () {
			updateStageSpy = _sinon2["default"].spy(function (params, callback) {
				callback({ statusCode: 401 });
			});
		});

		it("should return error", function (done) {
			(0, _stepsUpdateApiStageStepJs2["default"])(conan, context, function (error) {
				should.exist(error);
				done();
			});
		});
	});
});