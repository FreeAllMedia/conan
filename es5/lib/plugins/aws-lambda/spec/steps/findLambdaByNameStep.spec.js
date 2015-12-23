"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

var _stepsFindLambdaByNameStepJs = require("../../steps/findLambdaByNameStep.js");

var _stepsFindLambdaByNameStepJs2 = _interopRequireDefault(_stepsFindLambdaByNameStepJs);

describe("findLambdaByNameStep", function () {
	var getFunctionSpy = undefined,
	    constructorSpy = undefined,
	    conan = undefined,
	    context = undefined,
	    should = undefined;

	var Lambda = (function () {
		function Lambda(parameters) {
			_classCallCheck(this, Lambda);

			constructorSpy(parameters);
		}

		_createClass(Lambda, [{
			key: "getFunction",
			value: function getFunction(params, callback) {
				getFunctionSpy(params, callback);
			}
		}]);

		return Lambda;
	})();

	beforeEach(function () {
		constructorSpy = _sinon2["default"].spy();
		getFunctionSpy = _sinon2["default"].spy(function (params, callback) {
			callback();
		});
		should = _chai2["default"].should();

		context = {
			parameters: {
				name: "test Lambda"
			},
			dependencies: {
				aws: {
					Lambda: Lambda
				}
			}
		};

		conan = { config: { "region": "us-east-1" }
		};
	});

	it("should be a function", function () {
		(typeof _stepsFindLambdaByNameStepJs2["default"]).should.equal("function");
	});

	describe("(parameters)", function () {
		beforeEach(function (done) {
			(0, _stepsFindLambdaByNameStepJs2["default"])(conan, context, function () {
				done();
			});
		});

		it("should send the appropiate parameters to the AWS get function call", function () {
			getFunctionSpy.firstCall.args[0].should.eql({
				FunctionName: context.parameters.name
			});
		});

		it("should set the constructor parameters", function () {
			constructorSpy.firstCall.args[0].should.eql({
				"region": conan.config.region
			});
		});
	});

	describe("(lambda not found)", function () {
		beforeEach(function () {
			getFunctionSpy = _sinon2["default"].spy(function (params, callback) {
				callback({ statusCode: 404 });
			});
		});

		it("should return false for that lambda", function (done) {
			(0, _stepsFindLambdaByNameStepJs2["default"])(conan, context, function (error, result) {
				result.lambda.found.should.equal(false);
				done();
			});
		});
	});

	describe("(lambda found)", function () {
		var responseData = undefined;

		beforeEach(function () {
			responseData = { Configuration: {} };
			getFunctionSpy = _sinon2["default"].spy(function (params, callback) {
				callback(null, responseData);
			});
		});

		it("should return true for that lambda", function (done) {
			(0, _stepsFindLambdaByNameStepJs2["default"])(conan, context, function (error, result) {
				result.lambda.found.should.equal(true);
				done();
			});
		});

		it("should return the response data for the lambda", function (done) {
			(0, _stepsFindLambdaByNameStepJs2["default"])(conan, context, function (error, result) {
				result.lambda.response.should.eql(responseData);
				done();
			});
		});
	});

	describe("(unknown error)", function () {
		beforeEach(function () {
			getFunctionSpy = _sinon2["default"].spy(function (params, callback) {
				callback({ statusCode: 401 });
			});
		});

		it("should return error", function (done) {
			(0, _stepsFindLambdaByNameStepJs2["default"])(conan, context, function (error) {
				should.exist(error);
				done();
			});
		});
	});
});