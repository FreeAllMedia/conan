"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _conanJs = require("../../../../conan.js");

var _conanJs2 = _interopRequireDefault(_conanJs);

var _stepsAttachRolePolicyStepJs = require("../../steps/attachRolePolicyStep.js");

var _stepsAttachRolePolicyStepJs2 = _interopRequireDefault(_stepsAttachRolePolicyStepJs);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

describe(".attachRolePolicyStep(conan, context, stepDone)", function () {
	var conan = undefined,
	    context = undefined,
	    stepDone = undefined,
	    awsResponseError = undefined,
	    awsResponseData = undefined,
	    stepReturnError = undefined,
	    should = undefined,
	    parameters = undefined;

	var mockIam = {
		attachRolePolicy: _sinon2["default"].spy(function (params, callback) {
			callback(awsResponseError, awsResponseData);
		})
	};

	var MockAWS = {
		IAM: _sinon2["default"].spy(function () {
			return mockIam;
		})
	};

	beforeEach(function (done) {
		should = _chai2["default"].should();
		conan = new _conanJs2["default"]({
			region: "us-east-1"
		});

		parameters = new ((function () {
			function MockConanAwsLambda() {
				_classCallCheck(this, MockConanAwsLambda);
			}

			_createClass(MockConanAwsLambda, [{
				key: "role",
				value: function role() {
					return "TestRolePolicy";
				}
			}]);

			return MockConanAwsLambda;
		})())();

		context = {
			parameters: parameters,
			libraries: { AWS: MockAWS },
			results: {}
		};

		awsResponseData = {};
		awsResponseError = null;

		stepDone = function (afterStepCallback) {
			return function (error) {
				stepReturnError = error;
				afterStepCallback();
			};
		};

		(0, _stepsAttachRolePolicyStepJs2["default"])(conan, context, stepDone(done));
	});

	it("should be a function", function () {
		(typeof _stepsAttachRolePolicyStepJs2["default"]).should.equal("function");
	});

	it("should set the designated region on the lambda client", function () {
		MockAWS.IAM.calledWith({
			region: conan.config.region
		}).should.be["true"];
	});

	it("should call AWS with the designated parameters", function () {
		mockIam.attachRolePolicy.calledWith({
			RoleName: context.parameters.role(),
			PolicyArn: "arn:aws:iam::aws:policy/AWSLambdaExecute"
		}).should.be["true"];
	});

	describe("(Policy Attached)", function () {
		it("should return no error", function () {
			should.not.exist(stepReturnError);
		});
	});

	describe("(Unknown Error is Returned)", function () {
		var errorMessage = undefined;

		beforeEach(function (done) {
			errorMessage = "AWS returned status code 401";
			awsResponseError = { statusCode: 401, message: errorMessage };
			(0, _stepsAttachRolePolicyStepJs2["default"])(conan, context, stepDone(done));
		});

		it("should return an error which stops the step runner", function () {
			stepReturnError.message.should.eql(errorMessage);
		});
	});
});