"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _conanJs = require("../../../../conan.js");

var _conanJs2 = _interopRequireDefault(_conanJs);

var _stepsFindRoleByNameStepJs = require("../../steps/findRoleByNameStep.js");

var _stepsFindRoleByNameStepJs2 = _interopRequireDefault(_stepsFindRoleByNameStepJs);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

describe(".findRoleByNameStep(event, context, stepDone)", function () {
	var conan = undefined,
	    conanConfig = undefined,
	    stepParameters = undefined,
	    awsError = undefined,
	    awsData = undefined,
	    stepReturnData = undefined,
	    context = undefined;

	var iam = {
		getRole: _sinon2["default"].spy(function (params, callback) {
			callback(awsError, awsData);
		})
	};

	var AWS = {
		IAM: _sinon2["default"].spy(function () {
			return iam;
		})
	};

	beforeEach(function () {
		conanConfig = {
			region: "us-east-1"
		};
		conan = new _conanJs2["default"](conanConfig);

		stepParameters = {
			name: "Conan"
		};

		context = {
			parameters: stepParameters,
			dependencies: { AWS: AWS },
			results: {}
		};

		awsData = null;
		awsError = null;
	});

	it("should be a function", function () {
		(typeof _stepsFindRoleByNameStepJs2["default"]).should.equal("function");
	});

	describe("(Role is Found)", function () {
		beforeEach(function (done) {
			awsData = {
				Role: {
					Arn: "arn:aws:lambda:us-east-1:123895237541:role:SomeRole"
				}
			};

			(0, _stepsFindRoleByNameStepJs2["default"])(conan, context, function (error, data) {
				stepReturnData = data;
				done();
			});
		});

		it("should set the designated region on the lambda client", function () {
			AWS.IAM.calledWith({
				region: conanConfig.region
			}).should.be["true"];
		});

		it("should call AWS with the designated role name parameter", function () {
			iam.getRole.calledWith({
				RoleName: stepParameters.name
			}).should.be["true"];
		});

		it("should return the found role id", function () {
			stepReturnData.should.eql({
				role: {
					id: awsData.Role.Arn
				}
			});
		});
	});

	describe("(Role is not Found)", function () {
		beforeEach(function (done) {
			awsError = { statusCode: 404 };
			(0, _stepsFindRoleByNameStepJs2["default"])(conan, context, function (error, data) {
				stepReturnData = data;
				done();
			});
		});

		it("should return the lambda id as null", function () {
			stepReturnData.should.eql({
				role: {
					id: null
				}
			});
		});
	});

	describe("(Unknown Error is Returned)", function () {
		it("should return an error which stops the step runner", function (done) {
			var errorMessage = "AWS returned status code 401";
			awsError = { statusCode: 401, message: errorMessage };
			(0, _stepsFindRoleByNameStepJs2["default"])(conan, context, function (error) {
				error.message.should.eql(errorMessage);
				done();
			});
		});
	});
});