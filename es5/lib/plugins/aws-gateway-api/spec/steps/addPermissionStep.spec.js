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

var _stepsAddPermissionStepJs = require("../../steps/addPermissionStep.js");

var _stepsAddPermissionStepJs2 = _interopRequireDefault(_stepsAddPermissionStepJs);

describe("addPermissionStep", function () {
	var addPermissionSpy = undefined,
	    constructorSpy = undefined,
	    conan = undefined,
	    context = undefined,
	    parameters = undefined,
	    restApiId = undefined,
	    should = undefined;

	var Lambda = (function () {
		function Lambda(constructorParameters) {
			_classCallCheck(this, Lambda);

			constructorSpy(constructorParameters);
		}

		_createClass(Lambda, [{
			key: "addPermission",
			value: function addPermission(params, callback) {
				addPermissionSpy(params, callback);
			}
		}]);

		return Lambda;
	})();

	beforeEach(function () {
		conan = new _conanJs2["default"]({
			region: "us-east-1"
		});

		constructorSpy = _sinon2["default"].spy();
		addPermissionSpy = _sinon2["default"].spy(function (params, callback) {
			callback();
		});
		should = _chai2["default"].should();

		restApiId = "283mds2";

		parameters = new ((function () {
			function MockConanAwsParameters() {
				_classCallCheck(this, MockConanAwsParameters);
			}

			_createClass(MockConanAwsParameters, [{
				key: "lambda",
				value: function lambda() {
					return "listAccountItems";
				}
			}]);

			return MockConanAwsParameters;
		})())();

		context = {
			parameters: parameters,
			results: {
				restApiId: restApiId
			},
			libraries: {
				AWS: {
					Lambda: Lambda
				}
			}
		};
	});

	it("should be a function", function () {
		(typeof _stepsAddPermissionStepJs2["default"]).should.equal("function");
	});

	describe("(parameters)", function () {
		beforeEach(function (done) {
			(0, _stepsAddPermissionStepJs2["default"])(conan, context, function () {
				done();
			});
		});

		it("should send the appropiate parameters to the AWS call", function () {
			addPermissionSpy.firstCall.args[0].should.eql({
				// SourceArn: `arn:aws:apigateway:us-east-1::/restapis/${restApiId}/*`,
				Action: "lambda:InvokeFunction",
				Principal: "apigateway.amazonaws.com",
				FunctionName: "listAccountItems",
				StatementId: "1"
			});
		});

		it("should set the constructor parameters", function () {
			constructorSpy.firstCall.args[0].should.eql({
				region: conan.config.region
			});
		});
	});

	describe("(permission added)", function () {
		var responseData = undefined;

		beforeEach(function () {
			responseData = {};
			addPermissionSpy = _sinon2["default"].spy(function (awsParameters, callback) {
				callback(null, responseData);
			});
		});

		it("should return with no error", function (done) {
			(0, _stepsAddPermissionStepJs2["default"])(conan, context, function (error) {
				should.not.exist(error);
				done();
			});
		});
	});

	describe("(lambda is not present)", function () {
		beforeEach(function () {
			parameters = new function MockConanAwsParameters() {
				_classCallCheck(this, MockConanAwsParameters);
			}();

			context = {
				parameters: parameters,
				results: {
					restApiId: restApiId
				},
				libraries: {
					AWS: {
						Lambda: Lambda
					}
				}
			};
			addPermissionSpy = _sinon2["default"].spy();
		});

		it("should skip the function call entirely", function (done) {
			(0, _stepsAddPermissionStepJs2["default"])(conan, context, function () {
				addPermissionSpy.called.should.be["false"];
				done();
			});
		});
	});

	// commented until specific permissions to resource or rest api
	// describe("(rest api id is not present)", () => {
	// 	beforeEach(() => {
	// 		delete context.results.restApiId;
	// 		addPermissionSpy = sinon.spy();
	// 	});
	//
	// 	it("should skip the function call entirely", done => {
	// 		addPermissionStep(conan, context, () => {
	// 			addPermissionSpy.called.should.be.false;
	// 			done();
	// 		});
	// 	});
	// });

	describe("(conflict error or already exists error)", function () {
		beforeEach(function () {
			addPermissionSpy = _sinon2["default"].spy(function (params, callback) {
				callback({ statusCode: 409 });
			});
		});

		it("should return no error -ignore-", function (done) {
			(0, _stepsAddPermissionStepJs2["default"])(conan, context, function (error) {
				should.not.exist(error);
				done();
			});
		});
	});

	describe("(unknown error)", function () {
		beforeEach(function () {
			addPermissionSpy = _sinon2["default"].spy(function (params, callback) {
				callback({ statusCode: 401 });
			});
		});

		it("should return an error when is just one", function (done) {
			(0, _stepsAddPermissionStepJs2["default"])(conan, context, function (error) {
				should.exist(error);
				done();
			});
		});
	});
});