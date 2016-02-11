"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _conan = require("../../../../conan.js");

var _conan2 = _interopRequireDefault(_conan);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

var _findMethodResponseStep = require("../../steps/findMethodResponseStep.js");

var _findMethodResponseStep2 = _interopRequireDefault(_findMethodResponseStep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

describe("findMethodResponseStep", function () {
	var getMethodResponseSpy = undefined,
	    constructorSpy = undefined,
	    conan = undefined,
	    context = undefined,
	    parameters = undefined,
	    restApiId = undefined,
	    apiResourceId = undefined,
	    should = undefined;

	var APIGateway = function () {
		function APIGateway(constructorParameters) {
			_classCallCheck(this, APIGateway);

			constructorSpy(constructorParameters);
		}

		_createClass(APIGateway, [{
			key: "getMethodResponse",
			value: function getMethodResponse(params, callback) {
				getMethodResponseSpy(params, callback);
			}
		}]);

		return APIGateway;
	}();

	beforeEach(function () {
		conan = new _conan2.default({
			region: "us-east-1"
		});

		constructorSpy = _sinon2.default.spy();
		getMethodResponseSpy = _sinon2.default.spy(function (params, callback) {
			callback();
		});
		should = _chai2.default.should();

		parameters = new (function () {
			function MockConanAwsParameters() {
				_classCallCheck(this, MockConanAwsParameters);
			}

			_createClass(MockConanAwsParameters, [{
				key: "method",
				value: function method() {
					return "GET";
				}
			}, {
				key: "statusCodes",
				value: function statusCodes() {
					return { "200": "", "404": "Not Found*" };
				}
			}]);

			return MockConanAwsParameters;
		}())();

		restApiId = "23sysh";
		apiResourceId = "23sysh3";

		context = {
			parameters: parameters,
			results: {
				restApiId: restApiId,
				apiResourceId: apiResourceId
			},
			libraries: {
				AWS: {
					APIGateway: APIGateway
				}
			}
		};
	});

	it("should be a function", function () {
		(typeof _findMethodResponseStep2.default === "undefined" ? "undefined" : _typeof(_findMethodResponseStep2.default)).should.equal("function");
	});

	describe("(parameters)", function () {
		beforeEach(function (done) {
			(0, _findMethodResponseStep2.default)(conan, context, function () {
				done();
			});
		});

		it("should send the appropiate parameters to the AWS get function call", function () {
			getMethodResponseSpy.firstCall.args[0].should.eql({
				httpMethod: parameters.method(),
				resourceId: context.results.apiResourceId,
				restApiId: restApiId,
				statusCode: "200"
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
			getMethodResponseSpy = _sinon2.default.spy();
		});

		it("should skip the function call entirely", function (done) {
			(0, _findMethodResponseStep2.default)(conan, context, function () {
				getMethodResponseSpy.called.should.be.false;
				done();
			});
		});
	});

	describe("(api resource id is not present)", function () {
		beforeEach(function () {
			delete context.results.apiResourceId;
			getMethodResponseSpy = _sinon2.default.spy();
		});

		it("should skip the function call entirely", function (done) {
			(0, _findMethodResponseStep2.default)(conan, context, function () {
				getMethodResponseSpy.called.should.be.false;
				done();
			});
		});
	});

	describe("(no response methods not found)", function () {
		beforeEach(function () {
			getMethodResponseSpy = _sinon2.default.spy(function (params, callback) {
				callback({ statusCode: 404 });
			});
		});

		it("should return no error", function (done) {
			(0, _findMethodResponseStep2.default)(conan, context, function (error) {
				should.not.exist(error);
				done();
			});
		});

		it("should return an emtpy array on status codes", function (done) {
			(0, _findMethodResponseStep2.default)(conan, context, function (error, result) {
				result.responseStatusCodes.should.eql([]);
				done();
			});
		});
	});

	describe("(response method found)", function () {
		var responseData = undefined;

		beforeEach(function () {
			responseData = { statusCode: "200" };
			getMethodResponseSpy = _sinon2.default.spy(function (params, callback) {
				callback(null, responseData);
			});
		});

		it("should return the status codes", function (done) {
			(0, _findMethodResponseStep2.default)(conan, context, function (error, result) {
				result.responseStatusCodes.should.eql(["200", "200"]);
				done();
			});
		});
	});

	describe("(unknown error)", function () {
		beforeEach(function () {
			getMethodResponseSpy = _sinon2.default.spy(function (params, callback) {
				callback({ statusCode: 401 });
			});
		});

		it("should return error", function (done) {
			(0, _findMethodResponseStep2.default)(conan, context, function (error) {
				should.exist(error);
				done();
			});
		});
	});
});